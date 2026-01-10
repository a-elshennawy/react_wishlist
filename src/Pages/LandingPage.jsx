import { Link } from "react-router-dom";
import { useAuth } from "../Components/Contexts/AuthContext";
import Home from "./Home";
import useMobile from "../Hooks/useMobile";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const { isMobile } = useMobile();

  return (
    <>
      {currentUser ? (
        <Home />
      ) : (
        <>
          <div className="landingPage p-0">
            <div className="bgLayer p-0">
              <img
                src={
                  isMobile ? "/images/mobileBg.webp" : "/images/desktopBg.webp"
                }
                alt="header image"
                loading="lazy"
              />
            </div>
            <div className="textSec text-center p-0">
              <h1 className="mb-2">
                No Noise,
                <br />
                tasks done,
                <br />
                just progress.
              </h1>
              <button className="my-2 p-2 homeBtn">
                <Link to={"/auth"}>start now</Link>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
