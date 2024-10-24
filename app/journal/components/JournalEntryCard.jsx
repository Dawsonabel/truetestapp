import React from 'react';
import styles from '../styles/JournalEntryCard.module.css';

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

  const getTypeImage = () => {
    switch (type) {
      case 'gratitude': return '/images/icons/growth.png';
      case 'anxiety': return '/images/icons/tornado.png';
      case 'worry': return '/images/icons/mental-healthy.png';
      default: return '/images/icons/journal.png';
    }
  };

  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <img
          src={getTypeImage()}
          alt={`${getTypeTitle()} icon`}
          width={24}
          height={24}
          className={styles.cardIcon}
        />
        <h3 className={styles.cardTitle}>{getTypeTitle()}</h3>
      </div>
      <p className={styles.cardDate}>{dateTime}</p>
      {responses.map((response, index) => (
        <p key={index} className={styles.cardResponse}>{response}</p>
      ))}
    </div>
  );
};

export default JournalEntryCard;
