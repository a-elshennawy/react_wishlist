import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import ToHomeBtn from "../ReusableComponents/ToHomeBtn";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import useMobile from "../../Hooks/useMobile";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { isMobile } = useMobile();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your inbox for password reset instructions");
    } catch (err) {
      setError("Failed to send reset email: " + err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <>
        <ToHomeBtn />
        <section className="formContainer container-fluid row justify-content-center align-items-center gap-3 px-0 m-0">
          <motion.form
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
            onSubmit={handleSubmit}
            className="accountform resetPassForm col-lg-3 col-10 row justify-content-center align-items-center m-0 p-3 text-center gap-3"
          >
            <h3>Password Reset</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="inputContainer col-12">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="col-12">
              <button
                className="accountFormBtn"
                disabled={loading}
                type="submit"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </div>
          </motion.form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
            className="iconSection text-center col-12 col-md-5"
          >
            <img
              src="/images/forgot-password.webp"
              alt="userIcon"
              loading="lazy"
              style={{ width: isMobile ? "80%" : "50%", display: "block" }}
            />
            <button className="toOtherFormBtn my-2">
              <Link to={"/login"}>back to login</Link>
            </button>
          </motion.div>
        </section>
      </>
    </>
  );
}
