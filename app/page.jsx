'use client';

import React, { useEffect } from 'react';
import styles from '../styles/home.module.css';
import wellnessQuotes from '../data/quotes.json';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const startDate = new Date('2024-01-01').getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysSinceStart = Math.floor((today.getTime() - startDate) / (1000 * 60 * 60 * 24));
  const quoteIndex = daysSinceStart % wellnessQuotes.quotes.length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <svg
          className={styles.lightbulb}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
            fill="rgba(147, 155, 255, 1)"
          />
          <path
            d="M9 21v-1h6v1c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1z"
            fill="rgba(147, 155, 255, 1)"
          />
        </svg>
        <h1 className={styles.title}>Daily Motivation</h1>
      </div>
      <div className={styles.quoteCard}>
        <p className={styles.quote}>
          {wellnessQuotes.quotes[quoteIndex].text}
          <span className={styles.author}>― {wellnessQuotes.quotes[quoteIndex].author}</span>
        </p>
      </div>

      {/* 1. Results Card */}
      <div className={styles.headerContainer2}>
        <svg
          className={styles.lightbulb}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
            fill="rgba(255, 147, 182, 1)"
          />
        </svg>
        <h1 className={styles.titleResults}>Test Results</h1>
      </div>
      <div className={styles.resultsCard}>
        <img 
          src="/images/test.webp"
          alt="Test Results Icon"
          width={120}
          height={120}
          className={styles.resultsImage}
        />
        <p className={styles.testType}>
          IQ & Intelligence Report
        </p>
        <p className={styles.cardSubtext}>
          View your full IQ and intelligence test results
        </p>
        <button 
          className={styles.seeResultsButton}
          onClick={() => router.push('/results')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.buttonIcon}
          >
            <path
              d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
              fill="rgba(73, 72, 84, 0.877)"
            />
          </svg>
          See Results
        </button>
      </div>

      {/* 2. Journal Card */}
      <div className={styles.headerContainer2}>
        <svg
          className={styles.lightbulb}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
            fill="rgba(112, 129, 230, 1)"
          />
          <path
            d="M4 3v18h2V3H4z"
            fill="rgba(112, 129, 230, 1)"
          />
        </svg>
        <h1 className={styles.titleJournal}>Journal</h1>
      </div>
      <div className={styles.journalCard}>
        <img 
          src="/images/journaling.png"
          alt="Journal Icon"
          width={120}
          height={120}
          className={styles.resultsImage}
        />
        <p className={styles.testType}>
          Track Your Mood
        </p>
        <p className={styles.cardSubtext}>
          Record your daily thoughts and emotions to track your mental wellness journey
        </p>
        <button 
          className={`${styles.seeResultsButton} ${styles.journalButton}`}
          onClick={() => router.push('/journal')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              fill="rgba(112, 129, 230, 1)"
            />
            <path
              d="M4 3v18h2V3H4z"
              fill="rgba(112, 129, 230, 1)"
            />
          </svg>
          Write your thoughts
        </button>
      </div>

      {/* 3. AI Guide Card */}
      <div className={styles.headerContainer2}>
        <svg
          className={styles.lightbulb}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
            fill="rgba(67, 186, 141, 1)"
          />
        </svg>
        <h1 className={styles.titleChat}>AI Guide</h1>
      </div>
      <div className={styles.chatCard}>
        <img 
          src="/images/chat.png"
          alt="Chat Icon"
          width={120}
          height={120}
          className={styles.resultsImage}
        />
        <p className={styles.testType}>
          Get Personalized Guidance
        </p>
        <p className={styles.cardSubtext}>
          Connect with our AI guide for personalized wellness advice and support
        </p>
        <button 
          className={`${styles.seeResultsButton} ${styles.chatButton}`}
          onClick={() => router.push('/chat')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
              fill="rgba(67, 186, 141, 1)"
            />
          </svg>
          Chat now
        </button>
      </div>

      {/* 4. Manifest Card */}
      <div className={styles.headerContainer2}>
        <svg
          className={styles.lightbulb}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
            fill="rgba(255, 183, 77, 1)"
          />
        </svg>
        <h1 className={styles.titleManifest}>Manifest</h1>
      </div>
      <div className={styles.manifestCard}>
        <img 
          src="/images/manifest.png"
          alt="Manifest Icon"
          width={120}
          height={120}
          className={styles.resultsImage}
        />
        <p className={styles.testType}>
          Set Your Intentions
        </p>
        <p className={styles.cardSubtext}>
          Create and track your personal goals and manifestations
        </p>
        <button 
          className={`${styles.seeResultsButton} ${styles.manifestButton}`}
          onClick={() => router.push('/manifest')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
              fill="rgba(255, 183, 77, 1)"
            />
          </svg>
          Start Manifesting
        </button>
      </div>
    </div>
  );
};

export default HomePage;

