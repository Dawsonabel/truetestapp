import React, { useState } from 'react';
import styles from '../../styles/oldTest.module.css';

const step3Questions = [
  { id: 'question-9', text: "I tend to go along with others' decisions to keep the peace" },
  { id: 'question-10', text: "I measure my worth by how much I accomplish" },
  { id: 'question-11', text: "What is your approach to conflicts?" },
];

const options = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

const Step3 = ({ goToStep, saveAnswers }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = () => {
    if (Object.keys(answers).length === step3Questions.length) {
      saveAnswers(answers);
      goToStep('4'); 
    } else {
      setError(true);
    }
  };

  const handlePrevStep = () => {
    goToStep('2');
  };

  return (
    <div className={styles['form-step']}>
      <h2>Step 3</h2>
      <div id="step-3-questions">
        {step3Questions.map((question) => (
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
        <p className={styles['step-text']}>Step 3/7</p>
        <button type="button" className={styles['prev-button']} onClick={handlePrevStep}>Previous</button>
        <button type="button" className={styles['next-button']} onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
};

export default Step3;
