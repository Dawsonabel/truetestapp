import React from 'react';
import PropTypes from 'prop-types';
import styles from 'app/choice/styles/choice.module.css';

const AmountButton = ({ amount, selectedAmount, handleAmountSelect }) => (
  <button
    onClick={() => handleAmountSelect(amount.value)}
    className={`${styles.amountButton} ${
      selectedAmount === amount.value ? `${styles.selected} ${styles['selected-gradient']}` : styles.unselected
    } ${amount.value === 12.47 ? styles : ''}`}
  >
    {amount.label}
  </button>
);

AmountButton.propTypes = {
  amount: PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  selectedAmount: PropTypes.number,
  handleAmountSelect: PropTypes.func.isRequired,
};

export default AmountButton;