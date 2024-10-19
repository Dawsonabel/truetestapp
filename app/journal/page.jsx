import React from 'react';
import styles from './components/journal.module.css';

const JournalPage = () => {
  return (
    <div className="container mx-auto px-4" style={{ maxWidth: '500px' }}>
      <div className={styles.journalPageContainer}>
        <h1 className={styles.journalPageTitle}>Your Journal</h1>
        <div className={styles.journalPageButtonContainer}>
          <button className={`${styles.journalPageButton} ${styles.journalPageMoodButton}`}>
            <h2>Track your Mood</h2>
            <p>Log and analyze your daily emotions</p>
          </button>
          <button className={`${styles.journalPageButton} ${styles.journalPageGratitudeButton}`}>
            <h2>Foster Gratitude</h2>
            <p>Practice appreciation for life&apos;s blessings</p>
          </button>
          <button className={`${styles.journalPageButton} ${styles.journalPageAnxietyButton}`}>
            <h2>Calm Anxiety</h2>
            <p>Techniques to reduce stress and worry</p>
          </button>
          <button className={`${styles.journalPageButton} ${styles.journalPageWorryButton}`}>
            <h2>Release Worry</h2>
            <p>Let go of concerns and find peace</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
