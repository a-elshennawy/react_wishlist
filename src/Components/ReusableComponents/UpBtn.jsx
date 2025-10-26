import { useEffect, useState } from "react";
import { TbSquareRoundedArrowUpFilled } from "react-icons/tb";

export default function UpBtn() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollHandle = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandle);
    return () => {
      window.removeEventListener("scroll", scrollHandle);
    };
  });
  return (
    <>
      {isVisible && (
        <button className="upBtn" onClick={scrollUp}>
          <TbSquareRoundedArrowUpFilled />
        </button>
      )}
    </>
  );
}
