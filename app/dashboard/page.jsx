"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from 'components/LogoutButton.jsx';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decode the JWT token
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp > currentTime) {
            setIsLoggedIn(true);
            setUserData(payload);
          } else {
            // Token has expired
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="mb-4">
          {isLoggedIn ? "Logged in" : "Logged out"}
        </p>
        {isLoggedIn && userData && (
          <div className="bg-white p-4 rounded-lg shadow">
            <p>Welcome, {userData.email}!</p>
            <p>User ID: {userData.userId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
