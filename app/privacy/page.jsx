'use client';

import React from 'react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect various types of information from our users, including:",
      items: [
        "Personal information such as name, email address, and billing information when you create an account or subscribe to our services.",
        "Usage data such as how you interact with our platform, features you use, and time spent on the site.",
        "Device information including IP address, browser type, and operating system.",
        "Cookies and similar tracking technologies to enhance your experience and analyze our services."
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the collected information for various purposes, including:",
      items: [
        "Providing and maintaining our services.",
        "Improving and personalizing your experience on our platform.",
        "Processing transactions and sending related information.",
        "Sending administrative messages, updates, and promotional content.",
        "Analyzing usage patterns to enhance our service offerings."
      ]
    },
    {
      title: "3. Data Sharing and Disclosure",
      content: "We may share your information in the following circumstances:",
      items: [
        "With third-party service providers who assist us in operating our business.",
        "To comply with legal obligations or respond to lawful requests.",
        "In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.",
        "With your consent or at your direction."
      ]
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your data, including:",
      items: [
        "Encryption of sensitive information during transmission.",
        "Regular security assessments and updates.",
        "Limited access to personal information by our employees on a need-to-know basis.",
        "Continuous monitoring for potential security breaches."
      ]
    },
    {
      title: "5. Your Rights and Choices",
      content: "You have certain rights regarding your personal information:",
      items: [
        "Accessing, correcting, or deleting your personal information.",
        "Opting out of marketing communications.",
        "Requesting a copy of your data or its transfer to another service.",
        "Withdrawing consent where processing is based on consent."
      ]
    },
    {
      title: "6. Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by:",
      items: [
        "Posting the new privacy policy on this page.",
        "Updating the &quot;Last updated&quot; date at the top of this policy.",
        "Sending an email notification for significant changes.",
        "Providing a notice on our main page or within the app."
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
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(230,116,99)] to-[rgb(230,156,99)] text-center w-full">Privacy Policy</h1>
        
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
          <Link href="/terms" className="text-[rgb(230,116,99)] hover:text-[rgb(230,156,99)] transition duration-300">
            Terms of Service
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

export default PrivacyPolicy;
