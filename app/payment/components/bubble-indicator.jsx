import React from "react";
import styles from "app/payment/styles/bubble.module.css"; // Import the new bubble styles

const BubbleIndicator = ({ currentIndex, totalBubbles }) => {
  const bubbleWidth = 27.5; // Adjust based on the bubble size and spacing

  return (
    <div className={styles["bubble-container"]}>
      <div className={styles["bubble-indicator"]}>
        {Array.from({ length: totalBubbles }).map((_, index) => (
          <div key={index} className={styles["bubble"]}></div>
        ))}
        {/* Highlighted Moving Bubble */}
        <div
          className={`${styles["bubble-highlight"]} ${currentIndex === 0 ? styles["no-transition"] : styles["transition-all"]}`}
          style={{
            transform: `translateX(${currentIndex * bubbleWidth}px)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default BubbleIndicator;
