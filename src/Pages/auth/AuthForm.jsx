import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Components/Contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (mode === "signup" && password !== passwordConfirm) {
      setError("Passwords do not match");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setMessage("");
      setError("");
      setLoading(true);

      if (mode === "reset") {
        await resetPassword(email);
        setMessage("Check your e-mail inbox");
        setTimeout(() => {
          setMessage("");
          setMode("login");
        }, 5000);
      } else if (mode === "signup") {
        await signup(email, password);
        navigate("/");
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err) {
      console.error("Auth error:", err.message);
      if (mode === "login") {
        setError("Invalid email / password");
      } else if (mode === "signup") {
        setError("Failed to create an account");
      } else {
        setError("Failed to send reset email");
      }
      setTimeout(() => setError(""), 5000);
    }

    setLoading(false);
  }

  const getTitle = () => {
    if (mode === "reset") return "Password Reset";
    if (mode === "signup") return "Sign Up";
    return "Login";
  };

  const getButtonText = () => {
    if (mode === "reset") return "Reset Password";
    if (mode === "signup") return "Sign Up";
    return "Log In";
  };

  return (
    <>
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="errorToast glassmorphism"
          >
            <MdCancel size={20} /> {error}
          </motion.div>
        )}
        {message && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
        className="logForm glassmorphism text-center col-xl-2 col-lg-3 col-md-5 col-sm-7 col-10 py-3 px-2 row justify-content-center align-items-center m-0 gap-3"
      >
        <AnimatePresence mode="wait">
          <motion.h3
            key={mode}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="m-0 p-0"
          >
            {getTitle()}
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
          {mode !== "reset" && (
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
          {mode === "signup" && (
            <motion.div
              key="password-confirm-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="inputContainer p-0 col-12"
            >
              <label htmlFor="passwordConfirm">confirm password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="passwordConfirm"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
            key={`${mode}-btn`}
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
              ) : (
                getButtonText()
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-links`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="col-12 d-flex flex-column gap-2"
          >
            {mode === "login" && (
              <>
                <span
                  onClick={() => setMode("reset")}
                  style={{ cursor: "pointer" }}
                >
                  reset password
                </span>
                <span
                  onClick={() => setMode("signup")}
                  style={{ cursor: "pointer" }}
                >
                  create new account
                </span>
              </>
            )}
            {mode === "signup" && (
              <span
                onClick={() => setMode("login")}
                style={{ cursor: "pointer" }}
              >
                already have an account? log in
              </span>
            )}
            {mode === "reset" && (
              <span
                onClick={() => setMode("login")}
                style={{ cursor: "pointer" }}
              >
                back to login
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.form>
    </>
  );
}
