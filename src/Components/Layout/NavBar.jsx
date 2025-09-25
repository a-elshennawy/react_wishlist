import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "../Contexts/ThemeProvider";
import { useAuth } from "../Contexts/AuthContext";
import LeaderBoard from "../ReusableComponents/LeaderBoard";
import { FaHome, FaPowerOff } from "react-icons/fa";
import { FaFileCircleExclamation } from "react-icons/fa6";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("failed to log out", err);
    }
  }

  return (
    <>
      <nav className="container-fluid m-0">
        <div className="text-end">
          {currentUser ? (
            <>
              <div className="float-start">
                <ThemeToggle />
              </div>

              {location.pathname === "/docs" ? (
                <button className="docsBtn float-start mx-2">
                  <Link to="/">
                    <FaHome />
                  </Link>
                </button>
              ) : (
                <button className="docsBtn float-start mx-2">
                  <Link to="/docs">
                    <FaFileCircleExclamation />
                  </Link>
                </button>
              )}

              <button onClick={handleLogout} className="logOutBtn float-end">
                <FaPowerOff />
              </button>

              <div className="float-end mx-2">
                <LeaderBoard />
              </div>
            </>
          ) : (
            <button className="basicBtnStyle landingBtn ">
              <Link to={"/login"}>Login</Link>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
