import React from 'react';

const MoodEntryCard = ({ entry }) => {
  const { responses, dateTime } = entry;
  const [moodValue, note] = responses;
  const moodLabels = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img
          src="/images/icons/emotion.png"
          alt="Mood icon"
          width={24}
          height={24}
          className={styles.cardIcon}
        />
        <h3 className={styles.cardTitle}>Mood Tracking</h3>
      </div>
      <p className={styles.cardDate}>{dateTime}</p>
      <p className={styles.cardMood}>Mood: {moodLabels[moodValue - 1]}</p>
      {note && <p className={styles.cardNote}>{note}</p>}
    </div>
  );
};

export default MoodEntryCard;