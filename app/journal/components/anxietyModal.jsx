import React from 'react';
import styles from 'app/journal/styles/anxietyModal.module.css';

const AnxietyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Calm Anxiety</h2>
        <p>Techniques to reduce stress and worry go here...</p>
      </div>
    </div>
  );
};

export default AnxietyModal;