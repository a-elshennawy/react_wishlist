import {
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";
import { MdDeleteForever, MdPending } from "react-icons/md";
import { TbProgressHelp } from "react-icons/tb";
import LoadingSpinner from "../ReusableComponents/LoaderSpinner";
import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import TaskDetails from "./TaskDetails/TaskDetails";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";
import CustomizedComponent from "../ReusableComponents/CustomizedComponent/CustomizedComponent";
import "./TasksComponent.css";

export default function Tasks({
  status,
  emptyStateMessage = "No tasks",
  emptyStateImage = null,
}) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showTodayTasksOnly, setShowTodayTasksOnly] = useState(true);

  useEffect(() => {
    const element = document.querySelector(".taskComp");

    if (element) {
      const rect = element.getBoundingClientRect();
      const offsetFromTop = rect.top + (status === "pending" ? 20 : 0);
      element.style.setProperty("--component-offset", `${offsetFromTop}px`);
    }
  }, [filteredTasks, showTodayTasksOnly, status]);

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch (e) {
      return url.length > 30 ? url.substring(0, 30) + "..." : url;
    }
  };

  const calcDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;

    const due = new Date(dueDate);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = today - due;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return Math.max(0, daysDiff);
  };

  const updateOverdueDays = async () => {
    if (!currentUser || status !== "overdue") return;

    try {
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        where("user", "==", currentUser.email),
        where("status", "==", "overdue"),
      );

      const querySnapshot = await getDocs(q);
      const updates = [];

      querySnapshot.forEach((taskDoc) => {
        const task = taskDoc.data();
        const daysOverdue = calcDaysOverdue(task.dueDate);

        if (task.daysOverdue !== daysOverdue) {
          updates.push(
            updateDoc(doc(db, "tasks", taskDoc.id), {
              daysOverdue: daysOverdue,
              lastOverdueCheck: new Date(),
            }),
          );
        }
      });

      if (updates.length > 0) {
        await Promise.all(updates);
        console.log(`Updated overdue days for ${updates.length} tasks`);
      }
    } catch (err) {
      console.error("Error updating overdue days:", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = null;

    try {
      setLoading(true);
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        where("user", "==", currentUser.email),
        where("status", "==", status),
      );

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedTasks = [];
          querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const task = {
              id: doc.id,
              ...taskData,
            };

            // Add daysOverdue calculation for overdue tasks
            if (status === "overdue") {
              task.daysOverdue =
                taskData.daysOverdue || calcDaysOverdue(taskData.dueDate);
            }

            fetchedTasks.push(task);
          });

          // Sort tasks
          fetchedTasks.sort((a, b) => {
            const aIsPinned = a.pinned || false;
            const bIsPinned = b.pinned || false;

            // Pinned tasks first
            if (aIsPinned && !bIsPinned) return -1;
            if (!aIsPinned && bIsPinned) return 1;

            // For done tasks, sort by completion date (newest first)
            if (status === "done") {
              const dateA = a.completedAt
                ? a.completedAt.toDate
                  ? a.completedAt.toDate()
                  : new Date(a.completedAt)
                : null;
              const dateB = b.completedAt
                ? b.completedAt.toDate
                  ? b.completedAt.toDate()
                  : new Date(b.completedAt)
                : null;

              if (dateA && dateB) {
                return dateB.getTime() - dateA.getTime();
              }
              if (dateA) return -1;
              if (dateB) return 1;
              return 0;
            }

            // For other statuses, sort by due date
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return -1;
            if (!b.dueDate) return 1;

            return new Date(a.dueDate) - new Date(b.dueDate);
          });

          setTasks(fetchedTasks);
          setFilteredTasks(fetchedTasks);
          setError("");
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching ${status} tasks:`, err);
          setError("failed to load tasks");
          setLoading(false);
        },
      );
    } catch (err) {
      console.error("error setting up listener:", err);
      setError("failed to load tasks");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, status]);

  // Update overdue days for overdue tasks
  useEffect(() => {
    if (status === "overdue") {
      updateOverdueDays();
      const intervalId = setInterval(updateOverdueDays, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [currentUser, status]);

  const togglePin = async (taskId) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      const task = tasks.find((t) => t.id === taskId);
      const currentPinnedStatus = task.pinned || false;

      await updateDoc(taskRef, {
        pinned: !currentPinnedStatus,
      });
    } catch (err) {
      console.error("error toggling pin", err);
      setError("failed to update pin status");
    }
  };

  const markAsDone = async (taskId) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "done",
        completedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("error updating task:", err);
      setError("failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error("error deleting task:", err);
      setError("failed to delete task");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "no due date";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCompletionDate = (dateString) => {
    if (!dateString) return "unknown date";

    if (dateString.toDate) {
      const date = dateString.toDate();
      const options = { month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    }

    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const getOverdue = (days) => {
    if (days === 0) return "due today";
    if (days === 1) return "1 day overdue";
    return `${days} days over due`;
  };

  const getStatusIndicator = (task) => {
    switch (status) {
      case "pending":
        return (
          <p className="col-12 m-0 p-0">
            pending <MdPending />
          </p>
        );
      case "inProgress":
        return (
          <p className="col-12 m-0 p-0">
            in progress <TbProgressHelp />
          </p>
        );
      case "done":
        return (
          <p className="col-12 m-0 p-0">
            completed at : {formatCompletionDate(task.completedAt)}
            <FaCheckCircle />
          </p>
        );
      case "overdue":
        return (
          <p className="col-12 m-0 p-0">
            {getOverdue(task.daysOverdue || calcDaysOverdue(task.dueDate))}
            <FaClock />
          </p>
        );
      default:
        return null;
    }
  };

  const handleTaskDetails = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleCloseDetails = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    console.log("Task updated successfully");
  };

  const handleTaskDeleted = () => {
    console.log("Task deleted successfully");
  };

  if (loading) {
    return (
      <div className="col-12 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12">
        <CustomizedComponent imgSrc="/images/sorry.webp" text={error} />
      </div>
    );
  }

  return (
    <>
      <div className="col-12 p-0">
        {filteredTasks.length === 0 ? (
          <div className="col-12 text-start py-4">
            <CustomizedComponent
              imgSrc={emptyStateImage}
              text={emptyStateMessage}
            />
          </div>
        ) : (
          <>
            <div className="scrollWrapper">
              <div className="taskComp m-0">
                {filteredTasks.map((task) => {
                  const isPinned = task.pinned || false;
                  return (
                    <div key={task.id} className={`taskItem text-start m-0`}>
                      <div className="m-0 p-0">
                        <h3 className="m-0 p-0">{task.title}</h3>
                        <span
                          className={`p-0 pinIcon ${isPinned ? "pinned" : ""}`}
                          onClick={() => togglePin(task.id)}
                        >
                          {isPinned ? <AiFillPushpin /> : <AiOutlinePushpin />}
                        </span>
                      </div>

                      {/* Due date */}
                      {task.status !== "done" && task.dueDate ? (
                        <p className="m-0 p-0">
                          due to: {formatDate(task.dueDate)}
                          {status === "overdue" && <FaQuestionCircle />}
                        </p>
                      ) : (
                        status !== "done" && (
                          <p className="m-0 p-0">task has no due date</p>
                        )
                      )}

                      {/* Links */}
                      {task.links && (
                        <>
                          <div className="m-0 p-0">
                            <ul className="linksList m-0 p-0">
                              {task.links.map((link, index) => (
                                <li key={index} className="linkItem">
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="task-link"
                                  >
                                    {getDomainFromUrl(link)}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      {/* Status indicator */}
                      {getStatusIndicator(task)}

                      {/* Actions */}
                      <div className="actions m-0 pt-2 pb-0 px-0">
                        {status !== "done" && (
                          <button
                            className="glassmorphism"
                            onClick={() => markAsDone(task.id)}
                          >
                            <FaCheckCircle size={20} />
                          </button>
                        )}
                        <button
                          className="glassmorphism"
                          onClick={() => handleTaskDetails(task)}
                        >
                          <FaExclamationCircle size={20} />
                        </button>
                        <button
                          className="glassmorphism"
                          onClick={() => deleteTask(task.id)}
                        >
                          <MdDeleteForever size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {showTaskDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={handleCloseDetails}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </>
  );
}
