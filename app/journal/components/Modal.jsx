import React, { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = 'unset';
      }, 300); // Match this duration with your CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAnimating]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.open : styles.closing}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
