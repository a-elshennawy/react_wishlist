import { useState } from "react";

export default function DateFilter({ onDateFilterChange, isActive }) {
  return (
    <>
      <div className="col-12 row justify-content-start align-items-center gap-1 m-0 dateFilterTab">
        <button
          className={`dateFilterBtn ${isActive ? "selected" : ""}`}
          onClick={onDateFilterChange}
        >
          today's tasks only
        </button>
      </div>
    </>
  );
}
