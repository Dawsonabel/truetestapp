import React from 'react';
import styles from 'app/journal/styles/worryModal.module.css';

const WorryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Release Worry</h2>
        <p>Techniques to let go of concerns and find peace go here...</p>
      </div>
    </div>
  );
};

export default WorryModal;