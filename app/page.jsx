import React from 'react';
import Link from 'next/link';
import styles from 'styles/home.module.css';

const HomePage = () => {
  return (
    <div className={styles.homeContainer} style={{ maxWidth: '500px' }}>
      <h1 className={styles.homeTitle}>Welcome to Your Personalized Wellness Hub</h1>
      <p className={styles.homeDescription}>
        Explore our decentralized tools for mental health and personal growth
      </p>
      
      <div className={styles.cardContainer}>
        <Link href="/journal" className={styles.card}>
          <h2>Journal</h2>
          <p>Track your mood, practice gratitude, and manage anxiety</p>
        </Link>
        
        <Link href="/manifest" className={styles.card}>
          <h2>Daily Affirmations</h2>
          <p>Personalized affirmations to boost your mindset</p>
        </Link>
        
        <Link href="/chat" className={styles.card}>
          <h2>AI Guide</h2>
          <p>Chat with our AI for guidance and support</p>
        </Link>
      </div>
      
      <footer className={styles.footer}>
        <p>Powered by your personality report for AI insights</p>
      </footer>
    </div>
  );
};

export default HomePage;

