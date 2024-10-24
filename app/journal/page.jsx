"use client";

import React, { useState } from 'react';
import styles from './styles/journal.module.css';
import cardStyles from './styles/JournalEntryCard.module.css';
import MoodModal from 'app/journal/components/modalContent/mood.jsx';
import GratitudeModal from 'app/journal/components/modalContent/grat.jsx';
import AnxietyModal from 'app/journal/components/modalContent/anxiety.jsx';
import WorryModal from 'app/journal/components/modalContent/worry.jsx';
import FlameSVG from 'app/journal/components/FlameSVG';
import JournalEntryCard from './components/JournalEntryCard';
import MoodEntryCard from './components/MoodEntryCard';

const JournalPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);

  const openModal = (modalType) => {
    console.log(`Opening modal: ${modalType}`); // Log when a modal is opened
    setActiveModal(modalType);
  };

  const closeModal = () => {
    console.log('Closing modal'); // Log when a modal is closed
    setActiveModal(null);
  };

  const handleTrendsClick = () => {
    // Add your trends functionality here
    console.log('Trends button clicked');
  };

  const handleJournalSubmit = (type, responses, dateTime) => {
    const newEntry = {
      type,
      responses,
      dateTime,
    };
    setJournalEntries([newEntry, ...journalEntries]);
    closeModal();
  };

  return (
    <div className={styles.journalPageContainer}>
      <div className={styles.journalContentWrapper}>
        <div className={styles.journalHeader}>
          <h1 className={styles.journalPageTitle}>Journal</h1>
          <div className={styles.streakCounter}>
            <div className={styles.streakContent}>
              <FlameSVG className={styles.flameSvg} />
              <span className={styles.streakDays}>1</span>
            </div>
          </div>
          <button className={styles.trendsButton} onClick={handleTrendsClick}>
            Trends
          </button>
        </div>
        <div className={styles.journalPageButtonContainer}>
          <div className={styles.moodButtonRow}>
            <button 
              className={`${styles.journalPageButton} ${styles.journalPageMoodButton}`}
              onClick={() => openModal('mood')}
            >
              <div className={styles.journalPageButtonContent}>
                <div className={styles.buttonIconRow}>
                  <img src="/images/icons/emotion.png" alt="Mood" className={styles.buttonIcon} />
                </div>
                <h2>Track Mood</h2>
                <p>Measure your mood over time</p>
              </div>
            </button>
          </div>
          <div className={styles.otherButtonsRow}>
            <button 
              className={`${styles.journalPageButton} ${styles.journalPageGratitudeButton}`}
              onClick={() => openModal('gratitude')}
            >
              <div className={styles.buttonIconRow}>
                <img src="/images/icons/growth.png" alt="Gratitude" className={styles.buttonIcon}/>
              </div>
              <p>Goal</p>
              <h2>Build Gratitude</h2>
            </button>
            <button 
              className={`${styles.journalPageButton} ${styles.journalPageAnxietyButton}`}
              onClick={() => openModal('anxiety')}
            >
              <div className={styles.buttonIconRow}>
                <img src="/images/icons/tornado.png" alt="Gratitude" className={styles.buttonIcon}/>
              </div>
              <p>Goal</p>
              <h2>Calm Anxiety</h2>
            </button>
            <button 
              className={`${styles.journalPageButton} ${styles.journalPageWorryButton}`}
              onClick={() => openModal('worry')}
            >
              <div className={styles.buttonIconRow}>
                <img src="/images/icons/mental-healthy.png" alt="Gratitude" className={styles.buttonIconBrain}/>
              </div>
              <p>Goal</p>
              <h2>Release Worry</h2>
            </button>
          </div>
        </div>
        <h2 className={styles.entriesTitle}>Entries</h2>
        <div className={styles.entriesContainer}>
          {journalEntries.map((entry, index) => (
            entry.type === 'mood' ? (
              <MoodEntryCard key={index} entry={entry} />
            ) : (
              <JournalEntryCard key={index} entry={entry} />
            )
          ))}
        </div>
      </div>
      <MoodModal isOpen={activeModal === 'mood'} onClose={closeModal} onSubmit={handleJournalSubmit} />
      <GratitudeModal isOpen={activeModal === 'gratitude'} onClose={closeModal} onSubmit={handleJournalSubmit} />
      <AnxietyModal isOpen={activeModal === 'anxiety'} onClose={closeModal} onSubmit={handleJournalSubmit} />
      <WorryModal isOpen={activeModal === 'worry'} onClose={closeModal} onSubmit={handleJournalSubmit} />
    </div>
  );
};

export default JournalPage;
