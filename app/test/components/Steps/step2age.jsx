import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/step2.module.css'; // Updated import

const step2AgeQuestion = {
    id: 'q2',
    text: 'What is your age?',
    name: 'question2',
    valuePrefix: 'B'
};

const ageRanges = [
    { label: 'Under 18', value: 'under18' },
    { label: '18-24', value: 'age18-24' },
    { label: '25-34', value: 'age25-34' },
    { label: '35-44', value: 'age35-44' },
    { label: '45-54', value: 'age45-54' },
    { label: '55+', value: 'age55plus' }
];

const TYPING_SPEED = 40; // milliseconds per character

const Step2Age = ({ saveAnswers, goToStep }) => {
    const [error, setError] = useState(false);
    const [selectedAge, setSelectedAge] = useState(null);
    const [displayedQuestion, setDisplayedQuestion] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [contentOpacity, setContentOpacity] = useState(0);

    const typeWriter = useCallback((text, index) => {
        if (index < text.length) {
            setDisplayedQuestion(text.substring(0, index + 1));
            setTimeout(() => typeWriter(text, index + 1), TYPING_SPEED);
        } else {
            setIsTyping(false);
            setTimeout(() => {
                setShowContent(true);
                setTimeout(() => setContentOpacity(1), 50); // Start fade-in shortly after content is shown
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (isTyping) {
            typeWriter(step2AgeQuestion.text, 0);
        }
    }, [isTyping, typeWriter]);

    const handleAgeSelect = (value) => {
        setSelectedAge(value);
        setError(false);
        saveAnswers({ [step2AgeQuestion.id]: value });
        goToStep('3');
    };

    return (
        <div className={styles['form-step']}>
            <h2>Age</h2>

            <img src="/images/age.png" alt="Age Image" className="w-2/5 h-auto mb-4 mx-auto" />
            <div id="step-2-age-question">
                <div className={styles['form-group']}>
                    <p className={styles['question-text']}>{displayedQuestion}</p>
                    {showContent && (
                        <div style={{ opacity: contentOpacity, transition: 'opacity 1s ease-in-out' }}>
                            <p className={styles['step-text']}>Please select your age range. This helps us tailor our report to your life stage.</p>
                            <div className={styles['divider-line']}></div>
                            <div className={styles['age-options-container']}>
                                {ageRanges.map((option) => (
                                    <div key={option.value} className={styles['button-container']}>
                                        <button
                                            className={`${styles['unique-age-button']} ${styles[`${option.value}-button`]} ${selectedAge === option.value ? styles['selected'] : ''}`}
                                            onClick={() => handleAgeSelect(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <div className={styles['error-message']} style={{ color: 'red' }}>
                    Please select an age range before moving to the next step.
                </div>
            )}
        </div>
    );
};

export default Step2Age;
