'use client';

import HamburgerMenu from 'components/internalHamburger.jsx';
import '../styles/globals.css'; // Make sure this path is correct for your global styles
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const noLayoutPaths = ['/offer', '/payment', '/hello', '/onboard', '/affirmations', '/reset-password'];

    const isNoLayoutPage = noLayoutPaths.includes(pathname);

    return (
        <html lang="en">
            <body>
                {!isNoLayoutPage && (
                    <header className="flex justify-between items-center">
                        <div className="ml-auto">
                            <HamburgerMenu />
                        </div>
                    </header>
                )}
                {children}
            </body>
        </html>
    );
}
