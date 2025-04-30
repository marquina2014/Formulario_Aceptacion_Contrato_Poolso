import React from "react";
import "../src/Form.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          width="100"
          height="100"
          style={{ background: "transparent" }}
        >
          <g>
            <circle strokeWidth="2" stroke="#6d42c7" fill="none" r="0" cy="50" cx="50">
              <animate begin="0s" calcMode="spline" keySplines="0 0.2 0.8 1" keyTimes="0;1" values="0;40" dur="1s" repeatCount="indefinite" attributeName="r" />
              <animate begin="0s" calcMode="spline" keySplines="0.2 0 0.8 1" keyTimes="0;1" values="1;0" dur="1s" repeatCount="indefinite" attributeName="opacity" />
            </circle>
            <circle strokeWidth="2" stroke="#e85b48" fill="none" r="0" cy="50" cx="50">
              <animate begin="-0.5s" calcMode="spline" keySplines="0 0.2 0.8 1" keyTimes="0;1" values="0;40" dur="1s" repeatCount="indefinite" attributeName="r" />
              <animate begin="-0.5s" calcMode="spline" keySplines="0.2 0 0.8 1" keyTimes="0;1" values="1;0" dur="1s" repeatCount="indefinite" attributeName="opacity" />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
