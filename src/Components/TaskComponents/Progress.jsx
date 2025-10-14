import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  const weekSubmittedTasks = tasks.filter((task) => {
    if (!task.timestamp) return false;

    const creationDate = task.timestamp.toDate();
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(0, 0, 0, 0);

    return creationDate >= startOfWeek && creationDate <= endOfWeek;
  }).length;

  const weekDoneTasks = tasks.filter((task) => {
    if (task.status !== "done" || !task.completedAt) return false;

    const completeDate = task.completedAt.toDate();
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(0, 0, 0, 0);

    return completeDate >= startOfWeek && completeDate <= endOfWeek;
  }).length;

  const weekCreatedAndDone = tasks.filter((task) => {
    if (task.status !== "done" || !task.completedAt || !task.timestamp)
      return false;

    const completeDate = task.completedAt.toDate();
    const creationDate = task.timestamp.toDate();
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(0, 0, 0, 0);

    return (
      completeDate >= startOfWeek &&
      completeDate <= endOfWeek &&
      creationDate >= startOfWeek &&
      creationDate <= endOfWeek
    );
  }).length;

  const progressPercentage =
    weekSubmittedTasks === 0
      ? 0
      : Math.min(
          Math.round((weekCreatedAndDone / weekSubmittedTasks) * 100),
          100
        );

  const getPathColor = (percentage) => {
    if (percentage >= 75) {
      return "#49ff4fc4"; // Green for good progress
    } else if (percentage >= 50) {
      return "#FFC107"; // Yellow for moderate progress
    } else {
      return "#F44336"; // Red for low progress
    }
  };

  const pathColor = getPathColor(progressPercentage);

  const overdueTasks = tasks.filter((task) => task.status === "overdue").length;

  const oldTasksCompleted = weekDoneTasks - weekCreatedAndDone;

  if (loading) {
    return (
      <div className="progress-component">
        <h6 className="col-12 text-center m-0">checking your progress...</h6>
      </div>
    );
  }

  return (
    <>
      <div className="progress-component row justify-content-start align-items-center p-0 m-0 gap-1">
        {weekSubmittedTasks == 0 ? (
          <div className="progress-component">
            <h6 className="col-12 text-center m-0">no activity this week</h6>
          </div>
        ) : (
          <>
            <div className="col-lg-2 col-md-4 col-6 progressItem text-center m-0">
              <h3>you completed</h3>
              <h1>{weekDoneTasks}</h1>
              <h3>tasks this week</h3>
              {oldTasksCompleted > 0 && (
                <p className="oldTasks m-0 mx-auto">
                  + {oldTasksCompleted} from previous weeks
                </p>
              )}
            </div>

            <div className="col-lg-2 col-md-4 col-5 progressItem prgressCircle text-center m-0">
              <h3>weekly progress</h3>
              <div
                style={{
                  width: 100,
                  height: 100,
                  margin: "0 auto",
                  filter: `drop-shadow(0 0 5px ${pathColor})`,
                }}
              >
                <CircularProgressbar
                  value={progressPercentage}
                  text={`${progressPercentage}%`}
                  styles={{
                    // Customize the color here
                    path: {
                      // Change the color of the progress line (e.g., to a shade of green)
                      stroke: pathColor,
                      // Optional: make the path transition smoothly
                      transition: "stroke-dashoffset 0.5s ease 0s",
                    },
                    trail: {
                      // Change the color of the background track (e.g., to a light grey)
                      stroke: "#d6d6d6",
                    },
                    text: {
                      // Change the color of the percentage text
                      fill: pathColor,
                      fontSize: "16px",
                    },
                  }}
                />
              </div>
            </div>
          </>
        )}

        {overdueTasks > 0 && (
          <div className="col-12 text-start p-0">
            <p className="overdueBag m-0 mt-1">{overdueTasks} overdue</p>
          </div>
        )}
      </div>
    </>
  );
}
