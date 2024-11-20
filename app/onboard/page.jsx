"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from 'app/onboard/styles/onboard.module.css';
import jwt from 'jsonwebtoken';

// Create a wrapper component that uses useSearchParams
function OnboardContentWithParams() {
  const searchParams = useSearchParams();
  return <OnboardContent searchParams={searchParams} />;
}

// Modify OnboardContent to accept searchParams as a prop
function OnboardContent({ searchParams }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [tokenData, setTokenData] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setTokenError('No token provided');
          return;
        }

        const response = await fetch('/.netlify/functions/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Token verification failed');
        }

        setTokenData(data.decoded);
        
        if (data.decoded.answers['16']?.q16) {
          setEmail(data.decoded.answers['16'].q16);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setTokenError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userEmail = tokenData?.answers['16']?.q16 || email;
    const userName = userEmail.split('@')[0];

    if (!userEmail || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Format quiz answers to ensure consistent structure
    const formattedAnswers = {};
    if (tokenData?.answers) {
      Object.entries(tokenData.answers).forEach(([key, value]) => {
        // Handle both formats (question-X and qX)
        if (typeof value === 'object') {
          formattedAnswers[key] = value;
        } else {
          formattedAnswers[key] = { [`question-${key}`]: value };
        }
      });
    }

    // Create the payload with formatted answers
    const payload = {
      email: userEmail.trim(),
      password: password.trim(),
      name: userName,
      paymentIntentId: tokenData?.paymentIntentId,
      userId: tokenData?.enneagramId,
      quizAnswers: formattedAnswers,
      price: tokenData?.price
    };

    try {
      const response = await fetch('/.netlify/functions/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log the full error response
        console.error('Server error details:', data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
    }
  };

  if (isLoading) {
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

  if (tokenError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.glassCard}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className={styles.error}>Invalid or expired token</p>
          <p>{tokenError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.successHeader}>
        <svg className={styles.checkIcon} viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        <h2 className={styles.successText}>Success!</h2>
      </div>
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Complete Your Registration</h1>
        {tokenData?.answers['16']?.q16 && (
          <div className={styles.emailDisplay}>
            <svg className={styles.userIcon} viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <p>{tokenData.answers['16'].q16}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          {!tokenData?.answers['16']?.q16 && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          )}
          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Complete Registration
          </button>
        </form>
        {error && (
          <div className={styles.errorMessage}>
            <svg className={styles.errorIcon} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
      </div>
      <p className={styles.supportNotice}>
        Need to change your email or other issues?<br></br> Please contact support{' '}
        <a href="mailto:hello@traitly.me" className={styles.supportEmail}>
          hello@traitly.me
        </a>
      </p>
    </div>
  );
}

// Update the default export to include Suspense
export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardContentWithParams />
    </Suspense>
  );
}
