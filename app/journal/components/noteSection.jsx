import React from 'react';
import styles from 'app/journal/styles/modalContent/moodModal.module.css';

const NoteSection = ({ note, onNoteChange, onSubmit }) => {
  return (
    <div>
        <div className="flex justify-center items-center">
            <p className="text-sm text-gray-500 mb-1">The more the better!</p>
            <img 
              src="/images/emotions/icon.png" 
              alt="Icon" 
              width={24} 
              height={24} 
              className="ml-2 mb-1"
            />
        </div>
      <div className={styles.moodContainer}>
        <div className={styles.noteContainer}>
            <label htmlFor="moodNote" className={styles.noteLabel}>
                Quick note about your day:
            </label>
            <textarea
                id="moodNote"
                value={note}
                onChange={onNoteChange}
                className={styles.moodInput}
                placeholder="Write here..."
                rows="9"
            />
            <button onClick={onSubmit} className={styles.submitButton}>
                Submit Entry
            </button>
        </div>
      </div>
    </div>
  );
};

export default NoteSection;
