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
    checkOverdueTasks();

    const interval = setInterval(checkOverdueTasks, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser]);
  return null;
}
