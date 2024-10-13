import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/step6.module.css'; // Updated import

const step2FearQuestion = {
    id: 'q2',
    text: 'What\'s your biggest fear?',
    name: 'question2',
    valuePrefix: 'F'
};

const fearOptions = [
    { label: 'Heights 🫨', value: 'heights' },
    { label: 'Spiders', value: 'spiders' },
    { label: 'Darkness', value: 'darkness' },
    { label: 'Flying', value: 'flying' },
    { label: 'Public Speaking', value: 'publicSpeaking' },
    { label: 'Confined Spaces', value: 'confinedSpaces' },
    { label: 'Failure', value: 'failure' }, // New option
    { label: 'Rejection', value: 'rejection' }, // New option
    { label: 'Loneliness', value: 'loneliness' } // New option
];

const TYPING_SPEED = 40; // milliseconds per character

const Step6five = ({ saveAnswers, goToStep }) => {
    const [error, setError] = useState(false);
    const [selectedFears, setSelectedFears] = useState([]); // Changed to an array
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
                setTimeout(() => setContentOpacity(1), 50);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (isTyping) {
            typeWriter(step2FearQuestion.text, 0);
        }
    }, [isTyping, typeWriter]);

    const handleFearSelect = (value) => {
        setSelectedFears((prevSelectedFears) => {
            if (prevSelectedFears.includes(value)) {
                return prevSelectedFears.filter(fear => fear !== value);
            } else {
                return [...prevSelectedFears, value];
            }
        });
        setError(false);
    };

    const handleContinue = () => {
        if (selectedFears.length > 0) {
            saveAnswers({ [step2FearQuestion.id]: selectedFears });
            goToStep('7'); 
        }
    };

    return (
        <div className={styles['form-step']}>

            <img src="/images/fear.png" alt="Fear Image" className="w-3/5 h-auto mb-4 mx-auto" />
            <div id="step-2-fear-question">
                <div className={styles['form-group']}>
                    <p className={styles['question-text']}>{displayedQuestion}</p>
                    {showContent && (
                        <div style={{ opacity: contentOpacity, transition: 'opacity 1s ease-in-out' }}>
                            <p className={styles['step-text']}>Please select your biggest fear(s).</p>
                            <div className={styles['divider-line']}></div>
                            <div className={styles['gender-options-container']}>
                                {fearOptions.map((option) => (
                                    <div key={option.value} className={styles['button-container']}>
                                        <button
                                            type="button"
                                            className={`${styles['unique-age-button']} ${selectedFears.includes(option.value) ? styles['selected'] : ''}`}
                                            onClick={() => handleFearSelect(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles['start-button-container']}>
                                <button
                                    className={`${styles.startButton} ${selectedFears.length === 0 ? styles['inactive-button'] : ''}`}
                                    onClick={handleContinue}
                                    disabled={selectedFears.length === 0}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <div className={styles['error-message']} style={{ color: 'red' }}>
                    Please select at least one fear before moving to the next step.
                </div>
            )}
        </div>
    );
};

export default Step6five;
