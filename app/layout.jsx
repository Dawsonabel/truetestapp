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
                {/* Twitter conversion tracking base code */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
                            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                            twq('config','osome');

                            // Add event listener for when the script is loaded
                            window.addEventListener('load', function() {
                                console.log('Window loaded, checking for twq');
                                if (window.twq && window.location.pathname === '/onboard') {
                                    console.log('Firing Twitter conversion event');
                                    window.twq('event', 'tw-osome-osomf', {
                                        value: 0,
                                        currency: 'USD',
                                        email_address: ''
                                    });
                                }
                            });
                        `
                    }}
                />
                {/* End Twitter conversion tracking base code */}
                
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
