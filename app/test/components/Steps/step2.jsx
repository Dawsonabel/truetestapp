import React, { useState } from 'react';
import styles from '../../styles/oldTest.module.css';

const step2Questions = [
  { id: 'question-1', text: "I feel frustrated when people don't meet my expectations" },
  { id: 'question-2', text: "I often neglect my own needs in favor of helping others" },
  { id: 'question-3', text: "I avoid taking on responsibilities that don't contribute to my success" },
];

const options = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

const Step2 = ({ goToStep, saveAnswers }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = () => {
    if (Object.keys(answers).length === step2Questions.length) {
      saveAnswers(answers);
      goToStep('step2age'); // Changed this line
    } else {
      setError(true);
    }
  };

  const handlePrevStep = () => {
    goToStep('1');
  };

  return (
    <div className={styles['form-step']}>
      <h2>Step 2</h2>
      <div id="step-2-questions">
        {step2Questions.map((question) => (
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
        <p className={styles['step-text']}>Step 2/7</p>
        <button type="button" className={styles['prev-button']} onClick={handlePrevStep}>Previous</button>
        <button type="button" className={styles['next-button']} onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
};

export default Step2;