import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { TiDelete } from "react-icons/ti";

export default function TaskDetails({
  task,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const [currentTask, setCurrentTask] = useState(task);
  const [editedTask, setEditedTask] = useState(task);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activityText, setActivityText] = useState("");
  const [taskLinks, setTaskLinks] = useState(
    task.links && task.links.length > 0 ? [...task.links] : [""],
  );
  const [subTaskText, setSubTaskText] = useState("");

  const textareaRef = useRef(null);
  const activityRef = useRef(null);

  const [selectedModalTab, setSelectedModalTab] = useState("details");

  useEffect(() => {
    if (!task.id) return;

    const taskRef = doc(db, "tasks", task.id);
    const unsubscribe = onSnapshot(taskRef, (doc) => {
      if (doc.exists()) {
        const updatedTask = { id: doc.id, ...doc.data() };
        setCurrentTask(updatedTask);
        setEditedTask(updatedTask);
        setTaskLinks(
          updatedTask.links && updatedTask.links.length > 0
            ? [...updatedTask.links]
            : [""],
        );
      }
    });

    return () => unsubscribe();
  }, [task.id]);

  useEffect(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }, 0);
  }, [currentTask]);

  useEffect(() => {
    if (activityRef.current && selectedModalTab === "activity") {
      activityRef.current.scrollTop = activityRef.current.scrollHeight;
    }
  }, [currentTask.activities, selectedModalTab]);

  const addLinkField = () => {
    setTaskLinks([...taskLinks, ""]);
  };

  const removeLinkField = (index) => {
    if (taskLinks.length === 1) return;
    const newLinks = [...taskLinks];
    newLinks.splice(index, 1);
    setTaskLinks(newLinks);
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...taskLinks];
    newLinks[index] = value;
    setTaskLinks(newLinks);
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch (e) {
      return url.length > 30 ? url.substring(0, 30) + "..." : url;
    }
  };

  const linkifyText = (text) => {
    // safety check for firebase mistaken delete
    if (!text || typeof text !== "string") {
      return text || "";
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (!part) return null;
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="activity-link"
          >
            {getDomainFromUrl(part)}
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const modalElement = document.getElementById("taskDetailsModal");
    if (modalElement) {
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      document.body.appendChild(backdrop);
    }

    return () => {
      if (modalElement) {
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
        document.body.classList.remove("modal-open");
      }

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };
  }, []);

  const calcStatus = (dueDate) => {
    if (!dueDate) return "pending";

    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);

    currentDate.setHours(0, 0, 0, 0);
    taskDueDate.setHours(0, 0, 0, 0);

    return taskDueDate < currentDate ? "overdue" : "pending";
  };

  const handleInputChange = (field, value) => {
    setEditedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedTask.title.trim()) {
      setError("task title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const taskRef = doc(db, "tasks", task.id);
      const newStatus = calcStatus(editedTask.dueDate);
      const nonEmptyLinks = taskLinks.filter((link) => link.trim() !== "");

      const existingActivities = currentTask.activities || [];

      let finalStatus = newStatus;
      if (existingActivities.length > 0 && finalStatus !== "overdue") {
        finalStatus = "inProgress";
      }

      await updateDoc(taskRef, {
        title: editedTask.title,
        description: editedTask.description,
        links: nonEmptyLinks.length > 0 ? nonEmptyLinks : null,
        dueDate: editedTask.dueDate,
        status: finalStatus,

        ...(finalStatus === "pending" && { daysOverdue: 0 }),
      });

      onTaskUpdated();
      onClose();
    } catch (err) {
      console.error("failed updating task", err);
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
      onTaskDeleted();
      onClose();
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleAddActivity = async () => {
    if (!activityText.trim()) return;

    setLoading(true);
    setError("");

    try {
      const taskRef = doc(db, "tasks", task.id);

      const newActivity = {
        text: activityText,
        timestamp: new Date(),
      };

      const existingActivities = currentTask.activities || [];

      await updateDoc(taskRef, {
        activities: [...existingActivities, newActivity],
        status: "inProgress",
      });

      setActivityText("");
    } catch (err) {
      console.error("failed adding activity", err);
      setError("Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubTask = async () => {
    if (!subTaskText.trim()) return;
    setLoading(true);
    setError("");

    try {
      const taskRef = doc(db, "tasks", task.id);

      const newSubtask = {
        text: subTaskText,
        status: "pending",
      };

      const existingSubTasks = currentTask.subTasks || [];

      await updateDoc(taskRef, {
        subTasks: [...existingSubTasks, newSubtask],
      });

      setSubTaskText("");
    } catch (err) {
      console.error("error addin subtask", err);
      setError("failed adding subtask");
    } finally {
      setLoading(false);
    }
  };

  const handleSubTaskCheck = async (index) => {
    setLoading(true);
    try {
      const taskRef = doc(db, "tasks", task.id);
      const updatedSubTasks = [...currentTask.subTasks];

      // toggle checked
      updatedSubTasks[index].status =
        updatedSubTasks[index].status === "done" ? "pending" : "done";
      await updateDoc(taskRef, {
        subTasks: updatedSubTasks,
      });
    } catch (err) {
      console.error("error updating subtask", err);
      setError("failed to update subtask");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubTask = async (index) => {
    setLoading(true);

    try {
      const taskRef = doc(db, "tasks", task.id);
      const updatedSubTasks = [...currentTask.subTasks];

      updatedSubTasks.splice(index, 1);
      await updateDoc(taskRef, {
        subTasks: updatedSubTasks,
      });
    } catch (err) {
      console.error("error deleting sub task", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (taskId) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "done",
        completedAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.error("error updating task:", err);
      setError("failed to update task");
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="taskDetailsModal"
        tabIndex="-1"
        aria-hidden="true"
        style={{ display: "none" }}
        onClick={onClose}
      >
        <div className="modal-dialog">
          <div
            className="modal-content taskModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body ">
              <h4 className="mb-3">{editedTask.title}</h4>
              <div className="detailActvityToggle pb-2">
                <button
                  className={selectedModalTab === "details" ? "selected" : ""}
                  onClick={() => setSelectedModalTab("details")}
                >
                  details
                </button>
                <button
                  className={selectedModalTab === "activity" ? "selected" : ""}
                  onClick={() => setSelectedModalTab("activity")}
                >
                  activity
                </button>
                <button
                  className={selectedModalTab === "sub_tasks" ? "selected" : ""}
                  onClick={() => setSelectedModalTab("sub_tasks")}
                >
                  sub tasks
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}

              {selectedModalTab === "details" && (
                <form className="row text-start m-0">
                  <div className="inputContainer px-0 col-12">
                    <label>task title *</label>
                    <input
                      type="text"
                      value={editedTask.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="inputContainer px-0 col-12">
                    <label>Description</label>
                    <textarea
                      ref={textareaRef}
                      value={editedTask.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      disabled={loading}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      style={{
                        minHeight: "60px",
                        width: "100%",
                        resize: "none",
                      }}
                    />
                  </div>

                  <div className="inputContainer px-0 col-12">
                    <label>related links (optional)</label>
                    {taskLinks.map((link, index) => (
                      <div key={index} className="link-input-group mb-2">
                        <input
                          className="me-2"
                          type="text"
                          value={link}
                          onChange={(e) =>
                            handleLinkChange(index, e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                        {taskLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLinkField(index)}
                            className="basicBtnStyle removeBtn mt-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLinkField}
                      className="basicBtnStyle addBtn"
                    >
                      + Add Another Link
                    </button>
                  </div>

                  <div className="inputContainer px-0 col-12">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={formatDateForInput(editedTask.dueDate)}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 mt-2 px-0">
                    <p className="taskStatus">status: {currentTask.status}</p>
                  </div>

                  <div className="modal-footer col-12 justify-content-start px-0">
                    <button
                      type="button"
                      className="basicBtnStyle"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      Delete Task
                    </button>

                    <button
                      type="button"
                      className="basicBtnStyle"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="basicBtnStyle"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "applying..." : "apply changes"}
                    </button>
                  </div>
                </form>
              )}

              {selectedModalTab === "activity" && (
                <div className="activitySection text-start">
                  <div className="activityContent" ref={activityRef}>
                    {currentTask.activities &&
                    currentTask.activities.length > 0 ? (
                      currentTask.activities.map((activity, index) => (
                        <div key={index} className="activityItem my-2">
                          <h6 className="my-1">
                            {formatTimestamp(activity.timestamp)}
                          </h6>
                          <h6
                            className="my-1"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {linkifyText(activity.text)}
                          </h6>
                        </div>
                      ))
                    ) : (
                      <p className="py-3 m-0">no activities yet...</p>
                    )}
                  </div>
                  <div className="activityInput">
                    <textarea
                      placeholder="post update ..."
                      value={activityText}
                      onChange={(e) => setActivityText(e.target.value)}
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddActivity();
                        }
                      }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      style={{
                        minHeight: "50px",
                        maxHeight: "60px",
                        width: "80%",
                        resize: "none",
                        overflowY: "auto",
                      }}
                    />
                    <button onClick={handleAddActivity} disabled={loading}>
                      {loading ? "Posting..." : "Post"}
                    </button>
                    <button onClick={() => markAsDone(task.id)}>
                      set task complete
                    </button>
                  </div>
                </div>
              )}

              {selectedModalTab === "sub_tasks" && (
                <div className="subTasks text-start">
                  <div className="subTasksContent px-0 py-1">
                    {currentTask.subTasks && currentTask.subTasks.length > 0 ? (
                      currentTask.subTasks.map((subTask, index) => (
                        <>
                          <div
                            className={`subTasksItem p-1 my-1 ${
                              subTask.status === "done" ? "doneSubTask" : ""
                            }`}
                            key={index}
                          >
                            <input
                              type="checkbox"
                              checked={subTask.status === "done"}
                              onChange={() => handleSubTaskCheck(index)}
                            />
                            {subTask.status === "done" ? (
                              <p>
                                <del>{subTask.text}</del>
                              </p>
                            ) : (
                              <p>{subTask.text}</p>
                            )}
                            <span onClick={() => handleDeleteSubTask(index)}>
                              <TiDelete />
                            </span>
                          </div>
                        </>
                      ))
                    ) : (
                      <p className="py-3 m-0">no subtasks added yet...</p>
                    )}
                  </div>
                  <div className="subTasksInput row justify-content-start align-items-cent gap-1 m-0 p-0 pt-2">
                    <input
                      type="text"
                      value={subTaskText}
                      onChange={(e) => setSubTaskText(e.target.value)}
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddSubTask();
                        }
                      }}
                      placeholder="add new..."
                      className="col-lg-8 col-6"
                    />
                    <button
                      className="col-2"
                      onClick={handleAddSubTask}
                      disabled={loading}
                    >
                      add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
