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

  // Modified reCAPTCHA loading
  useEffect(() => {
    const loadRecaptcha = async () => {
      try {
        if (typeof window === 'undefined') return;

        const existingScript = document.querySelector('script[src*="recaptcha"]');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.id = 'recaptcha-script';
        script.async = true;
        script.defer = true;
        
        script.onerror = (error) => {
          console.error('Error loading reCAPTCHA:', error);
        };

        document.head.appendChild(script);

        await new Promise((resolve) => {
          const checkRecaptcha = () => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              resolve();
            } else {
              setTimeout(checkRecaptcha, 100);
            }
          };
          checkRecaptcha();
        });

        window.grecaptcha.ready(() => {});
      } catch (error) {
        console.error('Failed to load reCAPTCHA:', error);
      }
    };

    loadRecaptcha();

    return () => {
      const script = document.getElementById('recaptcha-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  // Modified executeRecaptcha function
  const executeRecaptcha = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!window.grecaptcha || !window.grecaptcha.execute) {
        console.error('reCAPTCHA not loaded properly');
        return null;
      }

      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: 'login' }
      );

      return token;
    } catch (error) {
      console.error('Detailed reCAPTCHA execution error:', error);
      return null;
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

      const response = await fetch('http://localhost:8888/.netlify/functions/login-user', {
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
                {resetMessage === 'Processing...' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    Processing
                    <div className={styles.loadingSpinner}>
                      <svg className={styles.spinner} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                ) : resetMessage ? (
                  'Sent!'
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
            {resetMessage && resetMessage !== 'Processing...' && (
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
 