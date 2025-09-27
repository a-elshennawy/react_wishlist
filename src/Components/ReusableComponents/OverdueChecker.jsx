import { useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";

export default function OverdueChecker() {
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkOverdueTasks = async () => {
      if (!currentUser) return;

      try {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const taskRef = collection(db, "tasks");
        const q = query(
          taskRef,
          where("user", "==", currentUser.email),
          where("status", "==", "pending")
        );

        const querySnapshot = await getDocs(q);
        const updates = [];

        querySnapshot.forEach((taskDoc) => {
          const task = taskDoc.data();
          const dueDate = task.dueDate ? new Date(task.dueDate) : null;

          if (dueDate && dueDate < today) {
            updates.push(
              updateDoc(doc(db, "tasks", taskDoc.id), {
                status: "overdue",
              })
            );
          }
        });

        if (updates.length > 0) {
          await Promise.all(updates);
          console.log(`Updated ${updates.length} tasks to overdue`);
        }
      } catch (error) {
        console.error("Error checking overdue tasks:", error);
      }
    };

    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

    const calculateDelayToNextMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      );
      return nextMidnight.getTime() - now.getTime();
    };

    // Run an initial check immediately
    checkOverdueTasks();

    // Calculate delay to next midnight
    const initialDelay = calculateDelayToNextMidnight();
    console.log(
      `Next check scheduled for ${Math.round(
        initialDelay / 1000 / 60
      )} minutes from now.`
    );

    // Set timeout for first midnight check
    const timeout = setTimeout(() => {
      checkOverdueTasks();

      // Set up daily interval after first midnight check
      const interval = setInterval(checkOverdueTasks, ONE_DAY_IN_MS);

      // Store interval reference for cleanup
      timeout.intervalRef = interval;
    }, initialDelay);

    // Cleanup function
    return () => {
      clearTimeout(timeout);
      if (timeout.intervalRef) {
        clearInterval(timeout.intervalRef);
      }
    };
  }, [currentUser]);

  return null;
}
