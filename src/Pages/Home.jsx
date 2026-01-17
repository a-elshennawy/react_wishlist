import AddTask from "../Components/TaskComponents/AddTask/AddTask";
import Tasks from "../Components/TaskComponents/Tasks";
import { useState } from "react";
import OverdueChecker from "../Components/ReusableComponents/OverdueChecker";
import Progress from "../Components/TaskComponents/Progress";

export default function Home() {
  const [activeTab, setActiveTab] = useState("pending");

  const taskConfigs = {
    pending: {
      emptyStateMessage: "No pending tasks",
      emptyStateImage: "/images/nothing.webp",
    },
    inProgress: {
      emptyStateMessage: "no tasks are in progress yet",
      emptyStateImage: "/images/nothing.webp",
    },
    done: {
      emptyStateMessage: "nothing is done yet",
      emptyStateImage: "/images/nothing.webp",
    },
    overdue: {
      emptyStateMessage: "Nothing is overdue .. yaaay",
      emptyStateImage: "/images/thumbs-up.webp",
    },
  };

  return (
    <>
      <OverdueChecker />
      <section className="container-fluid row justify-content-start align-items-center m-0 gap-2 text-center pt-5 mt-4">
        <div className="col-12 p-0">
          <Progress />
        </div>
        <AddTask />
        <hr className="m-0" />
        <div className="col-12 row justify-content-start align-items-center m-0 taskTab">
          <button
            className={`taskTabBtn ${
              activeTab === "pending" ? "pendingTab" : ""
            }`}
            onClick={() => setActiveTab("pending")}
          >
            pending
          </button>
          <button
            className={`taskTabBtn ${
              activeTab === "inProgress" ? "progressTab" : ""
            }`}
            onClick={() => setActiveTab("inProgress")}
          >
            in progress
          </button>
          <button
            className={`taskTabBtn ${activeTab === "done" ? "doneTab" : ""}`}
            onClick={() => setActiveTab("done")}
          >
            done
          </button>
          <button
            className={`taskTabBtn ${
              activeTab === "overdue" ? "overDueTab" : ""
            }`}
            onClick={() => setActiveTab("overdue")}
          >
            overdue
          </button>
        </div>
        <Tasks status={activeTab} {...taskConfigs[activeTab]} />
      </section>
    </>
  );
}
