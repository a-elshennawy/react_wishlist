import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import ToHomeBtn from "../ReusableComponents/ToHomeBtn";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

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
        <section className="formContainer container-fluid row justify-content-center align-items-center m-0">
          <form
            onSubmit={handleSubmit}
            className="accountform col-lg-2 col-10 row justify-content-center align-items-center m-0 gap-3 text-center"
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
                placeholder="Enter your email"
              />
            </div>

            <div className="col-12">
              <button disabled={loading} type="submit">
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </div>

            <div className="col-12">
              <Link to={"/login"}>Back to Login</Link>
            </div>
          </form>
        </section>
      </>
    </>
  );
}
