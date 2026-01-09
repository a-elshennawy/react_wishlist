import "./Auth.css";
import ToHomeBtn from "../../Components/ReusableComponents/ToHomeBtn";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import useMobile from "../../Hooks/useMobile";
import AuthForm from "./AuthForm";

function Auth() {
  const { isMobile } = useMobile();
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const [autoHoveredSquare, setAutoHoveredSquare] = useState(null);

  const squareSize = isMobile ? 50 : 100;
  const gap = 1;
  const cols = Math.ceil(window.innerWidth / (squareSize + gap)) + 1;
  const rows = Math.ceil(window.innerHeight / (squareSize + gap)) + 1;
  const totalSquares = cols * rows;

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * totalSquares);
      setAutoHoveredSquare(randomIndex);
    }, 300);

    return () => clearInterval(interval);
  }, [totalSquares]);

  return (
    <>
      <ToHomeBtn />
      <div className="mainContainer row justify-content-center align-items-center m-0 p-0">
        <div
          className="backGroundLayer p-0"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${squareSize}px)`,
            gridAutoRows: `${squareSize}px`,
          }}
        >
          {Array.from({ length: totalSquares }).map((_, index) => (
            <div
              key={index}
              className={`square ${hoveredSquare === index || autoHoveredSquare === index ? "hovered" : ""}`}
              onMouseEnter={() => setHoveredSquare(index)}
              onMouseLeave={() => setHoveredSquare(null)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <AuthForm />
        </AnimatePresence>
      </div>
    </>
  );
}

export default Auth;
