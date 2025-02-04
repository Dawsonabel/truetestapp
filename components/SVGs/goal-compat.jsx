import React from "react";
import styles from "styles/goal.module.css";

const GoalCompat = () => {
  return (
    <div className="goal-container flex items-start gap-3 mt-5">
      <div className="goal-icon">
        <svg
          fill="#ffffff"
          viewBox="-3.84 -3.84 39.68 39.68"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#ffffff"
          strokeWidth="0.00032"
          width="40" /* Adjust size if needed */
          height="40" /* Adjust size if needed */
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0">
            <rect
              x="-3.84"
              y="-3.84"
              width="39.68"
              height="39.68"
              rx="7.936"
              fill="rgb(235, 130, 115)"
              strokeWidth="0"
            ></rect>
          </g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <defs>
              <style>.cls-1 {'{ fill: none; }'}</style>
            </defs>
            <path
              d="M25,10H7a3.0033,3.0033,0,0,0-3,3v6a2.0023,2.0023,0,0,0,2,2v7a2.0023,2.0023,0,0,0,2,2h4a2.0023,2.0023,0,0,0,2-2V16H12V28H8V19H6V13a1.0009,1.0009,0,0,1,1-1H25a1.0009,1.0009,0,0,1,1,1v6H24v9H20V16H18V28a2.0023,2.0023,0,0,0,2,2h4a2.0023,2.0023,0,0,0,2-2V21a2.0023,2.0023,0,0,0,2-2V13A3.0033,3.0033,0,0,0,25,10Z"
              transform="translate(0 0)"
            ></path>
            <path
              d="M10,9a4,4,0,1,1,4-4A4.0042,4.0042,0,0,1,10,9Zm0-6a2,2,0,1,0,2,2A2.0023,2.0023,0,0,0,10,3Z"
              transform="translate(0 0)"
            ></path>
            <path
              d="M22,9a4,4,0,1,1,4-4A4.0042,4.0042,0,0,1,22,9Zm0-6a2,2,0,1,0,2,2A2.0023,2.0023,0,0,0,22,3Z"
              transform="translate(0 0)"
            ></path>
            <rect
              id="_Transparent_Rectangle_"
              data-name="<Transparent Rectangle>"
              className="cls-1"
              width="32"
              height="32"
            ></rect>
          </g>
        </svg>
      </div>
      <div className="mt-1">
        <div className={`${styles['goal-text']}`}>
          <p className="text-s font-normal text-black">Compatibility Goal</p>
          <p className="text-base font-semibold text-black">Find a compatible partner</p>
        </div>
      </div>
    </div>
  );
};

export default GoalCompat;
