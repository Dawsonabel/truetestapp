import React from 'react';
import styles from 'app/journal/styles/moodEntryCard.module.css';

const MoodEntryCard = ({ entry }) => {
  const { type, responses, dateTime } = entry;
  const [moodValue, note] = responses;

  const getTypeTitle = () => {
    return getMoodText(moodValue);
  };

  const getMoodImage = () => {
    return `/images/emotions/emotion${moodValue}.png`;
  };

  const getMoodColor = (value) => {
    switch (parseInt(value)) {
      case 5: return '#24a276';
      case 4: return '#70cf69';
      case 3: return '#ebd873';
      case 2: return '#e6a570';
      case 1: return '#e67070';
      default: return 'black';
    }
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getMoodText = (value) => {
    switch (parseInt(value)) {
      case 5: return 'Great';
      case 4: return 'Good';
      case 3: return 'Okay';
      case 2: return 'Bad';
      case 1: return 'Terrible';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`${styles.entryCard} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <img
          src={getMoodImage()}
          alt={`Mood ${getMoodText(moodValue)}`}
          width={50}
          height={50}
          className={styles.cardIcon}
        />
        <div>
          <h3 
            className={styles.cardTitle}
            style={{ color: getMoodColor(moodValue) }}
          >
            {getTypeTitle()}
          </h3>
          <p className={styles.cardTime}>{formatTime(dateTime)}</p>
        </div>
      </div>
      {note && <p className={styles.cardNote}>{note}</p>}
    </div>
  );
};

export default MoodEntryCard;
