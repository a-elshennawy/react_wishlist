import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../Contexts/ThemeProvider";
import { useAuth } from "../Contexts/AuthContext";
import LeaderBoard from "../ReusableComponents/LeaderBoard";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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

              <button onClick={handleLogout} className="logOutBtn float-end">
                Sign Out
              </button>

              <div className="float-end mx-2">
                <LeaderBoard />
              </div>
            </>
          ) : (
            <button className="landingBtn ">
              <Link to={"/login"}>Login</Link>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
