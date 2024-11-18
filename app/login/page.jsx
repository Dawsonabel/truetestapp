"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from 'app/onboard/styles/onboard.module.css'; // Reusing the onboard styles

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp > currentTime) {
            setIsLoggedIn(true);
            setShowModal(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptcha = async () => {
      try {
        // Remove existing script if any
        const existingScript = document.querySelector('script[src*="recaptcha"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Create new script element
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.id = 'recaptcha-script';
        
        // Add error handling
        script.onerror = (error) => {
          console.error('Error loading reCAPTCHA:', error);
        };

        // Wait for script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // Initialize reCAPTCHA
        await new Promise(resolve => window.grecaptcha?.ready(resolve));
        console.log('reCAPTCHA initialized successfully');
      } catch (error) {
        console.error('Failed to load reCAPTCHA:', error);
      }
    };

    loadRecaptcha();

    // Cleanup
    return () => {
      const script = document.getElementById('recaptcha-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const executeRecaptcha = async () => {
    try {
      // Make sure grecaptcha is available
      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA not loaded');
      }

      // Wait for reCAPTCHA to be ready
      await new Promise(resolve => window.grecaptcha.ready(resolve));

      // Execute reCAPTCHA with error handling
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: 'reset_password' }
      );

      if (!token) {
        throw new Error('Failed to generate reCAPTCHA token');
      }

      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      throw new Error('Security verification failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Execute reCAPTCHA before login attempt
      let recaptchaToken;
      try {
        recaptchaToken = await executeRecaptcha();
      } catch (error) {
        console.error('First reCAPTCHA attempt failed, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        recaptchaToken = await executeRecaptcha();
      }

      if (!recaptchaToken) {
        setError('Security verification failed. Please try again.');
        return;
      }

      const response = await fetch('/.netlify/functions/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User logged in:', data);
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.message || 'Failed to log in');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred while logging in. Please try again later.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('Processing...');

    try {
      if (!resetEmail) {
        setResetMessage('Please enter your email');
        return;
      }

      // Execute reCAPTCHA with retry
      let recaptchaToken;
      try {
        recaptchaToken = await executeRecaptcha();
      } catch (error) {
        console.error('First reCAPTCHA attempt failed, retrying...');
        // Wait a moment and retry once
        await new Promise(resolve => setTimeout(resolve, 1000));
        recaptchaToken = await executeRecaptcha();
      }

      if (!recaptchaToken) {
        setResetMessage('Security verification failed. Please try again.');
        return;
      }

      const response = await fetch('/.netlify/functions/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: resetEmail,
          recaptchaToken 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setResetMessage('Password reset instructions sent to your email');
      setResetEmail('');
      setTimeout(() => setShowResetModal(false), 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setResetMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login to Your Account</h1>
      {showModal && (
        <div className={styles.web3Modal}>
          <div className={styles.glassCard} style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <h2 className={styles.title}>You&apos;re already logged in</h2>
            <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Please return to the dashboard.</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => router.push('/')} className={styles.button}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <div className={styles.forgotPassword}>
          <button 
            type="button" 
            onClick={() => setShowResetModal(true)}
            className={styles.forgotPasswordLink}
          >
            Forgot Password?
          </button>
        </div>
        <button type="submit" className={styles.button}>
          Log In
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}

      {showResetModal && (
        <div className={styles.web3Modal}>
          <div className={styles.web3ModalContent}>
            <div className={styles.web3ModalHeader}>
              <h3>Reset Password</h3>
              <button 
                onClick={() => setShowResetModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleResetPassword} className={styles.web3Form}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className={styles.web3Input}
                required
              />
              <button type="submit" className={styles.web3Button}>
                {resetMessage ? 'Sent!' : 'Send Reset Link'}
              </button>
            </form>
            {resetMessage && (
              <p className={`${styles.web3Message} ${
                resetMessage.includes('sent') ? styles.success : styles.error
              }`}>
                {resetMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
