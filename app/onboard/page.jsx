"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from 'app/onboard/styles/onboard.module.css';

let netlifyIdentity;

function OnboardContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [userId, setUserId] = useState(null);

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

      setIsLoading(false);
    };

    initializePage();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!netlifyIdentity) {
      setError('Netlify Identity not initialized');
      return;
    }

    // ... rest of handleSubmit function ...
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
    <div>
      <h1>Create Your Account</h1>
      <p>Payment Intent ID: {paymentIntentId}</p>
      {userId && (
        <p className="text-lg">
          UUID: <span className="font-mono bg-gray-200 p-1 rounded">{userId}</span>
        </p>
      )}
      {/* Your form JSX here */}
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
