import { Link } from "react-router-dom";
import { ThemeToggle } from "../Contexts/ThemeProvider";

export default function NavBar() {
  return (
    <>
      <nav className="container-fluid row justif-content-between align-items-center">
        <div className="col-6 text-start">
          <ThemeToggle />
        </div>
        <div className="col-6 text-end">
          <button>
            <Link to={"/login"}>login</Link>
          </button>
        </div>
      </nav>
    </>
  );
}
