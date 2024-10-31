import React from 'react';
import styles from 'app/journal/styles/modalContent/moodModal.module.css';

const DayWord = ({ dayWord, onDayWordChange, error, onSubmit }) => {
  return (
    <div className={styles.dayWordSection}>
      <label htmlFor="dayWord" className={styles.dayWordLabel}>
        What&apos;s one word that can describe your day?
      </label>
      <input
        id="dayWord"
        type="text"
        value={dayWord}
        onChange={onDayWordChange}
        className={styles.dayWordInput}
        placeholder="Enter one word..."
        maxLength="30"
      />
      {error && <p className={styles.error}>{error}</p>}

      <button onClick={onSubmit} className={styles.submitButton}>
          Save Mood
      </button>
    </div>
  );
};

export default DayWord;
