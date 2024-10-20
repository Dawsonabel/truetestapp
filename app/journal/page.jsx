"use client";

import React, { useState } from 'react';
import styles from './styles/journal.module.css';
import MoodModal from './components/MoodModal'; 
import GratModal from './components/GratModal';
import AnxietyModal from './components/AnxietyModal';
import WorryModal from './components/WorryModal';

const JournalPage = () => {
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isGratModalOpen, setIsGratModalOpen] = useState(false);
  const [isAnxietyModalOpen, setIsAnxietyModalOpen] = useState(false);
  const [isWorryModalOpen, setIsWorryModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4" style={{ maxWidth: '500px' }}>
      <div className={styles.journalPageContainer}>
        <h1 className={styles.journalPageTitle}>Your Journal</h1>
        <div className={styles.journalPageButtonContainer}>
          <button 
            className={`${styles.journalPageButton} ${styles.journalPageMoodButton}`}
            onClick={() => setIsMoodModalOpen(true)}
          >
            <h2>Track your Mood</h2>
            <p>Log and analyze your daily emotions</p>
          </button>
          <button 
            className={`${styles.journalPageButton} ${styles.journalPageGratitudeButton}`}
            onClick={() => setIsGratModalOpen(true)}
          >
            <h2>Foster Gratitude</h2>
            <p>Practice appreciation for life&apos;s blessings</p>
          </button>
          <button 
            className={`${styles.journalPageButton} ${styles.journalPageAnxietyButton}`}
            onClick={() => setIsAnxietyModalOpen(true)}
          >
            <h2>Calm Anxiety</h2>
            <p>Techniques to reduce stress and worry</p>
          </button>
          <button 
            className={`${styles.journalPageButton} ${styles.journalPageWorryButton}`}
            onClick={() => setIsWorryModalOpen(true)}
          >
            <h2>Release Worry</h2>
            <p>Let go of concerns and find peace</p>
          </button>
        </div>
      </div>
      <MoodModal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)} />
      <GratModal isOpen={isGratModalOpen} onClose={() => setIsGratModalOpen(false)} />
      <AnxietyModal isOpen={isAnxietyModalOpen} onClose={() => setIsAnxietyModalOpen(false)} />
      <WorryModal isOpen={isWorryModalOpen} onClose={() => setIsWorryModalOpen(false)} />
    </div>
  );
};

export default JournalPage;
