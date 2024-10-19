'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const BottomUpMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={toggleMenu} 
        className="fixed bottom-6 right-6 z-[1000] bg-white rounded-full p-3 shadow-lg focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      
      <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-[999] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-lg p-8 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <nav className="flex flex-col space-y-6 items-center">
            <Link href="/dashboard" className="text-black text-2xl font-semibold hover:text-[rgb(230,156,99)] no-underline transition-colors duration-200">Home</Link>
            <Link href="/subscription" className="text-black text-2xl font-semibold hover:text-[rgb(230,156,99)] no-underline transition-colors duration-200">Support</Link>
            <Link href="/account" className="text-black text-2xl font-semibold hover:text-[rgb(230,156,99)] no-underline transition-colors duration-200">Account</Link>
            <Link href="/policies" className="text-black text-2xl font-semibold hover:text-[rgb(230,156,99)] no-underline transition-colors duration-200">Policies</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default BottomUpMenu;