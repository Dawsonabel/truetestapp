import React, { useState } from 'react';
import Modal from '../Modal';
import styles from 'app/journal/styles/modalContent/gratModal.module.css';

const GratitudeModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState(['', '', '', '']);

  const prompts = [
    "Who has brightened your day?",
    "What's something you're looking forward to?",
    "What's a small win you've had recently?",
    "What's something beautiful you've seen lately?"
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
      // Close the modal on the last step
      onClose();
    }
  };

  const handleBack = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1);
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
    onSubmit('gratitude', responses, getCurrentDateTime());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.gratitudeContent}>
        <h1 className={styles.gratitudeTitle}>Building Gratitude</h1>
        <p className={styles.dateTime}>{getCurrentDateTime()}</p>
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
          <label htmlFor="gratitudeInput" className={styles.questionLabel}>
            {prompts[currentPrompt]}
          </label>
          <textarea
            id="gratitudeInput"
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

export default GratitudeModal;
