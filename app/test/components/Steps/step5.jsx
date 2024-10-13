import React, { useState } from 'react';
import styles from '../../styles/oldTest.module.css';

const step5Questions = [
  { id: 'question-1', text: '"I have a strong inner critic that keeps me in check"' },
  { id: 'question-2', text: '"I often feel guilty when I take time for myself"' },
  { id: 'question-3', text: '"I have high standards for myself and others"' },
];

const options = [
  { value: 0, label: 'Strongly Disagree' },
  { value: 1, label: 'Disagree' },
  { value: 2, label: 'Neutral' },
  { value: 3, label: 'Agree' },
  { value: 4, label: 'Strongly Agree' }
];

const Step5 = ({ goToStep, saveAnswers }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = () => {
    if (Object.keys(answers).length === step5Questions.length) {
      saveAnswers(answers);
      goToStep('6');
    } else {
      setError(true);
    }
  };

  const handlePrevStep = () => {
    goToStep('4');
  };

  return (
    <div className={styles['form-step']}>
      <h2>Step 5</h2>
      <div id="step-5-questions">
        {step5Questions.map((question) => (
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
        <p className={styles['step-text']}>Step 5/7</p>
        <button type="button" className={styles['prev-button']} onClick={handlePrevStep}>Previous</button>
        <button type="button" className={styles['next-button']} onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
};

export default Step5;