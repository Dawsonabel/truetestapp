"use client";

import { useRouter } from 'next/navigation';

export default function LogoutButton({ className }) {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${className}`}
    >
      Logout
    </button>
  );
}