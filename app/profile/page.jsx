"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from 'components/LogoutButton.jsx';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [showExitSurvey, setShowExitSurvey] = useState(false);
  const [exitSurveyResponse, setExitSurveyResponse] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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

  const handleNavigation = (path) => {
    if (path === 'billing') {
      setShowBillingModal(true);
    } else {
      window.location.href = `https://traitly.me/${path}`;
    }
  };

  const handleCancelSubscription = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Will show appropriate message for trial or paid subscription
        setShowBillingModal(false);
        // Refresh user data to show updated subscription status
        fetchUserData();
      } else {
        alert(`Failed to cancel subscription: ${data.message}`);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('An error occurred while cancelling your subscription.');
    }
  };

  const verifyEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail }),
      });

      if (response.ok) {
        setEmailError('');
        setShowEmailVerification(true);
      } else {
        setEmailError('Please enter the email associated with your account');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setEmailError('An error occurred while verifying your email');
    }
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
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-start py-8 min-h-screen">
        <div className="w-full max-w-lg px-4">
          <div className="w-full mb-8 flex justify-end items-center">
            <LogoutButton className="mt-4 bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded align-right" />
          </div>

          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* New User Info Container */}
              <div 
                className="bg-white rounded-lg p-4 mb-8 shadow-md w-full max-w-2xl flex items-center justify-between cursor-pointer"
                onClick={() => setShowUserInfoModal(true)}
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                    <img
                      src="/images/emotions/icon.png"
                      alt="User Icon"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#7081e6]">{userData?.name || 'User'}</h2>
                    <p className="text-sm text-gray-500">See your user information</p>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* User Info Modal */}
              {showUserInfoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#7081e6]">User Information</h3>
                      <button
                        onClick={() => setShowUserInfoModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900">{userData?.name || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{userData?.email || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Member Since</label>
                        <p className="text-gray-900">{userData?.createdAt ? formatDate(userData.createdAt) : 'Not available'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowUserInfoModal(false)}
                      className="mt-6 w-full bg-[#7081e6] text-white rounded-lg px-4 py-2 hover:bg-[#5b6bc7] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Reports Section */}
              <section className="bg-white rounded-lg p-2 mb-8 shadow-md w-full max-w-2xl">              
                {/* Personality Report */}
                <div className="bg-white rounded-lg p-1 flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11h2m-1-1v2" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Personality</h3>
                      <p className="text-sm text-gray-500">{userData?.personalityReport || 'No personality report available'}</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Compatibility Report */}
                <div className="bg-white rounded-lg p-1 flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-green-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Compatibility</h3>
                      <p className="text-sm text-gray-500">{userData?.compatibilityReport || 'No compatibility report available'}</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* EIQ Section */}
                <div className="bg-white rounded-lg p-1 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Emotional IQ</h3>
                      <p className="text-sm text-gray-500">{userData?.eiqReport || 'No emotional IQ report available'}</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </section>

              {/* New Information Section */}
              <section className="bg-white rounded-lg p-2 mb-8 shadow-md w-full max-w-2xl">
                {/* FAQ */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('faq')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">FAQ</h3>
                      <p className="text-sm text-gray-500">Frequently asked questions</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Subscription */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('subscription')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Subscription</h3>
                      <p className="text-sm text-gray-500">Read our subscription terms</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Privacy Policy */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('privacy')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-red-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Privacy Policy</h3>
                      <p className="text-sm text-gray-500">Read our privacy policy</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Terms of Service */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('terms')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-green-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Terms of Service</h3>
                      <p className="text-sm text-gray-500">Read our terms of service</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Contact */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('contact')}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
                      <p className="text-sm text-gray-500">Get in touch with us</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </section>

              {/* User Settings Section */}
              <section className="bg-white rounded-lg p-2 mb-8 shadow-md w-full max-w-2xl">
                
                {/* Billing */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('billing')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Billing</h3>
                      <p className="text-sm text-gray-500">Manage your billing information</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Feedback */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => handleNavigation('contact')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Feedback</h3>
                      <p className="text-sm text-gray-500">Help us improve our service</p>
                      <div className="mt-4 flex justify-end">
                        <div className="w-5/6 border-b border-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Newsletter */}
                <div 
                  className="bg-white rounded-lg p-1 flex items-center justify-between cursor-pointer"
                  onClick={() => setShowNewsletterModal(true)}
                >
                  <div className="flex items-center w-full">
                    <div className="w-12 h-12 bg-green-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-700">Newsletter</h3>
                      <p className="text-sm text-gray-500">Manage your newsletter subscription</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 cursor-pointer flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Newsletter Modal */}
                {showNewsletterModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Newsletter Preferences</h3>
                        <button
                          onClick={() => setShowNewsletterModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="checkbox"
                          id="newsletter-checkbox"
                          checked={newsletter}
                          onChange={handleNewsletterToggle}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="newsletter-checkbox" className="text-sm text-gray-700">
                          Receive newsletter updates and important announcements
                        </label>
                      </div>

                      <button
                        onClick={() => setShowNewsletterModal(false)}
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {showBillingModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      {!showCancelConfirmation ? (
                        // Initial view
                        <>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[#7081e6]">Subscription Status</h3>
                            <button
                              onClick={() => {
                                setShowBillingModal(false);
                                setShowCancelConfirmation(false);
                                setShowCancelWarning(false);
                                setShowExitSurvey(false);
                                setExitSurveyResponse('');
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <p className="text-center text-lg mb-6">Your subscription is active. Would you like to update it?</p>
                          
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setShowBillingModal(false)}
                              className="flex-1 bg-[#7081e6] text-white rounded-lg px-4 py-2 hover:bg-[#5b6bc7] transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setShowCancelConfirmation(true)}
                              className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                            >
                              Yes
                            </button>
                          </div>
                        </>
                      ) : !showCancelWarning ? (
                        // Warning view
                        <>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-red-600">Warning</h3>
                            <button
                              onClick={() => {
                                setShowBillingModal(false);
                                setShowCancelConfirmation(false);
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="mb-6">
                            <p className="text-center mb-4">
                              By canceling your subscription, you will immediately lose access to:
                            </p>
                            <ul className="list-disc pl-6 mb-4">
                              <li>Your Traitly.me account</li>
                              <li>Your personality report</li>
                              <li>All premium features</li>
                            </ul>
                            <p className="text-center text-red-600 font-semibold">
                              This action cannot be undone.
                            </p>
                          </div>
                          
                          <div className="flex space-x-4">
                            <button
                              onClick={() => {
                                setShowBillingModal(false);
                                setShowCancelConfirmation(false);
                                setShowCancelWarning(false);
                                setShowExitSurvey(false);
                                setExitSurveyResponse('');
                              }}
                              className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setShowCancelWarning(true)}
                              className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </>
                      ) : !showExitSurvey ? (
                        // Feedback view
                        <>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[#7081e6]">Quick Feedback</h3>
                            <button
                              onClick={() => {
                                setShowBillingModal(false);
                                setShowCancelConfirmation(false);
                                setShowCancelWarning(false);
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Why are you canceling your membership?
                            </label>
                            <textarea
                              value={exitSurveyResponse}
                              onChange={(e) => setExitSurveyResponse(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7081e6]"
                              rows="4"
                            />
                          </div>
                          
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setShowCancelWarning(false)}
                              className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={() => {
                                setShowExitSurvey(true);
                                setShowEmailVerification(false);
                              }}
                              className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      ) : !showEmailVerification ? (
                        // Email Verification step
                        <>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[#7081e6]">Verify Email</h3>
                            <button
                              onClick={() => {
                                setShowBillingModal(false);
                                setShowCancelConfirmation(false);
                                setShowCancelWarning(false);
                                setVerificationEmail('');
                                setEmailError('');
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="mb-6">
                            <p className="text-center mb-4">
                              To confirm cancellation, please enter your account email address:
                            </p>
                            <input
                              type="email"
                              value={verificationEmail}
                              onChange={(e) => setVerificationEmail(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7081e6]"
                              placeholder="Enter your email"
                            />
                            {emailError && (
                              <p className="text-red-500 text-sm mt-2">{emailError}</p>
                            )}
                          </div>
                          
                          <div className="flex space-x-4">
                            <button
                              onClick={() => {
                                setShowExitSurvey(false);
                                setVerificationEmail('');
                                setEmailError('');
                              }}
                              className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={verifyEmail}
                              className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                            >
                              Verify & Continue
                            </button>
                          </div>
                        </>
                      ) : (
                        // Final cancellation view
                        <>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-red-600">Cancel Subscription</h3>
                            <button
                              onClick={() => {
                                setShowBillingModal(false);
                                setShowCancelConfirmation(false);
                                setShowCancelWarning(false);
                                setShowExitSurvey(false);
                                setVerificationEmail('');
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <p className="text-center mb-6">Are you sure you want to cancel your subscription?</p>
                          
                          <div className="flex space-x-4">
                            <button
                              onClick={() => {
                                setVerificationEmail('');
                                setEmailError('');
                              }}
                              className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={handleCancelSubscription}
                              className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                            >
                              Cancel Subscription
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
