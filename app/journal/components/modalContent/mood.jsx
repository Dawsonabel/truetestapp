import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import styles from 'app/journal/styles/modalContent/moodModal.module.css';
import Circle from 'components/SVGs/circle';
import DayWord from 'app/journal/components/dayWord.jsx';
import NoteSection from 'app/journal/components/noteSection.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Add this new SVG component
const CalendarIcon = () => (
  <svg className={styles.dateTimeIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
    <path d="M4 8h16v13H4z" fill="none"/>
    <path d="M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
  </svg>
);

const MoodModal = ({ isOpen, onClose, onSubmit }) => {
  const [moodValue, setMoodValue] = useState(null);
  const [note, setNote] = useState('');
  const [dayWord, setDayWord] = useState('');
  const [error, setError] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDayWord, setShowDayWord] = useState(false);
  const [showNoteSection, setShowNoteSection] = useState(false);

  const moodLabels = ['Great', 'Good', 'Okay', 'Bad', 'Terrible'];
  const moodClasses = ['great', 'good', 'okay', 'bad', 'terrible'];

  const handleMoodSelect = (value) => {
    setMoodValue(value);
    setShowDayWord(true);
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

  const handleDateTimeChange = (date) => {
    setSelectedDateTime(date);
  };

  const handleDayWordSubmit = () => {
    setShowDayWord(false);
    setShowNoteSection(true);
  };

  const handleSubmit = () => {
    onSubmit('mood', [moodValue, note, dayWord], selectedDateTime);
    onClose();
  };

  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setMoodValue(null);
      setNote('');
      setDayWord('');
      setError('');
      setSelectedDateTime(new Date());
      setShowDayWord(false);
      setShowNoteSection(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {showDayWord ? (
        <DayWord dayWord={dayWord} onDayWordChange={handleDayWordChange} error={error} onSubmit={handleDayWordSubmit} />
      ) : showNoteSection ? (
        <NoteSection note={note} onNoteChange={handleNoteChange} onSubmit={handleSubmit} />
      ) : (
      <div>
        <div className={styles.datePickerWrapper}>
          <div className={styles.dateTimeInputWrapper}>
            <CalendarIcon />
            <DatePicker
              selected={selectedDateTime}
              onChange={handleDateTimeChange}
              showTimeSelect
              dateFormat="MMMM d, yyyy HH:mm"
              timeFormat="HH:mm"
              className={styles.dateTimeInput}
              wrapperClassName={styles.datePickerWrapper}
            />
          </div>
        </div>
        <div className={styles.moodContent}>
          <h1 className={styles.moodTitle}>How&apos;s it going?</h1>

          <div className={`${styles.moodButtonsContainer} ${styles.overflowHidden}`}>
            <Circle className={styles.circleBackground} />
            {moodLabels.map((label, index) => (
              <div key={index} className={styles.moodButtonWrapper}>
                <button
                  onClick={() => handleMoodSelect(5 - index)}
                  className={`${styles.moodButton} ${moodValue === 5 - index ? styles.selected : ''}`}
                >
                  <img src={`/images/emotions/emotion${5 - index}.png`} alt={label} className={styles.moodImage} />
                </button>
                <span className={`${styles.moodLabel} ${styles[moodClasses[index]]}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </Modal>
  );
};

export default MoodModal;
