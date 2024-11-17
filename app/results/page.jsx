'use client';

import { useState, useEffect } from 'react';
import styles from 'app/results/styles/results.module.css';
import { useRouter } from 'next/navigation';

const ResultsPage = () => {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-results', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load your results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <svg viewBox="0 0 50 50" className={styles.spinner}>
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.glassCard}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <svg
          className={styles.icon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            fill="rgba(255, 147, 182, 1)"
          />
        </svg>
        <h1 className={styles.title}>Your Personality Report</h1>
      </div>

      <div className={styles.resultsCard}>
        <h2 className={styles.subtitle}>Enneagram Type {results?.enneagramType}</h2>
        <div className={styles.descriptionCard}>
          <h3>Core Characteristics</h3>
          <p>{results?.description}</p>
        </div>

        <div className={styles.strengthsCard}>
          <h3>Key Strengths</h3>
          <ul>
            {results?.strengths?.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className={styles.growthCard}>
          <h3>Growth Opportunities</h3>
          <ul>
            {results?.growthAreas?.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
