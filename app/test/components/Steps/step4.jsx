import React, { useState } from 'react';
import styles from '../../styles/oldTest.module.css';

const step4Questions = [
  { id: 'question32', text: 'I often criticize myself when I fail to meet my own standards' },
  { id: 'question33', text: 'I feel happiest when I am helping someone in need' },
  { id: 'question34', text: 'I dislike taking risks that might lead to failure' },
];

const options = [
  { value: 0, label: 'Strongly Disagree' },
  { value: 1, label: 'Disagree' },
  { value: 2, label: 'Neutral' },
  { value: 3, label: 'Agree' },
  { value: 4, label: 'Strongly Agree' }
];

const Step4 = ({ goToStep, saveAnswers }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = () => {
    if (Object.keys(answers).length === step4Questions.length) {
      saveAnswers(answers);
      goToStep('step4Process'); // Navigate to step4Process after Step4
    } else {
      setError(true);
    }
  };

  const handlePrevStep = () => {
    goToStep('3');
  };

  return (
    <div className={styles['form-step']}>
      <h2>Step 4</h2>
      <div id="step-4-questions">
        {step4Questions.map((question) => (
          <div key={question.id} className={styles['form-group']}>
            <label>{question.text}</label>
            <div className={styles['divider-line']}></div>
            <div className={styles.options}>
              {options.map((option, index) => (
                <div key={`${question.id}-${index}`} className={styles.option}>
                  <input
                    type="radio"
                    id={`${question.id}-${index}`}
                    name={question.id}
                    value={option.value}
                    onChange={() => handleAnswer(question.id, option.value)}
                    checked={answers[question.id] === option.value}
                  />
                  <label htmlFor={`${question.id}-${index}`}>
                    <span>{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className={styles['error-message']} style={{ color: 'red' }}>
          Please answer all questions before moving on.
        </div>
      )}
      <div className={styles['button-group']}>
        <p className={styles['step-text']}>Step 4/7</p>
        <button type="button" className={styles['prev-button']} onClick={handlePrevStep}>Previous</button>
        <button type="button" className={styles['next-button']} onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
};

export default Step4;
