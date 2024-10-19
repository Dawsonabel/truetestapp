"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from 'app/onboard/styles/onboard.module.css';

function OnboardContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const initializePage = async () => {
      // Update the parameter names to match the URL
      const paymentId = searchParams.get('payment_intent');
      const clientSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');
      
      console.log('Payment Intent ID:', paymentId);
      console.log('Client Secret:', clientSecret);
      console.log('Redirect Status:', redirectStatus);

      setPaymentIntentId(paymentId);

      // Get userId from localStorage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }

      // Initialize Netlify Identity
      try {
        const { default: netlifyIdentity } = await import('netlify-identity-widget');
        netlifyIdentity.init();
      } catch (error) {
        console.error('Failed to initialize Netlify Identity:', error);
      }

      // Remove MongoDB connection attempt
      setIsLoading(false);
    };

    initializePage();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          paymentIntentId,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User created:', data);
        router.push('/dashboard'); // Redirect to dashboard after successful account creation
      } else {
        if (response.status === 400) {
          if (data.message === 'User already exists') {
            setError('An account with this email already exists. Please try logging in.');
          } else {
            setError(data.message || 'Invalid input. Please check your information and try again.');
          }
        } else {
          setError('Failed to create account. Please try again later.');
        }
      } 
    } catch (error) {
      console.error('Error creating account:', error);
      setError('An error occurred while creating your account. Please try again later.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!paymentIntentId) {
    return (
      <div className={styles.errorContainer}>
        <p style={{ color: 'red', fontWeight: 'bold' }}>No payment found</p>
        <p>Debug info:</p>
        <p>Payment Intent ID: {paymentIntentId || 'Not found'}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Your Account</h1>
      <p>Payment Intent ID: {paymentIntentId}</p>
      {userId && (
        <p className="text-lg">
          UUID: <span className="font-mono bg-gray-200 p-1 rounded">{userId}</span>
        </p>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
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
          Create Account
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardContent />
    </Suspense>
  );
}
