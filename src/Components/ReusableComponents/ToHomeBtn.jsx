import { Link } from "react-router-dom";

export default function ToHomeBtn() {
  return (
    <>
      <button className="toHomeBtn">
        <Link to={"/"}>home</Link>
      </button>
    </>
  );
}
