'use client';

import React from 'react';
import Link from 'next/link';

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using our service, you agree to be bound by these Terms of Service.",
      items: [
        "Please read these terms carefully before using our platform.",
        "If you do not agree with any part of these terms, you may not use our service."
      ]
    },
    {
      title: "2. Use of Service",
      content: "You agree to use our service only for lawful purposes and in accordance with these terms.",
      items: [
        "You must not violate any applicable laws or regulations.",
        "You are responsible for maintaining the confidentiality of your account.",
        "You agree not to share your account credentials with any third party."
      ]
    },
    {
      title: "3. Intellectual Property",
      content: "All content and materials available on our service are protected by intellectual property rights.",
      items: [
        "You may not use, reproduce, or distribute our content without permission.",
        "Any feedback or suggestions you provide become our property."
      ]
    },
    {
      title: "4. Limitation of Liability",
      content: "We strive to provide a reliable service, but we cannot guarantee it will be error-free or uninterrupted.",
      items: [
        "We are not liable for any indirect, incidental, or consequential damages.",
        "Our total liability is limited to the amount you paid for our service."
      ]
    },
    {
      title: "5. Termination",
      content: "We reserve the right to terminate or suspend your account for any reason, without notice.",
      items: [
        "You may terminate your account at any time by contacting us.",
        "Upon termination, your right to use the service will immediately cease."
      ]
    }
  ];

  return (
    <>
      <style jsx>{`
        :global(body) {
          background-color: #FDF0E6;
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(230,116,99)] to-[rgb(230,156,99)] text-center w-full">Terms of Service</h1>
        
        {sections.map((section, index) => (
          <section key={index} className="mb-10 bg-white rounded-lg p-6 shadow-md border border-[rgb(230,116,99)]/20 w-full max-w-[400px]">
            <h2 className="text-2xl font-semibold mb-4 text-[rgb(230,116,99)]">{section.title}</h2>
            <p className="mb-4 text-gray-700">{section.content}</p>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="mr-2 text-[rgb(230,116,99)] text-xl">&#8226;</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-10 text-sm text-gray-500 text-center max-w-[400px]">
          For more information about our services, please refer to our{' '}
          <Link href="/privacy" className="text-[rgb(230,116,99)] hover:text-[rgb(230,156,99)] transition duration-300">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/subscription" className="text-[rgb(230,116,99)] hover:text-[rgb(230,156,99)] transition duration-300">
            Subscription Terms
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default TermsOfService;