import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Progress() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = null;

    try {
      const taskRef = collection(db, "tasks");
      const q = query(taskRef, where("user", "==", currentUser.email));

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasksData = [];
          querySnapshot.forEach((doc) => {
            tasksData.push({ id: doc.id, ...doc.data() });
          });
          setTasks(tasksData);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching tasks:", err);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error setting up listener:", err);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const overdueTasks = tasks.filter((task) => task.status === "overdue").length;

  const progressPercentage =
    totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="progress-component">
        <h6>checking your progress...</h6>
      </div>
    );
  }

  return (
    <>
      <div className="progress-component">
        <h6 className="text-start m-0">
          {doneTasks} / {totalTasks} tasks are done
        </h6>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(progressPercentage)}%
          </div>
        </div>
        {overdueTasks > 0 && (
          <p className="text-start">{overdueTasks} overdue</p>
        )}
      </div>
    </>
  );
}
