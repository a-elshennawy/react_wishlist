import { Link, useNavigate } from "react-router-dom";
import ToHomeBtn from "../ReusableComponents/ToHomeBtn";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
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
      <ToHomeBtn />
      <section className="formContainer container-fluid row justify-content-center align-items-center m-0">
        <form
          onSubmit={handleSubmit}
          className="accountform col-lg-2 col-10 row justify-content-center align-items-center m-0 gap-2 text-center"
        >
          <h3>sign up</h3>
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
              require
            />
          </div>
          <div className="inputContainer col-12">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          <div className="col-12 py-2">
            <button disabled={loading} type="submit">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
          <div className="col-12 p-0">
            <Link to={"/login"}>already have accont ? log in</Link>
          </div>
        </form>
      </section>
    </>
  );
}
