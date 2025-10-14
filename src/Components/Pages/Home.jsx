import AddTask from "../TaskComponents/AddTask";
import DoneTasks from "../TaskComponents/DoneTasks";
import OverDueTasks from "../TaskComponents/OverDueTasks";
import PendingTasks from "../TaskComponents/PendingTasks";
import { useAuth } from "../Contexts/AuthContext";
import { useState } from "react";
import OverdueChecker from "../ReusableComponents/OverdueChecker";
import Progress from "../TaskComponents/Progress";
import InProgressTasks from "../TaskComponents/InProgressTasks";

export default function Home() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  const getDisplayName = (email) => {
    if (!email) return "User";

    return email.split("@")[0];
  };

  const renderTaskComponent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingTasks />;
      case "inProgress":
        return <InProgressTasks />;
      case "done":
        return <DoneTasks />;
      case "overdue":
        return <OverDueTasks />;
      default:
        return <PendingTasks />;
    }
  };

  return (
    <>
      <OverdueChecker />
      <section className="container-fluid row justify-content-start align-items-center m-0 gap-2 text-center pt-5">
        <h2 className="text-start px-0 pt-3">
          welcome {getDisplayName(currentUser.email)}
          <br />
        </h2>
        <div className="col-12 p-0">
          <Progress />
        </div>
        <AddTask />
        <hr className="m-0" />
        <div className="col-12 row justify-content-start align-items-center gap-1 m-0 taskTab">
          <button
            className={`basicBtnStyle taskTabBtn ${
              activeTab === "pending" ? "pendingTab" : ""
            }`}
            onClick={() => setActiveTab("pending")}
          >
            pending
          </button>
          <button
            className={`basicBtnStyle taskTabBtn ${
              activeTab === "inProgress" ? "progressTab" : ""
            }`}
            onClick={() => setActiveTab("inProgress")}
          >
            in progress
          </button>
          <button
            className={`basicBtnStyle taskTabBtn ${
              activeTab === "done" ? "doneTab" : ""
            }`}
            onClick={() => setActiveTab("done")}
          >
            done
          </button>
          <button
            className={`basicBtnStyle taskTabBtn ${
              activeTab === "overdue" ? "overDueTab" : ""
            }`}
            onClick={() => setActiveTab("overdue")}
          >
            overdue
          </button>
        </div>
        {renderTaskComponent()}
      </section>
    </>
  );
}
