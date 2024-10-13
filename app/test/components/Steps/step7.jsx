import React, { useState } from 'react';
import styles from '../../styles/oldTest.module.css';

const step7Questions = [
  { id: 'question52', text: 'I prefer to let others lead in group settings' },
  { id: 'question53', text: 'Going along with others to avoid arguments is common' },
  { id: 'question54', text: 'I often put others\' needs before my own' },
];

const options = [
  { value: 0, label: 'Strongly Disagree' },
  { value: 1, label: 'Disagree' },
  { value: 2, label: 'Neutral' },
  { value: 3, label: 'Agree' },
  { value: 4, label: 'Strongly Agree' }
];

const Step7 = ({ goToStep, saveAnswers, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleComplete = () => {
    if (Object.keys(answers).length === step7Questions.length) {
      saveAnswers(answers);
      onComplete(answers);
    } else {
      setError(true);
    }
  };

  const handlePrevStep = () => {
    goToStep('6');
  };

  return (
    <div className={styles['form-step']}>
      <h2>Step 7</h2>
      <div id="step-7-questions">
        {step7Questions.map((question) => (
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
          Please answer all questions before completing the test.
        </div>
      )}
      <div className={styles['button-group']}>
        <p className={styles['step-text']}>Step 7/7</p>
        <button type="button" className={styles['prev-button']} onClick={handlePrevStep}>Previous</button>
        <button type="button" className={styles['next-button']} onClick={handleComplete}>Complete</button>
      </div>
    </div>
  );
};

export default Step7;