import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../Contexts/ThemeProvider";
import { useAuth } from "../Contexts/AuthContext";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("failed to log out", error);
    }
  }

  return (
    <>
      <nav className="container-fluid row justif-content-between align-items-center">
        <div className="col-6 text-start">
          <ThemeToggle />
        </div>
        <div className="col-6 text-end">
          {currentUser ? (
            <>
              <button onClick={handleLogout} className="logOutBtn">
                Sign Out
              </button>
            </>
          ) : (
            <button>
              <Link to={"/login"} className="text-decoration-none">
                Login
              </Link>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
