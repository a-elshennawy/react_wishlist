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
} from "firebase/firestore";
import TaskDetails from "./TaskDetails";
import CategoryTab from "./CategoryTab";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";
import { MdDeleteForever, MdPending } from "react-icons/md";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function InProgressTasks() {
  const { currentUser } = useAuth();
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch (e) {
      return url.length > 30 ? url.substring(0, 30) + "..." : url;
    }
  };

  useEffect(() => {
    let tasksToFilter = inProgressTasks;

    if (selectedCategory !== "all") {
      tasksToFilter = tasksToFilter.filter(
        (task) => task.category === selectedCategory
      );
    }

    setFilteredTasks(tasksToFilter);
  }, [selectedCategory, inProgressTasks]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
        where("status", "==", "inProgress")
      );

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasks = [];
          querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
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

          setInProgressTasks(tasks);
          setFilteredTasks(tasks);
          setError("");
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching in progress tasks:", err);
          setError("failed to load tasks");
          setLoading(false);
        }
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
      const task = pendingTasks.find((t) => t.id === taskId);
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

  if (loading) {
    return (
      <div className="col-12 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12 text-center py-4">
        <p className="text-danger">{error}</p>
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
        <h4 className="text-start">
          you have {filteredTasks.length} tasks in progress
        </h4>
        {filteredTasks.length === 0 ? (
          <div className="col-12 text-start py-4">
            <p>No tasks in progress 😌</p>
          </div>
        ) : (
          <div className="row gap-2 m-0">
            {filteredTasks.map((task) => {
              const isPinned = task.pinned || false;

              return (
                <div
                  key={task.id}
                  className="taskItem col-md-8 col-12 col-lg-3 text-start pendingTask row justify-content-start align-items-center gap-1"
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
                  <h6 className={`col-12 m-0 p-0 ${task.category} `}>
                    {task.category}
                  </h6>
                  {task.dueDate ? (
                    <p className="col-12 m-0 p-0">
                      due to: {formatDate(task.dueDate)}
                    </p>
                  ) : (
                    <p className="col-12 m-0 p-0">task has no due date</p>
                  )}
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
                    pending <MdPending />
                  </p>
                  <div className="actions m-0 row gap-1 justify-content-start align-items-center col-12 p-0">
                    <button onClick={() => markAsDone(task.id)}>
                      done <FaCheckCircle />
                    </button>
                    <button onClick={() => handleTaskDetails(task)}>
                      details <FaExclamationCircle />
                    </button>
                    <button onClick={() => deleteTask(task.id)}>
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
