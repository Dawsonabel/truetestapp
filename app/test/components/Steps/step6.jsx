import React, { useState } from 'react';
import styles from '../../styles/oldTest.module.css';

const step6Questions = [
  { id: 'question-52', text: 'I prefer to let others lead in group settings' },
  { id: 'question-53', text: 'Going along with others to avoid arguments is common' },
  { id: 'question-54', text: 'I often put others\' needs before my own' },
];

const options = [
  { value: 0, label: 'Strongly Disagree' },
  { value: 1, label: 'Disagree' },
  { value: 2, label: 'Neutral' },
  { value: 3, label: 'Agree' },
  { value: 4, label: 'Strongly Agree' }
];

const Step6 = ({ goToStep, saveAnswers }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setError(false); 
  };

  const handleNextStep = () => {
    const answeredQuestions = step6Questions.filter(q => answers[q.id] !== undefined);
    if (answeredQuestions.length === step6Questions.length) {
      saveAnswers(answers);
      goToStep('step6five');
    } else {
      setError(true);
    }
  };

  const handlePrevStep = () => {
    goToStep('5');
  };

  return (
    <div className={styles['form-step']}>
      <h2>Step 6</h2>
      <div id="step-6-questions">
        {step6Questions.map((question) => (
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
        <p className={styles['step-text']}>Step 6/7</p>
        <button type="button" className={styles['prev-button']} onClick={handlePrevStep}>Previous</button>
        <button type="button" className={styles['next-button']} onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
};

export default Step6;