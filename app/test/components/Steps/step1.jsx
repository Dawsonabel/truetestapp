import React, { useState } from 'react';
import styles from '../../styles/step1.module.css'; // Updated import

const step1Questions = [
    { id: 'q1', text: 'What gender do you identify as?', name: 'question1', valuePrefix: 'A' },
];

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
];

const Step1 = ({ saveAnswers, goToStep }) => {
    const [error, setError] = useState(false);
    const [selectedGender, setSelectedGender] = useState(null);

    const handleGenderSelect = (value) => {
        setSelectedGender(value);
        setError(false);
        saveAnswers({ [step1Questions[0].id]: value });
        goToStep('step1Intro');
    };

    return (
        <div className={styles['form-step']}>
            <h2>Step 1</h2>

            <img src="/images/gender.png" alt="Gender Image" className="w-2/4 h-auto mb-4 mx-auto" />
            <div id="step-1-questions">
                <div className={styles['form-group']}>
                    <p className={styles['question-text']}>{step1Questions[0].text}</p>
                    <p className={styles['step-text']}>Please select the option that best describes your gender identity. This helps us create a more accurate report 🙂</p>
                    <div className={styles['divider-line']}></div>
                    <div className={styles['gender-options-container']}>
                        {genderOptions.map((option) => (
                            <div key={option.value} className={styles['button-container']}>
                                <button
                                    className={`${styles['unique-gender-button']} ${styles[`${option.value}-button`]} ${selectedGender === option.value ? styles['selected'] : ''}`}
                                    onClick={() => handleGenderSelect(option.value)}
                                >
                                    {option.label}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        className="text-center text-sm mt-28 underline text-gray-600 mx-auto block"
                        onClick={() => handleGenderSelect(null)}
                    >
                        I&apos;d rather not say (click here)
                    </button>
                </div>
            </div>
            {error && (
                <div className={styles['error-message']} style={{ color: 'red' }}>
                    Please select a gender before moving onto the next step.
                </div>
            )}
        </div>
    );
};

export default Step1;