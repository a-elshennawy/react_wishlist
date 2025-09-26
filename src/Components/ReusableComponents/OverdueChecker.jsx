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
      // Get the date for the start of the next day (12:00 AM tomorrow)
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Add 1 day
        0, // Hour (0 for 12 AM)
        0, // Minute
        0, // Second
        0 // Millisecond
      );
      return nextMidnight.getTime() - now.getTime();
    };

    const runDailyCheck = () => {
      // 1. Calculate the initial delay until 12:00 AM tomorrow
      const initialDelay = calculateDelayToNextMidnight();
      console.log(
        `Initial check scheduled for ${
          initialDelay / 1000 / 60
        } minutes from now.`
      );

      // 2. Set the initial timeout to run the check at midnight
      const timeout = setTimeout(() => {
        checkOverdueTasks();

        // 3. Once the first check runs, set the repeating interval for every 24 hours
        const interval = setInterval(checkOverdueTasks, ONE_DAY_IN_MS);

        // Clean-up for the interval
        return () => clearInterval(interval);
      }, initialDelay);

      // Clean-up for the initial timeout
      return () => clearTimeout(timeout);
    };

    // Start the process
    const cleanup = runDailyCheck();

    // The useEffect cleanup will handle both timeout and interval cleanup
    return cleanup;
  }, [currentUser]);
  return null;
}
