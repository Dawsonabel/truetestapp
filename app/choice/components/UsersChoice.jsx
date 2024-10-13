import { useState, useEffect } from 'react';
import styles from 'app/choice/styles/UsersChoice.module.css';

const UsersChoice = () => {
  const [currentChoice, setCurrentChoice] = useState(null);
  const [key, setKey] = useState(0);
  const [counter, setCounter] = useState(63);  // Initialize with 63

  const generateRandomChoice = () => {
    const amounts = [1, 5, 9, 12.47];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const names = [
      'jon8', 'emmy', 'alyu', 'sebr', 'mich',
      'oliv', 'dani', 'chr1', 'soph', 'will',
      'nata', 'jame', 'eliz', 'benj', 'rach',
      'andr', '1212', 'pf12', 'laur', 'ryla',
      'yuki', 'chen', 'priy', 'sven', 'ines',
      'hiro', 'zhen', 'ad00', 'klar', 'luca'
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name}*****`;
    return { email, amount };
  };

  useEffect(() => {
    const updateChoice = () => {
      const newChoice = generateRandomChoice();
      setCurrentChoice(newChoice);
      setKey(prevKey => prevKey + 1);
      if (newChoice.amount === 12.47) {
        setCounter(prevCounter => prevCounter + 1);
      }
    };

    updateChoice();
    const interval = setInterval(updateChoice, Math.random() * 3000 + 8000);

    return () => clearInterval(interval);
  }, []);

  if (!currentChoice) return null;

  return (
    <div className={styles.outerContainer}>
      <div className={styles.counterContainer}>
        {counter} people chose $12.47 today!
      </div>
      <div className={styles.choiceContainer}>
        <div key={key} className={styles.choiceItem}>
          <p>{currentChoice.email} <span className="font-semibold">just chose ${currentChoice.amount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersChoice;
