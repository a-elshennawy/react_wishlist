import { BsStars } from "react-icons/bs";
import { FaCheckCircle, FaLaptop } from "react-icons/fa";
import { FcTwoSmartphones } from "react-icons/fc";
import { IoAlarm } from "react-icons/io5";
import {
  PiNumberCircleOneFill,
  PiNumberCircleThreeFill,
  PiNumberCircleTwoFill,
} from "react-icons/pi";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/Contexts/AuthContext";
import Home from "./Home";
import { IoIosArrowDown } from "react-icons/io";

export default function LandingPage() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser ? (
        <Home />
      ) : (
        <>
          <section className="container-fluid row justify-content-center align-items-center text-center m-0 p-0">
            <div className="hero col-12 p-0">
              <div className="bgLayer"></div>
              <div className="textSec">
                <h1>Tasks Done. No Noise, Just Progress.</h1>
                <button className="basicBtnStyle mt-2">
                  <Link to={"/signup"}>START NOW !!</Link>
                </button>
              </div>
              <div className="scrollDiv">
                <h5>scroll for more</h5>
                <IoIosArrowDown />
              </div>
            </div>
            <div className="howTo col-12 row justify-content-center align-items-center gap-3 m-0 py-5">
              <div className="bgLayer"></div>
              <div className="col-lg-2 col-10 item">
                <FaCheckCircle />
                <h4>Do, Don't Configure</h4>
                <p>
                  no more endless settings, tags, or folders. Just create a
                  task, set a due date, and get it done. a task manager,
                  simplified to its purest form.
                </p>
              </div>
              <div className="col-lg-2 col-10 item">
                <FcTwoSmartphones />
                <FaLaptop />
                <h4>Your Tasks, Anywhere</h4>
                <p>
                  Sign in on your phone, your laptop, your tablet. Your list is
                  always there, always in sync. Start a task on your commute and
                  finish it at your desk.
                </p>
              </div>
              <div className="col-lg-2 col-10 item">
                <IoAlarm />
                <h4>Smart & Automatic</h4>
                <p>
                  We keep it simple, not dumb. Tasks automatically become
                  Overdue if time runs out, so you always know what needs your
                  immediate attention.
                </p>
              </div>
              <h2 className="col-12">how it works ?</h2>
              <div className="col-lg-2 col-10 item">
                <PiNumberCircleOneFill />
                <h4>add</h4>
                <p>
                  Type your task title and description. Set a due date. That's
                  it.
                </p>
              </div>
              <div className="col-lg-2 col-10 item">
                <PiNumberCircleTwoFill />
                <h4>see</h4>
                <p>Your list is clear: Pending, Done, or Overdue</p>
              </div>
              <div className="col-lg-2 col-10 item">
                <PiNumberCircleThreeFill />
                <h4>do</h4>
                <p>
                  Check it off. Edit it if you need to. Feel the satisfaction.
                </p>
              </div>
            </div>
            <div className="toSignUpSec col-12 m-0 py-3">
              <div className="bgLayer"></div>
              <h4>Ready to clear your mind?</h4>
              <h5>
                Stop wrestling with complicated apps. Get started in seconds.
              </h5>
              <button className="basicBtnStyle mt-3">
                <Link to={"/auth"}>Sign Up for Free - It's Simple</Link>
              </button>
            </div>
            <div className="footer col-12 row justify-content-center align-items-start text-start gap-2 m-0 py-5">
              <ul className="col-lg-3 col-10 m-0 footerItem">
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
              </ul>
              <div className="col-lg-3 col-10 m-0 footerItem">
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
              </div>
              <div className="col-lg-3 col-10 m-0 footerItem">
                <h3>Stop organizing. Start doing.</h3>
                <button className="basicBtnStyle mt-3">
                  <Link to={"/auth"}>Get Started Now</Link>
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
