'use client';

import HamburgerMenu from 'components/internalHamburger.jsx';
import '../styles/globals.css'; // Make sure this path is correct for your global styles
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const noLayoutPaths = ['/offer', '/payment', '/hello', '/onboard', '/affirmations', '/reset-password'];

    const isNoLayoutPage = noLayoutPaths.includes(pathname);

    // Add Meta Pixel initialization
    useEffect(() => {
        if (pathname === '/onboard') {
            // Initialize Meta Pixel
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            // Initialize with your Pixel ID
            fbq('init', '1275237860486156');
            
            // Track PageView and Purchase event
            fbq('track', 'PageView');
            fbq('track', 'Purchase');
        }
    }, [pathname]);

    return (
        <html lang="en">
            <head>
                {pathname === '/onboard' && (
                    <noscript>
                        <img height="1" width="1" style={{ display: 'none' }}
                            src="https://www.facebook.com/tr?id=1275237860486156&ev=PageView&noscript=1"
                        />
                    </noscript>
                )}
            </head>
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
