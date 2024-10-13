import React from 'react';
import styles from 'styles/button.module.css';  // Import the CSS module

const Button = ({ children, onClick, disabled }) => {
    return (
        <button 
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
