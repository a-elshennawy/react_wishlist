import { Link, useNavigate } from "react-router-dom";
import ToHomeBtn from "../ReusableComponents/ToHomeBtn";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      <section className="formContainer container-fluid row justify-content-center align-items-center m-0">
        <form
          onSubmit={handleSubmit}
          className="col-lg-2 col-10 row justify-content-center align-items-center m-0 gap-2 text-center"
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
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="col-12 py-2">
            <button disabled={loading} type="submit">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
          <div className="col-12 py-12 px-0">
            <Link to={"/forgotPassword"}>forgot your password?</Link>
          </div>
          <div className="col-12 p-0">
            <Link to={"/signup"}>don't have an account ? sign up</Link>
          </div>
        </form>
      </section>
    </>
  );
}
