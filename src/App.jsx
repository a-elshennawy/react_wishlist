import { MdAssignmentAdd, MdOutlineDeleteSweep } from "react-icons/md";
import "./App.css";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  // load tasks from local storage (in case there's) on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // save new tasks to local storage on change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // add task handler
  const handleAddTask = (e) => {
    // prevent form submittion
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      isComplete: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  // toggle task state
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, isComplete: !task.isComplete };
      }
      return task;
    });

    // sorting tasks
    const sortedTasks = [
      ...updatedTasks.filter((task) => !task.isComplete),
      ...updatedTasks.filter((task) => task.isComplete),
    ];

    setTasks(sortedTasks);
  };

  // delete tasks
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      <section className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at top center, rgba(240, 240, 255, 0.15), transparent 70%)",
            zIndex: 1,
          }}
        />
        <div className="taskApp z-2 row justify-content-center align-items-center gap-1">
          <form
            className="col-lg-6 col-12 row justify-content-between align-items-center gap-1 taskInputForm"
            onSubmit={handleAddTask}
          >
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="col-12"
            >
              task manager
            </motion.h4>
            <motion.input
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="col-8"
              placeholder="add task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            ></motion.input>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="col-3 text-start"
            >
              <button className="subBtn" type="submit">
                <MdAssignmentAdd />
              </button>
            </motion.div>
          </form>
          <ul className="taskList col-lg-6 col-12">
            {tasks.map((task) => (
              <motion.li
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                key={task.id}
                className={`taskItem ${task.isComplete ? "complete" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.isComplete}
                  onChange={() => handleToggleComplete(task.id)}
                />
                {task.isComplete ? (
                  <del>{task.text}</del>
                ) : (
                  <strong>{task.text}</strong>
                )}
                <span onClick={() => handleDeleteTask(task.id)}>
                  <MdOutlineDeleteSweep />
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="madeBy z-2"
        >
          <a href="https://ahmed-elshennawy.vercel.app/" target="_blank">
            made by
            <img src="/images/portfolio.ico" />
          </a>
        </motion.div>
      </section>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="freePalestine z-2"
      >
        <a href="https://www.instagram.com/eye.on.palestine/" target="_blank">
          <img src="/images/Flag_of_Palestine.webp" />
        </a>
      </motion.div>
    </>
  );
}

export default App;
