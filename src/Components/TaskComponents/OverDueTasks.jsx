import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import LoadingSpinner from "../ReusableComponents/LoaderSpinner";
import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  doc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { MdDeleteForever } from "react-icons/md";
import TaskDetails from "./TaskDetails";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";
import CategoryTab from "./CategoryTab";
import CustomizedComponent from "../ReusableComponents/CustomizedComponent/CustomizedComponent";

export default function OverDueTasks() {
  const { currentUser } = useAuth();
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const element = document.querySelector(".taskComp");

    if (element) {
      const rect = element.getBoundingClientRect();
      const offsetFromTop = rect.top;
      element.style.setProperty("--component-offset", `${offsetFromTop}px`);
    }
  }, [filteredTasks]);

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch (e) {
      return url.length > 30 ? url.substring(0, 30) + "..." : url;
    }
  };

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredTasks(overdueTasks);
    } else {
      setFilteredTasks(
        overdueTasks.filter((task) => task.category === selectedCategory),
      );
    }
  }, [selectedCategory, overdueTasks]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const calcDaysOverdue = (dueDate) => {
    if (!dueDate) return;

    const due = new Date(dueDate);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = today - due;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return Math.max(0, daysDiff);
  };

  const updateOverdueDays = async () => {
    if (!currentUser) return;

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
        where("status", "==", "overdue"),
      );

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasks = [];
          querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const task = {
              id: doc.id,
              ...taskData,

              daysOverdue:
                taskData.daysOverdue || calcDaysOverdue(taskData.dueDate),
            };
            tasks.push(task);
          });

          tasks.sort((a, b) => {
            const aIsPinned = a.pinned || false;
            const bIsPinned = b.pinned || false;

            if (aIsPinned && !bIsPinned) return -1;
            if (!aIsPinned && bIsPinned) return 1;
            if (aIsPinned && bIsPinned) return 0;

            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return -1;
            if (!b.dueDate) return 1;

            return new Date(a.dueDate) - new Date(b.dueDate);
          });

          setOverdueTasks(tasks);
          setError("");
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching overdue tasks:", err);
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
  }, [currentUser]);

  const togglePin = async (taskId) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      const task = overdueTasks.find((t) => t.id === taskId);
      const currentPinnedStatus = task.pinned || false;

      await updateDoc(taskRef, {
        pinned: !currentPinnedStatus,
      });
    } catch (err) {
      console.error("error toggling pin", err);
      setError("failed to update pin status");
    }
  };

  useEffect(() => {
    updateOverdueDays();

    const intervalId = setInterval(updateOverdueDays, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

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

  const getOverdue = (days) => {
    if (days === 0) return "due today";
    if (days === 1) return "1 day overdue";
    return `${days} days over due`;
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
        <CustomizedComponent imgSrc="/images/sorry.png" text={error} />
      </div>
    );
  }

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

  return (
    <>
      <div className="col-12 p-0">
        <CategoryTab
          onCategoryChange={handleCategoryChange}
          activeCategory={selectedCategory}
        />

        {filteredTasks.length === 0 ? (
          <div className="col-12 text-start py-4">
            <CustomizedComponent
              imgSrc="/images/well-done.png"
              text="Nothing is overdue .. yaaay"
            />
          </div>
        ) : (
          <div className="row gap-2 m-0 taskComp">
            {filteredTasks.map((task) => {
              const isPinned = task.pinned || false;
              return (
                <div
                  key={task.id}
                  className="taskItem col-md-8 col-12 col-lg-3 text-start overdueTask row justify-content-start align-items-center gap-1"
                >
                  <div className="col-12 row justify-content-between align-items-center m-0 p-0">
                    <h3 className="col-10 m-0 p-0">{task.title}</h3>
                    <span
                      className="col-2 p-0 pinIcon text-end"
                      onClick={() => togglePin(task.id)}
                    >
                      {isPinned ? <AiFillPushpin /> : <AiOutlinePushpin />}
                    </span>
                  </div>
                  <h6 className={`col-12 p-0 ${task.category}`}>
                    {task.category}
                  </h6>
                  <p className="col-12 m-0 p-0">
                    due to : {formatDate(task.dueDate)} <FaQuestionCircle />
                  </p>
                  <div className="col-12 m-0 p-0">
                    <ul className="linksList m-0 p-0">
                      {task.links &&
                        task.links.map((link, index) => (
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
                  <p className="col-12 m-0 p-0">
                    {getOverdue(
                      task.daysOverdue || calcDaysOverdue(task.dueDate),
                    )}
                    <FaClock />
                  </p>
                  <div className="actions m-0 row gap-1 justify-content-start align-items-center col-12 p-0">
                    <button
                      className="basicBtnStyle"
                      onClick={() => markAsDone(task.id)}
                    >
                      done <FaCheckCircle />
                    </button>
                    <button
                      className="basicBtnStyle"
                      onClick={() => handleTaskDetails(task)}
                    >
                      details <FaExclamationCircle />
                    </button>
                    <button
                      className="basicBtnStyle"
                      onClick={() => deleteTask(task.id)}
                    >
                      delete <MdDeleteForever />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
