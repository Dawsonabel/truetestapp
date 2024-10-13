import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/step4.module.css';
import Celebrate from 'components/SVGs/celebrate';
import celebrateStyles from 'styles/celebrate.module.css';

const Step4Process = ({ goToStep }) => {
  const router = useRouter();

  const handleClick = () => {
    goToStep('5');
  };

  return (
    <div className={styles['form-step']}>
      <div className={celebrateStyles['celebrate-container']}>
        <Celebrate />
      </div>
      <h1 className={styles['encouragement-title']}>Great job so far!</h1>
      <p className={styles['encouragement-subtitle']}>
        Your input is bringing your personal wellness plan to life.
      </p>
      <div className={styles['start-button-container']}>
        <button className={styles.startButton} onClick={handleClick}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step4Process;
