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

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

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
      await updateDoc(taskRef, {
        title: editedTask.title,
        description: editedTask.description,
        links: editedTask.links,
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
                    style={{
                      resize: "none",
                      minHeight: "80px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>

                <div className="inputContainer col-12">
                  <label>Links</label>
                  <input
                    type="text"
                    value={editedTask.links || ""}
                    onChange={(e) => handleInputChange("links", e.target.value)}
                    disabled={loading}
                    placeholder="https://example.com"
                  />
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
