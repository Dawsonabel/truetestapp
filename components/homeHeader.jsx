'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from 'styles/home.module.css';

const HomeHeader = () => {
  const pathname = usePathname();

  const handleClick = (e, linkName) => {
    console.log(`${linkName} clicked`);
    e.stopPropagation();
  };

  return (
    <header className="flex items-center justify-between p-4 pr-20 max-w-[550px] mx-auto w-full">
      <div className="text-xl font-bold">
        TRAITLY
      </div>
      <nav className="flex items-center space-x-6">
        <Link 
          href="/" 
          className={`${styles.navItem} ${styles.homeLink} ${pathname === '/' ? styles.activeNavItem : ''}`}
          onClick={(e) => handleClick(e, 'Home')}
        >
          Home
        </Link>
        <Link 
          href="/test" 
          className={`${styles.navItem} ${pathname === '/test' ? styles.activeNavItem : ''}`}
          onClick={(e) => handleClick(e, 'Test')}
        >
          Test
        </Link>
      </nav>
    </header>
  );
};

export default HomeHeader;
