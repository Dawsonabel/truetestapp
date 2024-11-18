"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const InternalHamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Add this useEffect hook
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuVariants = {
    closed: { y: '-100%' },
    open: { y: 0 },
  };

  const navItems = [
    { 
      name: 'Home', 
      description: 'Dashboard',
      activeColor: '#4CAF50', // Soft green
      activeClass: 'bg-green-100 text-green-600 stroke-green-600',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
        />
      ),
      path: '/' 
    },
    { 
      name: 'Journal', 
      description: 'Your entries',
      activeColor: '#FF9800', // Soft orange
      activeClass: 'bg-orange-100 text-orange-600 stroke-orange-600',
      icon: (
        <>
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </>
      ),
      path: '/journal'
    },
    { 
      name: 'Profile', 
      description: 'Your info',
      activeColor: '#9C27B0', // Soft purple
      activeClass: 'bg-purple-100 text-purple-600 stroke-purple-600',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
        />
      ),
      path: '/profile' 
    },
    { 
      name: 'Manifest', 
      description: 'Your goals',
      activeColor: '#E91E63', // Soft pink
      activeClass: 'bg-pink-100 text-pink-600 stroke-pink-600',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" 
        />
      ),
      path: '/manifest' 
    },
    { 
      name: 'Chat', 
      description: 'AI Assistant',
      activeColor: '#7081e6', // Blue
      activeClass: 'bg-[#7081e6] bg-opacity-10 text-[#7081e6] stroke-[#7081e6]',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
        />
      ),
      path: '/chat' 
    },
  ];

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] z-50">
      <button
        onClick={toggleMenu}
        className="absolute top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md flex items-center justify-center"
        style={{ width: '48px', height: '48px' }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <motion.nav
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 bg-white shadow-md rounded-b-lg z-40"
        style={{ height: '80px', maxWidth: '500px' }}
      >
        <div className="flex h-full">
          <div className="w-16"></div>
          
          <ul className="flex flex-row items-stretch justify-around h-full flex-grow px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name} className="flex-1 flex items-center px-1">
                  <Link
                    href={item.path}
                    className={`flex flex-col items-center justify-center w-full h-16 rounded-lg transition-colors no-underline
                      ${isActive ? item.activeClass : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden mb-0.5 flex items-center justify-center">
                      <svg
                        className={`w-6 h-6 ${isActive ? '' : 'stroke-gray-500'}`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        {typeof item.icon === 'string' ? <path d={item.icon} /> : item.icon}
                      </svg>
                    </div>
                    <span className={`text-sm font-semibold text-center truncate w-full px-1 -mt-1`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.nav>
    </div>
  );
};

export default InternalHamburger;
