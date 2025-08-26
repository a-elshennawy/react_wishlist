import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function TaskDetails({
  task,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const [editedTask, setEditedTask] = useState(task);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [taskLinks, setTaskLinks] = useState(
    task.links && task.links.length > 0 ? [...task.links] : [""]
  );

  useEffect(() => {
    setEditedTask(task);
    setTaskLinks(task.links && task.links.length > 0 ? [...task.links] : [""]);
  }, [task]);

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

      await updateDoc(taskRef, {
        title: editedTask.title,
        description: editedTask.description,
        category: editedTask.category,
        links: nonEmptyLinks.length > 0 ? nonEmptyLinks : null,
        dueDate: editedTask.dueDate,
        status: newStatus,

        ...(newStatus === "pending" && { daysOverdue: 0 }),
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

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      <div
        className="modal fade "
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
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}

              <form className="row justify-content-center align-items-center text-start gap-2">
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
                    value={editedTask.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={loading}
                    rows={3}
                    cols={35}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
                <div className="inputContainer col-12">
                  <label htmlFor="category">category (optional)</label>
                  <select
                    id="category"
                    onChange={(e) => setTaskCategory(e.target.value)}
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
                <div className="inputConatiner col-12">
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
                <p className="col-12">status: {editedTask.status}</p>
                <div className="modal-footer col-12">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
