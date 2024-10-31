import React from 'react';
import styles from 'app/journal/styles/journalEntryCard.module.css';

const JournalEntryCard = ({ entry }) => {
  const { type, responses, dateTime } = entry;

  const getTypeTitle = () => {
    switch (type) {
      case 'gratitude': return 'Gratitude';
      case 'anxiety': return 'Anxiety';
      case 'worry': return 'Worry';
      default: return 'Journal Entry';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'gratitude': return '/images/icons/growth.png';
      case 'anxiety': return '/images/icons/tornado.png';
      case 'worry': return '/images/icons/mental-healthy.png';
      default: return '/images/icons/journal.png';
    }
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className={`${styles.entryCard} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <img
          src={getTypeIcon()}
          alt={getTypeTitle()}
          width={24}
          height={24}
          className={styles.cardIcon}
        />
        <div>
          <h3 className={styles.cardTitle}>{getTypeTitle()}</h3>
          <p className={styles.cardTime}>{formatTime(dateTime)}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        {responses.map((response, index) => (
          <p key={index} className={styles.cardResponse}>{response}</p>
        ))}
      </div>
    </div>
  );
};

export default JournalEntryCard;
