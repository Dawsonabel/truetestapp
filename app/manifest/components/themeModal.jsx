import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import themesData from '../../../data/themes.json';
import styles from '../styles/themeModal.module.css';

const ThemeModal = ({ isOpen, onClose, onSelectTheme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modalContent}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Themes</h2>
              <button onClick={onClose} className={styles.modalCloseButton}>
                Close
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.themeGrid}>
                {themesData.themes.map((theme, index) => (
                  <button
                    key={theme.id}
                    className={styles.themeCard}
                    onClick={() => {
                      onSelectTheme(index);
                      onClose();
                    }}
                    style={{
                      backgroundImage: theme.backgroundStyle.backgroundImage,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <span className={styles.themeText} style={theme.textStyle}>
                      I am 
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeModal;
