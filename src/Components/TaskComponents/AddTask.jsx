import { useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";

export default function AddTask() {
  const { currentUser } = useAuth();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskLinks, setTaskLinks] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) return;

    try {
      const currentdate = new Date();
      const selectedDate = new Date(dueDate);

      currentdate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      const status = selectedDate < currentdate ? "overdue" : "pending";

      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        description: taskDesc,
        links: taskLinks || "none",
        user: currentUser.email,
        timestamp: serverTimestamp(),
        status: status,
        dueDate: dueDate,
      });

      setTaskTitle("");
      setTaskDesc("");
      setTaskLinks("");
      setDueDate("");

      const modalElement = document.getElementById("exampleModal");
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  return (
    <>
      <div className="col-12 text-start py-2">
        <button
          type="button"
          className="addTaskBtn"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <IoAddCircleSharp /> add task
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content taskModal">
              <div className="modal-body">
                <form
                  onSubmit={addTask}
                  className="row justify-content-center align-items-center text-start gap-2"
                >
                  <div className="inputContainer col-12">
                    <label htmlFor="taskTitle">task title *</label>
                    <input
                      type="text"
                      id="taskTitle"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="inputContainer col-12">
                    <label htmlFor="taskDesc">task description *</label>
                    <textarea
                      id="taskDesc"
                      rows={3}
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                        }
                      }}
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
                      required
                    />
                  </div>
                  <div className="inputContainer col-12">
                    <label htmlFor="taskLinks">links (optional)</label>
                    <input
                      type="text"
                      id="taskLinks"
                      value={taskLinks}
                      onChange={(e) => setTaskLinks(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="inputContainer col-12">
                    <label htmlFor="taskDueDate">due date *</label>
                    <input
                      type="date"
                      id="taskDueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-footer col-12">
                    <button type="button" data-bs-dismiss="modal">
                      cancel
                    </button>
                    <button type="submit">Save task</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
