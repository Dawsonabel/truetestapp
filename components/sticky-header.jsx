"use client";

import { useState, useEffect } from "react";
import styles from "styles/sticky-header.module.css";

const StickyHeader = () => {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  // Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer); // Cleanup the timer
  }, []);

  // Format time as "MM:SS" with separate colon
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");

    return (
      <>
        <span className={styles.timerNumber}>{minutes}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.timerNumber}>{seconds}</span>
      </>
    );
  };

  // Updated function to handle scrolling
  const handleScroll = () => {
    const cardButton = document.querySelector('#card-button');
    if (cardButton) {
      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        cardButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      console.error('Card button not found');
    }
  };

  return (
    <div className={`${styles['sticky-banner']} w-full flex justify-between items-center`}>
      <div className="ml-4">
        <div className={`${styles["timer-container"]}`}>
          <span className="text-xsm font-semibold mb-0">Discount expires in</span>
          <div className="flex flex-col items-center">
            <span className={`${styles.timer}`}>{formatTime(timeRemaining)}</span>
            <div className={`${styles["timer-labels"]}`}>
              <span>min</span>
              <span>sec</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleScroll}
        className={`bg-green-600 text-white font-bold py-1.5 px-3 rounded-lg transition ${styles['header-button']}`}
      >
        GET MY REPORT
      </button>
    </div>
  );
};

export default StickyHeader;
