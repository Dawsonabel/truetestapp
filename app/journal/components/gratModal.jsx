import React from 'react';
import styles from 'app/journal/styles/gratModal.module.css';

const MoodModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Foster Gratitude</h2>
        <p>Content for tracking mood goes here...</p>
      </div>
    </div>
  );
};

export default MoodModal;
