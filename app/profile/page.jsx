"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from 'components/LogoutButton.jsx';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('Profile component mounted');
    fetchUserData();

    return () => {
      console.log('Profile component will unmount');
    };
  }, []);

  const fetchUserData = async () => {
    console.log('fetchUserData called');
    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage:', token);
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      console.log('Fetching user data...');
      const response = await fetch('/.netlify/functions/user-profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data);
        setUserData(data);
        setName(data.name || '');
        setNewsletter(data.newsletter || false);
      } else {
        console.error('Failed to fetch user data:', response.status);
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to update name
    console.log('Saving name:', name);
    setUserData(prev => ({ ...prev, name }));
  };

  const handlePasscodeSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to set passcode
    console.log('Saving passcode:', passcode);
    setPasscode('');
  };

  const handleNewsletterToggle = async () => {
    // TODO: Implement API call to update newsletter preference
    const newValue = !newsletter;
    console.log('Toggling newsletter subscription:', newValue);
    setNewsletter(newValue);
    setUserData(prev => ({ ...prev, newsletter: newValue }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Profile</h1>

      {/* User Info Section */}
      <section className="bg-white bg-opacity-10 rounded-lg p-6 mb-8 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">User Info</h2>
        {userData?.name ? (
          <p className="mb-2">Name: {userData.name}</p>
        ) : (
          <form onSubmit={handleNameSubmit} className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-transparent border border-white rounded px-3 py-2 mr-2 text-white placeholder-gray-300"
            />
            <button type="submit" className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-opacity-90 transition">
              Save Name
            </button>
          </form>
        )}
        <p className="mb-2">Email: {userData?.email || 'No email available'}</p>
        <p className="mb-2">Account Created: {formatDate(userData?.createdAt)}</p>
        <LogoutButton className="mt-4 bg-red-500 hover:bg-red-600" />
      </section>

      {/* Reports Section */}
      <section className="bg-white bg-opacity-10 rounded-lg p-6 mb-8 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">Reports</h2>
        <p className="mb-2">Personality: {userData?.personalityReport || 'No personality report available'}</p>
        <p className="mb-2">Compatibility: {userData?.compatibilityReport || 'No compatibility report available'}</p>
        <p className="mb-2">Login Streak: {userData?.loginStreak || 0} days</p>
      </section>

      {/* Settings Section */}
      <section className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <form onSubmit={handlePasscodeSubmit} className="mb-4">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Create a passcode"
            className="bg-transparent border border-white rounded px-3 py-2 mr-2 text-white placeholder-gray-300"
          />
          <button type="submit" className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-opacity-90 transition">
            Set Passcode
          </button>
        </form>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="newsletter"
            checked={newsletter}
            onChange={handleNewsletterToggle}
            className="mr-2"
          />
          <label htmlFor="newsletter">Receive Newsletter</label>
        </div>
        <button className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-opacity-90 transition mr-2">
          Provide Feedback
        </button>
        <button className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-opacity-90 transition">
          Billing
        </button>
      </section>
    </div>
  );
}
