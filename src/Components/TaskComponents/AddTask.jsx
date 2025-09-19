import { useState, useRef, useEffect } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";

export default function AddTask() {
  const { currentUser } = useAuth();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskLinks, setTaskLinks] = useState([""]);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("show");
      modalRef.current.style.display = "none";
      document.body.classList.remove("modal-open");
    }

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  };

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
    const handleModalHidden = () => {
      closeModal();
    };

    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      }
    };
  }, []);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.add("show");
      modalRef.current.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      document.body.appendChild(backdrop);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) return;

    setLoading(true);

    try {
      const currentdate = new Date();
      const selectedDate = new Date(dueDate);

      currentdate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      const status = selectedDate < currentdate ? "overdue" : "pending";
      const nonEmptyLinks = taskLinks.filter((link) => link.trim() !== "");

      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        description: taskDesc || null,
        category: taskCategory || "no category",
        links: nonEmptyLinks.length > 0 ? nonEmptyLinks : null,
        user: currentUser.email,
        timestamp: serverTimestamp(),
        status: status,
        dueDate: dueDate || null,
        pinned: false,
      });

      setTaskTitle("");
      setTaskDesc("");
      setTaskCategory("");
      setTaskLinks([""]);
      setDueDate("");

      closeModal();
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-12 text-start py-2 px-0">
        <button
          type="button"
          className="addTaskBtn basicBtnStyle"
          onClick={openModal}
        >
          <IoAddCircleSharp /> add task
        </button>

        <div
          ref={modalRef}
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
                    <label htmlFor="taskDesc">task description</label>
                    <textarea
                      id="taskDesc"
                      rows={3}
                      cols={35}
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
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
                      value={taskCategory}
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
                  <div className="inputContainer col-12">
                    <label htmlFor="taskDueDate">due date (optional)</label>
                    <input
                      type="date"
                      id="taskDueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer pb-0 col-12">
                    <button
                      className="basicBtnStyle"
                      type="button"
                      onClick={closeModal}
                    >
                      cancel
                    </button>
                    <button
                      className="basicBtnStyle"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "adding..." : "add task"}
                    </button>
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
