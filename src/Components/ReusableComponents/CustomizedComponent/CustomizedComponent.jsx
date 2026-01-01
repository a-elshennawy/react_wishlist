import "./CustomizedComponent.css";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import useMobile from "../../../Hooks/useMobile";

function CustomizedComponent({
  imgSrc = "/images/allDone.webp",
  imgWidth = 400,
  imgMobileWidth = imgWidth / 2,
  className,
  text,
  btn = false,
  btnText,
  btnFunc,
}) {
  const { isMobile } = useMobile();
  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  const handleClick = btnFunc || refreshPage;

  return (
    <>
      <div className={`${className} text-center`}>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
          src={imgSrc}
          loading="lazy"
          style={{ width: isMobile ? imgMobileWidth : imgWidth }}
        />
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
        >
          {text}
        </motion.h3>
        {btn && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
            onClick={() => handleClick}
          >
            {btnText}
          </motion.button>
        )}
      </div>
    </>
  );
}

export default CustomizedComponent;
