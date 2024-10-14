"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from 'app/hello/style/hello.module.css';

const phrases = [
  "Welcome to Traitly",
  "We've analyzed your personality test.",
  "Your AI-powered guidance is ready.",
  "This includes your personality report,",
  "and live chat personalized with your answers.",
  "Let's do this."
];

const TYPING_SPEED = 40; // milliseconds per character

const EnneagramSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="58"
    height="58" 
    viewBox="0 0 100 100"
    style={{ fill: 'black', stroke: 'black', strokeWidth: 0.5 }}
  >
    <g transform="scale(1.1) translate(0.5 0.5)">
      <path d="M 81.439 39.689 c -0.102 -0.276 -0.318 -0.493 -0.595 -0.595 L 66.86 33.953 l 2.575 -15.248 c 0.059 -0.352 -0.073 -0.708 -0.348 -0.936 c -0.275 -0.227 -0.648 -0.291 -0.983 -0.169 L 53.41 22.998 l -7.417 -12.779 c -0.179 -0.309 -0.508 -0.498 -0.865 -0.498 c 0 0 -0.001 0 -0.001 0 c -0.357 0 -0.687 0.191 -0.865 0.501 l -7.331 12.726 L 22.384 17.6 c -0.334 -0.124 -0.708 -0.059 -0.983 0.168 c -0.274 0.227 -0.407 0.583 -0.349 0.934 l 2.535 15.253 L 9.155 39.258 c -0.277 0.102 -0.495 0.321 -0.596 0.599 s -0.073 0.585 0.075 0.841 l 9.061 15.644 l -4.014 6.968 c -0.178 0.31 -0.178 0.69 0.001 0.999 c 0.179 0.31 0.509 0.5 0.866 0.5 h 8.051 l 8.671 14.971 c 0.243 0.419 0.75 0.604 1.203 0.44 c 0.455 -0.164 0.728 -0.629 0.648 -1.105 l -2.378 -14.306 H 59.62 l -2.416 14.303 c -0.08 0.479 0.193 0.946 0.65 1.109 c 0.11 0.039 0.224 0.058 0.336 0.058 c 0.352 0 0.688 -0.186 0.869 -0.506 l 8.506 -14.964 h 8.374 c 0.357 0 0.688 -0.191 0.866 -0.501 c 0.179 -0.31 0.178 -0.691 -0.001 -1.001 l -4.236 -7.299 l 8.8 -15.48 C 81.515 40.272 81.54 39.965 81.439 39.689 z M 67.176 20.071 L 64.95 33.25 l -7.106 -2.613 l -3.415 -5.884 L 67.176 20.071 z M 63.69 40.71 l -4.273 -7.363 l 5.194 1.91 L 63.69 40.71 z M 54.905 29.557 l -6.771 -2.49 l 4.39 -1.613 L 54.905 29.557 z M 45.132 12.719 l 6.372 10.979 l -6.269 2.303 l -6.399 -2.353 L 45.132 12.719 z M 42.336 27.066 l -6.937 2.549 l 2.424 -4.208 L 42.336 27.066 z M 23.308 20.07 l 12.611 4.637 l -3.447 5.984 l -6.973 2.562 L 23.308 20.07 z M 25.833 35.261 l 5.082 -1.867 l -4.185 7.264 L 25.833 35.261 z M 10.961 40.725 l 12.96 -4.762 l 1.234 7.427 l -6.308 10.951 L 10.961 40.725 z M 25.673 46.499 l 2.711 16.309 h -4.632 l -3.747 -6.469 L 25.673 46.499 z M 16.278 62.809 l 2.574 -4.469 l 2.588 4.469 H 16.278 z M 30.249 74.025 l -5.338 -9.217 h 3.806 L 30.249 74.025 z M 30.411 62.809 l -3.165 -19.04 l 6.596 -11.45 l 11.393 -4.186 l 11.242 4.134 l 6.692 11.53 l -3.211 19.013 H 30.411 z M 64.74 46.503 l 5.522 9.515 l -3.86 6.791 h -4.416 L 64.74 46.503 z M 60.119 73.861 l 1.529 -9.053 h 3.617 L 60.119 73.861 z M 74.204 62.809 h -5.501 l 2.722 -4.788 L 74.204 62.809 z M 71.407 54.005 l -6.145 -10.588 l 1.26 -7.458 l 12.526 4.605 L 71.407 54.005 z" />
      <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 2 C 21.29 2 2 21.29 2 45 c 0 23.71 19.29 43 43 43 c 23.71 0 43 -19.29 43 -43 C 88 21.29 68.71 2 45 2 z" />
    </g>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedPhrases, setDisplayedPhrases] = useState(['']);
  const [isTyping, setIsTyping] = useState(true);
  const [firstPhraseVisible, setFirstPhraseVisible] = useState(true);
  const [showNextButton, setShowNextButton] = useState(false);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const containerRef = useRef(null);

  const typeWriter = useCallback((text, index) => {
    if (index < text.length) {
      setDisplayedPhrases(prev => {
        const newPhrases = [...prev];
        newPhrases[currentPhraseIndex] = text.substring(0, index + 1);
        return newPhrases;
      });
      setTimeout(() => typeWriter(text, index + 1), TYPING_SPEED);
    } else {
      setIsTyping(false);
      setTimeout(() => {
        if (currentPhraseIndex === 0) {
          setFirstPhraseVisible(false);
          setTimeout(() => {
            setCurrentPhraseIndex(1);
            setDisplayedPhrases(['', '']);
            setIsTyping(true);
          }, 1000);
        } else if (currentPhraseIndex < phrases.length - 1) {
          setCurrentPhraseIndex(prev => prev + 1);
          setDisplayedPhrases(prev => [...prev, '']);
          setIsTyping(true);
        } else {
          setTimeout(() => setShowNextButton(true), 1500);
        }
      }, 1500);
    }
  }, [currentPhraseIndex]);

  useEffect(() => {
    if (isTyping) {
      typeWriter(phrases[currentPhraseIndex], 0);
    }
    // Show gradient after the first phrase
    if (currentPhraseIndex > 0 && !showGradient) {
      setShowGradient(true);
    }
  }, [currentPhraseIndex, isTyping, typeWriter]);

  useEffect(() => {
    if (showNextButton) {
      setTimeout(() => setButtonOpacity(1), 50);
    }
  }, [showNextButton]);

  const handleNextClick = () => {
    router.push('/choice');
  };

  return (
    <>
      <div className={styles.pageBackground}></div>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.centered}>
          <div 
            className={`${styles.svgContainer} ${!firstPhraseVisible ? styles.fadeOut : ''}`}
            style={{
              opacity: firstPhraseVisible ? 1 : 0,
              transition: 'opacity 1s'
            }}
          >
            <EnneagramSvg />
          </div>
          {displayedPhrases.map((phrase, index) => (
            <h1 
              key={index}
              className={`${styles.text} ${index === 0 ? styles.fadeText : ''}`}
              style={{
                textAlign: index === 0 ? 'center' : 'left',
                width: '100%',
                opacity: index === 0 && !firstPhraseVisible ? 0 : 1,
                transition: index === 0 ? 'opacity 1s' : 'none'
              }}
            >
              {phrase}
            </h1>
          ))}
        </div>
        {showNextButton && (
          <button 
            className={styles.ctaButton} 
            onClick={handleNextClick}
            style={{ opacity: buttonOpacity }}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}
