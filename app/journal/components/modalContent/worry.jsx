import React, { useState } from 'react';
import Modal from '../Modal';
import styles from 'app/journal/styles/modalContent/worryModal.module.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarIcon = () => (
  <svg className={styles.dateTimeIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
    <path d="M4 8h16v13H4z" fill="none"/>
    <path d="M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
  </svg>
);

const WorryModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState(['', '', '', '']);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const prompts = [
    "What's worrying you right now?",
    "What's the worst that could happen?",
    "What's the best that could happen?",
    "What's a small step you can take to address this worry?"
  ];

  const handleInputChange = (e) => {
    const newResponses = [...responses];
    newResponses[currentPrompt] = e.target.value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1);
    }
  };

  const handleDateTimeChange = (date) => {
    setSelectedDateTime(date);
  };

  const handleSubmit = () => {
    onSubmit('worry', responses, selectedDateTime);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.gratitudeContent}>
        <h1 className={styles.gratitudeTitle}>Release Worry</h1>
        <div className={styles.datePickerWrapper}>
          <div className={styles.dateTimeInputWrapper}>
            <CalendarIcon />
            <DatePicker
              selected={selectedDateTime}
              onChange={handleDateTimeChange}
              dateFormat="MMMM d, yyyy"
              className={styles.dateTimeInput}
              wrapperClassName={styles.datePickerWrapper}
            />
          </div>
        </div>
        <div className={styles.progressBar}>
          <button 
            className={`${styles.progressArrow} ${currentPrompt === 0 ? styles.progressArrowDisabled : ''}`}
            onClick={handleBack}
            disabled={currentPrompt === 0}
          >
            ←
          </button>
          <span className={styles.progressText}>{`${currentPrompt + 1} of ${prompts.length}`}</span>
          <button 
            className={styles.progressArrow}
            onClick={currentPrompt === prompts.length - 1 ? handleSubmit : handleNext}
          >
            {currentPrompt === prompts.length - 1 ? '✓' : '→'}
          </button>
        </div>
        <div className={styles.questionSection}>
          <label htmlFor="worryInput" className={styles.questionLabel}>
            {prompts[currentPrompt]}
          </label>
          <textarea
            id="worryInput"
            value={responses[currentPrompt]}
            onChange={handleInputChange}
            className={styles.gratitudeInput}
            placeholder="Write here..."
            rows="17"
          />
        </div>
      </div>
    </Modal>
  );
};

export default WorryModal;
