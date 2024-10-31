import React, { useState } from 'react';
import styles from 'app/journal/styles/dayCard.module.css';
import MoodEntryCard from './MoodEntryCard';
import GoalModal from './goalModal';

const DayCard = ({ date, entries }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const moodEntries = entries.filter(entry => entry.type === 'mood');
  const otherEntries = entries.filter(entry => entry.type !== 'mood');

  const getEntryIcon = (type) => {
    switch (type) {
      case 'gratitude': return '/images/icons/growth.png';
      case 'anxiety': return '/images/icons/tornado.png';
      case 'worry': return '/images/icons/mental-healthy.png';
      default: return '';
    }
  };

  const getEntryColor = (type) => {
    switch (type) {
      case 'gratitude': return '#2aa12e';
      case 'anxiety': return '#2196F3';
      case 'worry': return '#FF7043';
      default: return '#000000';
    }
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  return (
    <div className={styles.dayCard}>
      <div className={styles.dateHeader}>
        <h2>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
      </div>
      {otherEntries.length > 0 && (
        <div className={styles.otherEntriesContainer}>
          {otherEntries.map((entry, index) => (
            <button 
              key={index} 
              className={styles.entryButton}
              style={{ '--button-color': getEntryColor(entry.type) }}
              onClick={() => openModal(entry)}
            >
              <img 
                src={getEntryIcon(entry.type)} 
                alt={entry.type} 
                className={`${styles.entryIcon} ${entry.type === 'worry' ? styles.worryIcon : ''}`} 
              />
              <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="24" height="24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
      <div className={styles.entriesContainer}>
        {moodEntries.map((entry, index) => (
          <MoodEntryCard key={index} entry={entry} />
        ))}
      </div>
      {selectedEntry && (
        <GoalModal entry={selectedEntry} onClose={closeModal} />
      )}
    </div>
  );
};

export default DayCard;
