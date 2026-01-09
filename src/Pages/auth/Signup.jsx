import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Components/Contexts/AuthContext";
import { motion } from "motion/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to create an account: " + error.message);
    }

    setLoading(false);
  }

  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
        onSubmit={handleSubmit}
        className="logForm glassmorphism text-center col-xl-2 col-lg-3 col-md-5 col-sm-7 col-10 py-3 px-2 row justify-content-center align-items-center m-0 gap-3"
      >
        <h3 className="m-0 p-0">sign up</h3>
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

        <div className="inputContainer p-0 col-12">
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
        </div>

        <div className="inputContainer p-0 col-12">
          <label htmlFor="passwordConfirm">Confirm Password</label>
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
        </div>

        <div className="col-12 p-0">
          <button
            className="accountFormBtn glassmorphism"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <CircularProgress size={20} color="var(--white)" />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </motion.form>
    </>
  );
}
