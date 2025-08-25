import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdDeleteForever, MdPending } from "react-icons/md";
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

export default function PendingTasks() {
  const { currentUser } = useAuth();
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = null;

    try {
      setLoading(true);
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        where("user", "==", currentUser.email),
        where("status", "==", "pending")
      );

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasks = [];
          querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          setPendingTasks(tasks);
          setError("");
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching pending tasks:", err);
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
      <div className="col-12">
        <h4 className="text-start">
          you have {pendingTasks.length} pending tasks
        </h4>
        {pendingTasks.length === 0 ? (
          <div className="col-12 text-start py-4">
            <p>No pending tasks! 🎉</p>
          </div>
        ) : (
          <div className="row gap-2 m-0">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="taskItem col-lg-3 col-10 text-start pendingTask row justify-content-center align-items-center gap-1"
              >
                <h3 className="col-12">{task.title}</h3>
                <p className="col-12 m-0">due to: {formatDate(task.dueDate)}</p>
                <p className="col-12 m-0">
                  pending <MdPending />
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
