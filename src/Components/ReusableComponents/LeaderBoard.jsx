import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";
import { MdLeaderboard } from "react-icons/md";
import Portal from "./Portal";

export default function LeaderBoard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Set up real-time listener
    setLoading(true);

    const tasksQuery = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(
      tasksQuery,
      (querySnapshot) => {
        // Calculate score per user
        const userScore = {};

        querySnapshot.forEach((doc) => {
          const task = doc.data();
          const userEmail = task.user;

          if (userEmail) {
            if (!userScore[userEmail]) {
              userScore[userEmail] = 0;
            }

            // Scoring rules
            // 5 points for any task
            userScore[userEmail] += 5;

            // +15 points for done task
            if (task.status === "done") {
              userScore[userEmail] += 15;
            }

            // -2 point for overdue task
            if (task.status === "overdue") {
              userScore[userEmail] -= 2;
            }
          }
        });

        // Convert to array and sort by score
        const leaderboardArray = Object.entries(userScore)
          .map(([email, score]) => ({
            email,
            username: email.split("@")[0],
            score,
          }))
          .sort((a, b) => b.score - a.score);

        setLeaderboardData(leaderboardArray);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to leaderboard updates:", error);
        setLoading(false);
      }
    );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#leaderboardModal"
        className="basicBtnStyle"
      >
        leaderboard
      </button>

      <Portal>
        <div
          className="modal fade"
          id="leaderboardModal"
          tabIndex="-1"
          aria-labelledby="leaderboardModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content rankModal">
              <div className="modal-body">
                <h5 className="modal-title mb-3" id="leaderboardModalLabel">
                  Leaderboard <MdLeaderboard />
                </h5>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : leaderboardData.length > 0 ? (
                  <ul className="list-group">
                    {leaderboardData.map((user, index) => (
                      <li
                        key={user.email}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          index === 0
                            ? "first"
                            : index === 1
                            ? "second"
                            : index === 2
                            ? "third"
                            : ""
                        }`}
                      >
                        <span>
                          <span className="rankBadge me-1">{index + 1}</span>
                          {user.username}
                          {user.email === currentUser?.email && (
                            <span className="CurrentUserBadge badge ms-2">
                              You
                            </span>
                          )}
                        </span>
                        <span className="badge scoreBadge rounded-pill">
                          {user.score} pts
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks found to calculate leaderboard.</p>
                )}
                <button
                  type="button"
                  className="btn float-end mt-2"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
}
