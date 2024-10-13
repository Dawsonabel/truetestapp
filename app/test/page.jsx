'use client';

import React, { useState, useEffect } from 'react';
import Step1 from './components/Steps/step1';
import Step1Intro from './components/Steps/step1Intro';
import Step2 from './components/Steps/step2';
import Step3 from './components/Steps/step3';
import Step4 from './components/Steps/step4';
import Step4Process from './components/Steps/step4Process';
import Step5 from './components/Steps/step5';
import Step6 from './components/Steps/step6';
import Step6five from './components/Steps/step6.5';
import Step7 from './components/Steps/step7';
import Step2Age from './components/Steps/step2age';
import styles from './styles/oldTest.module.css';

const Test = () => {
  const [currentStep, setCurrentStep] = useState('1');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const handleRouteChange = () => {
      const step = window.location.hash.slice(1) || '1';
      setCurrentStep(step);
    };

    // Set initial step based on hash
    handleRouteChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const goToStep = (step) => {
    window.history.pushState(null, '', `#${step}`);
    setCurrentStep(step);
  };

  const saveAnswers = (stepAnswers) => {
    setAnswers(prev => ({ ...prev, [currentStep]: stepAnswers }));
  };

  const onCompleteTest = (stepAnswers) => {
    saveAnswers(stepAnswers);
    console.log('All answers:', answers);
    // Add logic for completing the test and submitting answers
  };

  const renderStep = () => {
    switch(currentStep) {
      case '1': return <Step1 goToStep={goToStep} saveAnswers={saveAnswers} />;
      case 'step1Intro': return <Step1Intro goToStep={goToStep} />;
      case '2': return <Step2 goToStep={goToStep} saveAnswers={saveAnswers} />;
      case 'step2age': return <Step2Age goToStep={goToStep} saveAnswers={saveAnswers} />;
      case '3': return <Step3 goToStep={goToStep} saveAnswers={saveAnswers} />;
      case 'step4Process': return <Step4Process goToStep={goToStep} />;
      case '4': return <Step4 goToStep={goToStep} saveAnswers={saveAnswers} />;
      case '5': return <Step5 goToStep={goToStep} saveAnswers={saveAnswers} />;
      case '6': return <Step6 goToStep={goToStep} saveAnswers={saveAnswers} />;
      case 'step6five': return <Step6five goToStep={goToStep} saveAnswers={saveAnswers} />;
      case '7': return <Step7 goToStep={goToStep} onComplete={onCompleteTest} />;
      default: return null;
    }
  };

  return (
    <div className={styles['full-page-background']}>
      <div className={styles['page-background']}>
        <div className={styles['test-page-wrapper']}>
          <form className={styles['custom-form']} id="custom-form">
            {renderStep()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Test;
