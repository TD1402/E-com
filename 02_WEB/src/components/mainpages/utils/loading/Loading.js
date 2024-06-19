import React from "react";
import "./loading.css";

function Loading() {
  return (
    <div
      id="file_img"
      className="no-line d-flex justify-content-center align-items-center"
    >
      <div class="spinner-grow " role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
