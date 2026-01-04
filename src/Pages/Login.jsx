import { Link, useNavigate } from "react-router-dom";
import ToHomeBtn from "../ReusableComponents/ToHomeBtn";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { motion } from "motion/react";
import useMobile from "../../Hooks/useMobile";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useMobile();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("failed to login: " + err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <ToHomeBtn />
      <section className="formContainer container-fluid row justify-content-between align-items-center gap-3 px-0 m-0">
        <motion.form
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
          onSubmit={handleSubmit}
          className="accountform col-lg-6 col-11 row justify-content-center align-items-center m-0 gap-2 text-start"
        >
          <h3>log in</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="inputContainer col-12">
            <label htmlFor="email">email address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="inputContainer col-12">
            <label htmlFor="password">password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="showPassBtn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="col-12 py-2">
            <button className="accountFormBtn" disabled={loading} type="submit">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
          <div className="col-12 py-12 px-0">
            <Link to={"/forgotPassword"}>forgot your password?</Link>
          </div>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
          className="iconSection text-center col-12 col-md-5"
        >
          <img
            src="/images/user.webp"
            alt="userIcon"
            loading="lazy"
            style={{ width: isMobile ? "80%" : "50%", display: "block" }}
          />
          <button className="toOtherFormBtn my-2">
            <Link to={"/signup"}>don't have an account ? sign up</Link>
          </button>
        </motion.div>
      </section>
    </>
  );
}
