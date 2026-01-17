import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../Contexts/ThemeProvider";
import { useAuth } from "../Contexts/AuthContext";
import { PiSignOutDuotone } from "react-icons/pi";

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

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <nav className="container-fluid m-0">
        <div className="text-end">
          <div className="float-start">
            <ThemeToggle />
          </div>

          <button onClick={handleLogout} className="logOutBtn float-end">
            <PiSignOutDuotone />
          </button>
        </div>
      </nav>
    </>
  );
}
