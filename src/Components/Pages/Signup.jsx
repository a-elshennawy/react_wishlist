import { Link } from "react-router-dom";
import ToHomeBtn from "../ReusableComponents/ToHomeBtn";

export default function Signup() {
  return (
    <>
      <ToHomeBtn />
      <section className="container-fluid row justify-content-center align-items-center m-0">
        <form className="col-lg-2 col-10 row justify-content-center align-items-center m-0 gap-2 text-center">
          <h3>sign up</h3>
          <div className="inputContainer col-12">
            <label htmlFor="username">username</label>
            <input type="username" name="username" id="username" />
          </div>
          <div className="inputContainer col-12">
            <label htmlFor="email">email address</label>
            <input type="email" name="email" id="email" />
          </div>
          <div className="inputContainer col-12">
            <label htmlFor="password">password</label>
            <input type="password" name="password" id="password" />
          </div>
          <div className="col-12 py-2">
            <button type="submit">Sign up</button>
          </div>
          <div className="col-12">
            <Link to={"/login"}>already have accont ? log in</Link>
          </div>
        </form>
      </section>
    </>
  );
}
