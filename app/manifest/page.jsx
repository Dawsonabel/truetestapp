'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import themesData from '../../data/themes.json';
import affirmationsData from '../../data/affirmations.json';
import styles from './styles/affirm.css';
import ThemeModal from './components/themeModal';
import { useRouter } from 'next/navigation';

export default function DailyAffirmations() {
  const router = useRouter();
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShowHint, setShouldShowHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const theme = themesData.themes[themeIndex];
  const affirmations = affirmationsData.affirmations;
    
  const changeTheme = () => setThemeIndex((prevIndex) => (prevIndex + 1) % themesData.themes.length);

  const changeAffirmation = (newDirection) => {
    setDirection(newDirection);
    setAffirmationIndex((prevIndex) => (prevIndex + newDirection + affirmations.length) % affirmations.length);
    setHasInteracted(true);
  };

  const hintTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!hasInteracted) {
      hintTimeoutRef.current = setTimeout(() => {
        setShouldShowHint(true);
      }, 6000);
    }

    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, [hasInteracted, router]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    }
    setShouldShowHint(false);
  };

  const handleAffirmationChange = (newIndex) => {
    handleInteraction();
    setAffirmationIndex(newIndex);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 200;
    if (info.offset.y < -threshold) {
      changeAffirmation(1);
    } else if (info.offset.y > threshold) {
      changeAffirmation(-1);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleThemeSelect = (index) => {
    setThemeIndex(index);
  };

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      y: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <>
      <div className="affirmation-container">
        <div className="affirmation-wrapper" style={{backgroundImage: theme.backgroundStyle.backgroundImage}}>
          <div className="personalized-text">
            <p>Shaped by your intelligence report</p>
          </div>
          <div className="affirmation-content">
            <div className="affirmation-text">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={affirmationIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, info) => {
                    handleInteraction();
                    handleDragEnd(e, info);
                  }}
                  className="affirmation-text-container"
                  dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }}
                >
                  <motion.p 
                    style={theme.textStyle}
                    animate={shouldShowHint ? { y: [0, -20, 0] } : { y: 0 }}
                    transition={shouldShowHint ? { type: 'spring', stiffness: 300, damping: 10 } : {}}
                  >
                    {affirmations[affirmationIndex]}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          <AnimatePresence>
            {shouldShowHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hint-box"
              >
                <p>Swipe up for next phrase</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="bottom-content">
            <div className="action-buttons">
              <div className="button-group">
                <button className="circular-button share-button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  <span className="button-text">Share</span>
                </button>
              </div>
            </div>

            <button onClick={openModal} className="circular-button new-theme-button">
              <svg viewBox="0 0 496 496" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M302.4,211.2c-1.6-6.4-8-11.2-14.4-11.2h-94.4c-6.4,0-11.2,3.2-14.4,9.6c-1.6,6.4-1.6,12.8,3.2,17.6 c4.8,4.8,9.6,11.2,9.6,14.4v220.8c0,17.6,17.6,33.6,36.8,33.6h25.6c19.2,0,32-14.4,32-35.2V241.6c1.6-1.6,6.4-8,11.2-12.8 S304,217.6,302.4,211.2z M256,241.6v220.8c0,1.6,0,1.6,0,1.6h-25.6c-3.2,0-4.8-1.6-4.8-1.6V241.6c0-1.6-1.6-4.8-1.6-8h33.6 C256,235.2,256,238.4,256,241.6z" />
                <path d="M456,78.4h-14.4c-9.6,0-16,6.4-16,16c0,9.6,6.4,16,16,16H456v44.8H256c-9.6,0-16,6.4-16,16c0,9.6,6.4,16,16,16h200 c19.2,0,32-12.8,32-30.4v-46.4C488,91.2,475.2,78.4,456,78.4z" />
                <path d="M256,155.2c-20.8,0-32,19.2-32,38.4v24c0,9.6,6.4,16,16,16c9.6,0,16-8,16-16v-24c0-3.2,1.6-4.8,1.6-6.4 c8-1.6,14.4-8,14.4-16C272,161.6,265.6,155.2,256,155.2z" />
                <path d="M424,0H43.2C24,0,8,16,8,35.2v54.4c0,19.2,16,35.2,35.2,35.2h379.2c19.2,0,35.2-16,36.8-33.6v-56C459.2,16,443.2,0,424,0z M427.2,91.2c0,1.6-1.6,3.2-3.2,3.2H43.2c-1.6,0-3.2-1.6-3.2-3.2v-56c0-1.6,1.6-3.2,3.2-3.2H424c1.6,0,3.2,1.6,3.2,3.2V91.2z" />
              </svg>
              <span className="button-text">Theme</span>
            </button>

            <ThemeModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              onSelectTheme={handleThemeSelect}
            />

            <div className="gradient-overlay"></div>
          </div>
        </div>
      </div>
    </>
  );
}
