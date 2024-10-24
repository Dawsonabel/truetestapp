import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import styles from 'app/journal/styles/modalContent/moodModal.module.css';

const MoodModal = ({ isOpen, onClose, onSubmit }) => {
  const [moodValue, setMoodValue] = useState(null); // Start with no selection
  const [note, setNote] = useState('');
  const [dayWord, setDayWord] = useState('');
  const [error, setError] = useState('');

  const moodLabels = ['Great', 'Good', 'Neutral', 'Bad', 'Terrible'];

  const handleMoodSelect = (value) => {
    setMoodValue(value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleDayWordChange = (e) => {
    const value = e.target.value;
    if (value.length > 15 || /\s/.test(value)) {
      setError('Must use one word');
    } else {
      setError('');
      setDayWord(value);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'short' });
    const time = now.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day} ${month}, ${time}`;
  };

  const handleSubmit = () => {
    onSubmit('mood', [moodValue, note, dayWord], getCurrentDateTime());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.moodContent}>
        <h1 className={styles.moodTitle}>What&apos;s up?</h1>
        <p className={styles.dateTime}>{getCurrentDateTime()}</p>

        <div className={styles.moodButtonsContainer}>
          {moodLabels.map((label, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(index + 1)}
              className={`${styles.moodButton} ${moodValue === index + 1 ? styles.selected : ''}`}
            >
              <img src={`/images/emotions/emotion${index + 1}.png`} alt={label} className={styles.moodImage} />
            </button>
          ))}
        </div>

        <div className={styles.noteSection}>
          <label htmlFor="moodNote" className={styles.noteLabel}>
            Describe your mood:
          </label>
          <textarea
            id="moodNote"
            value={note}
            onChange={handleNoteChange}
            className={styles.moodInput}
            placeholder="Write here..."
            rows="7"
          />
        </div>

        <div className={styles.dayWordSection}>
          <label htmlFor="dayWord" className={styles.dayWordLabel}>
            What&apos;s one word that can describe your day?
          </label>
          <input
            id="dayWord"
            type="text"
            value={dayWord}
            onChange={handleDayWordChange}
            className={styles.dayWordInput}
            placeholder="Enter one word..."
            maxLength="30"
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button onClick={handleSubmit} className={styles.submitButton}>
          Save Mood
        </button>
      </div>
    </Modal>
  );
};

export default MoodModal;
