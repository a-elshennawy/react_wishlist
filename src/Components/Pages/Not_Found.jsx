import { motion } from "motion/react";
import { Link } from "react-router-dom";
import useMobile from "../../Hooks/useMobile";

function Not_Found() {
  const { isMobile } = useMobile();

  return (
    <>
      <section className="container-fluid row justify-content-center align-items-center m-0 gap-2 text-center pt-5 mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
          className="col-12 col-md-10"
        >
          <img
            src="/images/notFound.png"
            alt="not found icon"
            className={`${isMobile ? "notFoundIcon-mobile" : "notFoundIcon"}`}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          className="col-12 my-4"
        >
          <h3>Oops you lost ?</h3>
          <button className="mt-2 basicBtnStyle">
            <Link to="/">home</Link>
          </button>
        </motion.div>
      </section>
    </>
  );
}

export default Not_Found;
