import React, { useState, useEffect } from 'react';
import styles from '../../styles/step1.module.css'; // Ensure you have a CSS file for styling

const phrases = [
  "Thank you for sharing!",
  "Traitly already helps thousands of people.",
  "We're excited to help you next!",
  "Let's continue."
];

const TYPING_SPEED = 40; // milliseconds per character
const PHRASE_DELAY = 1500; // delay between phrases
const FINAL_DELAY = 2000; // delay before moving to next step

const Step1Intro = ({ goToStep }) => {
  const [displayedPhrases, setDisplayedPhrases] = useState([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    let timeoutId;
    
    const typePhrase = (phrase, index = 0) => {
      if (index <= phrase.length) {
        setDisplayedPhrases(prev => {
          const newPhrases = [...prev];
          newPhrases[currentPhraseIndex] = phrase.slice(0, index);
          return newPhrases;
        });
        timeoutId = setTimeout(() => typePhrase(phrase, index + 1), TYPING_SPEED);
      } else {
        timeoutId = setTimeout(nextPhrase, PHRASE_DELAY);
      }
    };

    const nextPhrase = () => {
      if (currentPhraseIndex < phrases.length - 1) {
        setCurrentPhraseIndex(prevIndex => prevIndex + 1);
      } else {
        setTimeout(() => goToStep('2'), FINAL_DELAY);
      }
    };

    if (currentPhraseIndex < phrases.length) {
      typePhrase(phrases[currentPhraseIndex]);
    }

    return () => clearTimeout(timeoutId);
  }, [currentPhraseIndex, goToStep]);

  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        {displayedPhrases.map((phrase, index) => (
          <h1 key={index} className={styles.question_text}>{phrase}</h1>
        ))}
      </div>
    </div>
  );
};

export default Step1Intro;
