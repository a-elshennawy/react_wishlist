import { BsStars } from "react-icons/bs";
import { FaCheckCircle, FaLaptop } from "react-icons/fa";
import { FcTwoSmartphones } from "react-icons/fc";
import { IoAlarm } from "react-icons/io5";
import {
  PiNumberCircleOneFill,
  PiNumberCircleThreeFill,
  PiNumberCircleTwoFill,
} from "react-icons/pi";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import Home from "./Home";

export default function LandingPage() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser ? (
        <Home />
      ) : (
        <>
          <section className="container-fluid row justify-content-center align-items-center text-center gap-5 m-0">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="z-1"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "radial-gradient(circle at top center, rgba(240, 240, 255, 0.15), transparent 70%)",
              }}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="col-10 z-2"
            >
              <h1>Tasks Done. No Noise, Just Progress.</h1>
              <h4>
                a to-do app that helps you finish your work instead of learning
                how to use it. ClarityTasks is the blissfully simple way to
                manage your tasks across all your devices.
              </h4>
            </motion.div>
            <div className="col-12 row justify-content-center align-items-center gap-2 m-0 z-2">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-2 col-10 item"
              >
                <FaCheckCircle />
                <h4>Do, Don't Configure</h4>
                <p>
                  no more endless settings, tags, or folders. Just create a
                  task, set a due date, and get it done. a task manager,
                  simplified to its purest form.
                </p>
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-2 col-10 item"
              >
                <FcTwoSmartphones />
                <FaLaptop />
                <h4>Your Tasks, Anywhere</h4>
                <p>
                  Sign in on your phone, your laptop, your tablet. Your list is
                  always there, always in sync. Start a task on your commute and
                  finish it at your desk.
                </p>
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-2 col-10 item"
              >
                <IoAlarm />
                <h4>Smart & Automatic</h4>
                <p>
                  We keep it simple, not dumb. Tasks automatically become
                  Overdue if time runs out, so you always know what needs your
                  immediate attention.
                </p>
              </motion.div>
            </div>
            <div className="col-12 row justify-content-center align-items-center gap-2 m-0 z-2">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="col-12"
              >
                how it works ?
              </motion.h2>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-2 col-10 item"
              >
                <PiNumberCircleOneFill />
                <h4>add</h4>
                <p>
                  Type your task title and description. Set a due date. That's
                  it.
                </p>
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-2 col-10 item"
              >
                <PiNumberCircleTwoFill />
                <h4>see</h4>
                <p>Your list is clear: Pending, Done, or Overdue</p>
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-2 col-10 item"
              >
                <PiNumberCircleThreeFill />
                <h4>do</h4>
                <p>
                  Check it off. Edit it if you need to. Feel the satisfaction.
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="startArea col-lg-3 col-10 row justify-content-center align-items-center m-0 z-2"
            >
              <div className="col-12">
                <h4>Ready to clear your mind?</h4>
                <h5>
                  Stop wrestling with complicated apps. Get started in seconds.
                </h5>
              </div>
              <div className="col-12 py-3">
                <button className="landingBtn">
                  <Link to={"/signup"}>Sign Up for Free - It's Simple</Link>
                </button>
              </div>
            </motion.div>
            <div className="col-12 row justify-content-center align-items-center m-0 z-2 gap-2">
              <motion.ul
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-4 col-10 m-0"
              >
                <h4>
                  <mark>highlighted</mark> features
                </h4>
                <li>
                  <BsStars />
                  One-click task completion
                </li>
                <li>
                  <BsStars />
                  Edit titles, descriptions, and due dates
                </li>
                <li>
                  <BsStars />
                  Automatic status tracking
                </li>
                <li>
                  <BsStars />
                  Secure login & sync across all devices
                </li>
                <li>
                  <BsStars />
                  Clean, distraction-free interface
                </li>
                <li>
                  <BsStars />
                  100% Free
                </li>
              </motion.ul>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-lg-4 col-10 m-0 faq"
              >
                <h4>FAQ</h4>
                <p className="m-0">
                  <strong>Q: Is it really free?</strong>
                </p>
                <p className="m-0">
                  A: Yes. Clarity Tasks is completely free to use.
                </p>
                <p className="m-0">
                  <strong>
                    Q: How do I access my tasks on another device?
                  </strong>
                </p>
                <p className="m-0">
                  A: Just sign up once. Then use your email and password to log
                  in on any device with a web browser. Your list will be waiting
                  for you.
                </p>
                <p className="m-0">
                  <strong>Q: What happens to overdue tasks?</strong>
                </p>
                <p className="m-0">
                  A: They stay in your list with a clear "Overdue" label until
                  you mark them as Done or delete them, so you never forget
                  about them.
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ y: 100, scale: 0, opacity: 0 }}
              whileInView={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="startArea col-lg-3 col-10 row justify-content-center align-items-center m-0 z-2"
            >
              <h3 className="col-12">Stop organizing. Start doing.</h3>
              <div className="col-12 py-3">
                <button className="landingBtn">
                  <Link to={"/signup"}>Get Started Now</Link>
                </button>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </>
  );
}
