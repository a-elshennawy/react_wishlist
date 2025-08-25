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

export default function OverDueTasks() {
  const { currentUser } = useAuth();
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

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
        where("status", "==", "overdue")
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
            })
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
        where("status", "==", "overdue")
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
          setOverdueTasks(tasks);
          setError("");
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching overdue tasks:", err);
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
      <div className="col-12">
        <h4 className="text-start">
          you have {overdueTasks.length} overdue tasks
        </h4>
        {overdueTasks.length === 0 ? (
          <div className="col-12 text-start py-4">
            <p>Nothing is overdue .. yaaay 🎉</p>
          </div>
        ) : (
          <div className="row gap-2 m-0">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="taskItem col-lg-3 col-10 text-start overdueTask row justify-content-center align-items-center gap-1"
              >
                <h3 className="col-12">{task.title}</h3>
                <p className="col-12 m-0">
                  due to: {formatDate(task.dueDate)} <FaQuestionCircle />
                </p>
                <p className="col-12 m-0">
                  {getOverdue(
                    task.daysOverdue || calcDaysOverdue(task.dueDate)
                  )}
                  <FaClock />
                </p>
                <div className="actions m-0 row gap-1 justify-content-start align-items-center col-12">
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
            ))}
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
