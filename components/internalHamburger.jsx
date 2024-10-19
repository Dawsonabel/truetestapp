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
    { name: 'Home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', path: '/' },
    { 
      name: 'Journal', 
      icon: (
        <>
          <path d="M4 6h8" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 10h16" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 14h16" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 18h16" strokeWidth="2" strokeLinecap="round" />
        </>
      ),
      path: '/journal'
    },
    { name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path: '/profile' },
    { name: 'Manifest', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', path: '/manifest' },
    { name: 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', path: '/chat' },
  ];

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] z-50">
      <button
        onClick={toggleMenu}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md"
        style={{ width: '48px', height: '48px' }}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="black"
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
        className="absolute top-0 left-0 right-0 bg-white rounded-b-lg shadow-lg z-40"
        style={{ height: '80px', maxWidth: '500px' }} // Fixed height
      >
        <div className="flex h-full">
          {/* Spacer for the hamburger close button */}
          <div className="w-16"></div>
          
          {/* Navigation items */}
          <ul className="flex flex-row items-stretch justify-around h-full flex-grow px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name} className="flex-1 flex items-center px-1">
                  <Link
                    href={item.path}
                    className={`text-black transition-colors no-underline flex flex-col items-center justify-center w-full h-16 rounded-lg ${
                      isActive ? 'bg-[#eabcb4] bg-opacity-30 text-[#000]' : ''
                    }`}
                  >
                    <div className="w-6 h-6 mb-1 flex items-center justify-center"> {/* Reduced size */}
                      <svg
                        className={`w-full h-full ${isActive ? 'fill-[#000]' : 'fill-current'}`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="currentColor"
                        fill="none"
                      >
                        {typeof item.icon === 'string' ? <path d={item.icon} /> : item.icon}
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-center truncate w-full px-1">{item.name}</span> {/* Smaller text */}
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
