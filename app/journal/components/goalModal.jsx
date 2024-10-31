import React from 'react';
import styles from 'app/journal/styles/goalModal.module.css';

const GoalModal = ({ entry, onClose }) => {
  const getEntryTitle = (type) => {
    switch (type) {
      case 'gratitude': return 'Gratitude';
      case 'anxiety': return 'Anxiety';
      case 'worry': return 'Worry';
      default: return 'Entry';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{getEntryTitle(entry.type)}</h2>
        <p className={styles.entryDate}>
          {new Date(entry.dateTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </p>
        {entry.responses.map((response, index) => (
          <p key={index} className={styles.entryResponse}>{response}</p>
        ))}
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GoalModal;