import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

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
    task.links && task.links.length > 0 ? [...task.links] : [""]
  );
  const textareaRef = useRef(null);

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
            : [""]
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
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
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
        category: editedTask.category,
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
        <div className="modal-dialog modal-xl">
          <div
            className="modal-content taskModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body row m-0 gap-2">
              {error && <div className="error-message">{error}</div>}

              <form className="row col-12 col-lg-5 text-start m-0">
                <div className="inputContainer col-12">
                  <label>task title *</label>
                  <input
                    type="text"
                    value={editedTask.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="inputContainer col-12">
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

                <div className="inputContainer col-12">
                  <label htmlFor="category">category (optional)</label>
                  <select
                    id="category"
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    value={editedTask.category}
                  >
                    <option disabled value="">
                      select the task category
                    </option>
                    <option value="work">work</option>
                    <option value="personal">personal</option>
                    <option value="workout">workout</option>
                    <option value="entertainment">entertainment</option>
                    <option value="daily">daily</option>
                  </select>
                </div>

                <div className="inputContainer col-12">
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
                          className="removeBtn mt-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLinkField}
                    className="addBtn"
                  >
                    + Add Another Link
                  </button>
                </div>

                <div className="inputContainer col-12">
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

                <p className="col-12">status: {currentTask.status}</p>

                <div className="modal-footer col-12 justify-content-start px-0">
                  <button onClick={handleDelete} disabled={loading}>
                    Delete Task
                  </button>

                  <button onClick={onClose} disabled={loading}>
                    Cancel
                  </button>

                  <button onClick={handleSave} disabled={loading}>
                    {loading ? "applying..." : "apply changes"}
                  </button>
                </div>
              </form>

              <div className="col-12 col-lg-6 activitySection row text-start m-0">
                <h4 className="col-12 p-0">Task activity</h4>
                <div className="activityContent col-12">
                  {currentTask.activities &&
                  currentTask.activities.length > 0 ? (
                    currentTask.activities.map((activity, index) => (
                      <div key={index} className="activityItem my-1">
                        <h6 className="m-0">
                          {formatTimestamp(activity.timestamp)}
                        </h6>
                        <h6 className="mt-1">{linkifyText(activity.text)}</h6>
                      </div>
                    ))
                  ) : (
                    <p>no activities yet</p>
                  )}
                </div>
                <div className="activityInput col-12 p-0">
                  <textarea
                    placeholder="post an update ..."
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
                      width: "80%",
                      resize: "none",
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
