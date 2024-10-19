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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>You&apos;re already logged in</h2>
            <p>Please return to the dashboard.</p>
            <button onClick={() => router.push('/')} className={styles.button}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
      <h1 className={styles.title}>Login to Your Account</h1>
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
        <button type="submit" className={styles.button}>
          Log In
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
