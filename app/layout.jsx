'use client';

import HamburgerMenu from '../components/hamburgerMenu';
import '../styles/globals.css'; // Make sure this path is correct for your global styles
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const noLayoutPaths = ['/offer', '/payment', '/hello', '/onboard'];

    const isNoLayoutPage = noLayoutPaths.includes(pathname);

    return (
        <html lang="en">
            <body>
                {!isNoLayoutPage && <HamburgerMenu />}
                {children}
            </body>
        </html>
    );
}