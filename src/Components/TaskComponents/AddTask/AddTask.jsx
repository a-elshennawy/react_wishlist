import "./AddTask.css";
import { useState, useRef, useEffect } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { db } from "../../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../Contexts/AuthContext";
import { CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import { IoMdAddCircle } from "react-icons/io";
import { MdAddLink, MdCancel } from "react-icons/md";

function AddTask() {
  const { currentUser } = useAuth();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskLinks, setTaskLinks] = useState([""]);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [btnIsHovered, setBtnIsHovered] = useState(false);
  const modalRef = useRef(null);

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
        links: nonEmptyLinks.length > 0 ? nonEmptyLinks : null,
        user: currentUser.email,
        timestamp: serverTimestamp(),
        status: status,
        dueDate: dueDate || null,
        pinned: false,
      });

      setTaskTitle("");
      setTaskDesc("");
      setTaskLinks([""]);
      setDueDate("");

      setIsOpen(false);
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="col-12 text-start py-2 px-0">
        <button
          className="addTaskBtn basicBtnStyle"
          onClick={() => setIsOpen(true)}
        >
          <IoAddCircleSharp /> Add Task
        </button>
        <AnimatePresence>
          {isOpen && (
            <>
              <div className="outerContainer">
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 200 }}
                  transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
                  className="addTaskModal glassmorphism"
                  ref={modalRef}
                >
                  <button
                    className="colseBtn"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    <MdCancel size={24} />
                  </button>
                  <form
                    onSubmit={addTask}
                    className="row justify-content-center align-items-center text-start m-0 gap-2"
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
                      <label>related links (optional)</label>
                      <AnimatePresence>
                        {taskLinks.map((link, index) => (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            key={index}
                            className="link-input-group mb-2"
                          >
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
                                <MdCancel />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button
                        type="button"
                        onClick={addLinkField}
                        className="basicBtnStyle addBtn"
                      >
                        <MdAddLink />
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
                    <div className="actions row justify-content-start align-items-center gap-2 col-12 m-0 py-2">
                      <button
                        className="glassmorphism formBtn"
                        type="submit"
                        disabled={loading}
                        onMouseEnter={() => setBtnIsHovered(true)}
                        onMouseLeave={() => setBtnIsHovered(false)}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <div className="btn-content">
                            <span
                              className={`btn-text ${btnIsHovered ? "show" : ""}`}
                            >
                              add task
                            </span>
                            <IoMdAddCircle size={24} />
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default AddTask;
