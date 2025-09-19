import { Link } from "react-router-dom";

export default function ToHomeBtn() {
  return (
    <>
      <button className="basicBtnStyle toHomeBtn">
        <Link to={"/"}>home</Link>
      </button>
    </>
  );
}
