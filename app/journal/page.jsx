"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/journal.module.css';
import MoodModal from 'app/journal/components/modalContent/mood.jsx';
import GratitudeModal from 'app/journal/components/modalContent/grat.jsx';
import AnxietyModal from 'app/journal/components/modalContent/anxiety.jsx';
import WorryModal from 'app/journal/components/modalContent/worry.jsx';
import FlameSVG from 'app/journal/components/flameSVG.jsx';
import JournalEntryCard from './components/journalEntryCard';
import DayCard from './components/dayCard';
import TrendsComponent from './components/trends.jsx';

const TrendsIcon = () => (
  <svg 
    className="w-6 h-6 text-[#7081e6] mr-2" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" 
    />
  </svg>
);

const JournalPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const router = useRouter();

  const checkAuthAndFetchEntries = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchJournalEntries(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuthAndFetchEntries();
  }, [checkAuthAndFetchEntries]);

  const fetchJournalEntries = async (token) => {
    try {
      const response = await fetch('/.netlify/functions/journal-entries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJournalEntries(data);
      } else {
        console.error('Failed to fetch journal entries');
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const openModal = (modalType) => {
    console.log(`Opening modal: ${modalType}`); // Log when a modal is opened
    setActiveModal(modalType);
  };

  const closeModal = () => {
    console.log('Closing modal'); // Log when a modal is closed
    setActiveModal(null);
  };

  const handleTrendsClick = () => {
    setShowTrends(true);
  };

  const closeTrends = () => {
    setShowTrends(false);
  };

  const handleJournalSubmit = async (type, responses, dateTime) => {
    if (!isLoggedIn) {
      alert('You must be logged in to save journal entries.');
      return;
    }

    const newEntry = {
      type,
      responses,
      dateTime: dateTime.toISOString(), 
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/journal-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEntry)
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setJournalEntries(prevEntries => {
          // For 'Goal' entries, remove any existing entry of the same type for the same day
          if (['gratitude', 'anxiety', 'worry'].includes(type)) {
            const startOfDay = new Date(dateTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(dateTime);
            endOfDay.setHours(23, 59, 59, 999);

            return [
              savedEntry,
              ...prevEntries.filter(entry => 
                !(entry.type === type && 
                  new Date(entry.dateTime) >= startOfDay && 
                  new Date(entry.dateTime) <= endOfDay)
              )
            ];
          }
          // For mood entries, simply add the new entry
          return [savedEntry, ...prevEntries];
        });
        closeModal();
      } else {
        console.error('Failed to save journal entry');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const groupEntriesByDay = (entries) => {
    const grouped = {};
    entries.forEach(entry => {
      const date = new Date(entry.dateTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
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
          <button 
            className="flex items-center justify-center bg-[#7081e6] bg-opacity-10 px-2 py-1 rounded-2xl border border-[#7081e6] transition-colors"
            onClick={handleTrendsClick}
          >
            <TrendsIcon />
            <span className="text-[#7081e6] font-semibold">Trends</span>
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
          {groupEntriesByDay(journalEntries).map(([date, entries]) => (
            <DayCard key={date} date={date} entries={entries} />
          ))}
        </div>
      </div>
      <TrendsComponent 
        isOpen={showTrends} 
        onClose={closeTrends} 
        journalEntries={journalEntries} 
      />
      <MoodModal isOpen={activeModal === 'mood'} onClose={closeModal} onSubmit={handleJournalSubmit} />
      <GratitudeModal isOpen={activeModal === 'gratitude'} onClose={closeModal} onSubmit={handleJournalSubmit} />
      <AnxietyModal isOpen={activeModal === 'anxiety'} onClose={closeModal} onSubmit={handleJournalSubmit} />
      <WorryModal isOpen={activeModal === 'worry'} onClose={closeModal} onSubmit={handleJournalSubmit} />
    </div>
  );
};

export default JournalPage;
