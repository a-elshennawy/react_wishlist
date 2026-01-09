import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Components/Contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetingPassword, setIsResetingPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Add this
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (isResetingPassword) {
      try {
        setMessage("");
        setError("");
        setLoading(true);
        await resetPassword(email);
        setMessage("Check your e-mail inbox");
        setTimeout(() => {
          setMessage("");
          setIsResetingPassword(false);
        }, 5000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      }
    } else {
      try {
        setError("");
        setLoading(true);
        await login(email, password);
        navigate("/");
      } catch (err) {
        console.error("failed to login: " + err.message + err.code);
        setError("invalid email / password");
        setTimeout(() => setError(""), 5000);
      }
    }

    setLoading(false);
  }

  return (
    <>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            className="errorToast glassmorphism"
          >
            <MdCancel size={20} /> {error}
          </motion.div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            className="messageToast glassmorphism"
          >
            <FaCheckCircle size={20} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
        onSubmit={handleSubmit}
        className="logForm glassmorphism text-center col-10 col-md-2 py-3 px-2 row justify-content-center align-items-center m-0 gap-3"
      >
        <AnimatePresence mode="wait">
          <motion.h3
            key={isResetingPassword ? "reset" : "login"}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="m-0 p-0"
          >
            {isResetingPassword ? "Password Reset" : "Login"}
          </motion.h3>
        </AnimatePresence>

        <div className="inputContainer p-0 col-12">
          <label htmlFor="email">email address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="glassmorphism"
          />
        </div>

        <AnimatePresence mode="wait">
          {!isResetingPassword && (
            <motion.div
              key="password-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="inputContainer p-0 col-12"
            >
              <label htmlFor="password">password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glassmorphism"
              />
              <span
                className="showPassBtn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={isResetingPassword ? "reset-btn" : "login-btn"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="col-12 p-0"
          >
            <button
              className="accountFormBtn glassmorphism"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <CircularProgress size={20} color="var(--white)" />
              ) : isResetingPassword ? (
                "Reset Password"
              ) : (
                "Log In"
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={isResetingPassword ? "back-link" : "reset-link"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="col-12"
          >
            <span
              onClick={() => setIsResetingPassword(!isResetingPassword)}
              style={{ cursor: "pointer" }}
            >
              {isResetingPassword ? "back to login" : "reset password"}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.form>
    </>
  );
}
