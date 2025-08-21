import { BarLoader } from "react-spinners";

export default function LoaderSpinner() {
  return (
    <>
      <div className="loader">
        <BarLoader speedMultiplier={1} color="#fff" />
      </div>
    </>
  );
}
