'use client';

import React from 'react';
import Link from 'next/link';

const MoneyBackPage = () => {
  const sections = [
    {
      title: "Money-Back Guarantee",
      content: [
        <>
          At Traitly, we stand behind our service. If you purchased directly from our website and <u>were presented with a money-back option during checkout</u>, you&apos;re eligible for a refund under the following conditions:
        </>,
        "• Contact our support team within 30 days of your initial purchase",
        "• Provide evidence that you've actively used our service for at least 7 consecutive days within the first 30 days",
        "• Request the refund before your subscription period ends",
        "We'll review your application and notify you of the decision via email."
      ]
    },
    {
      title: "Important Notes",
      content: [
        "Our Money-Back Guarantee is designed to ensure you've given our service a fair try. It does not cover:",
        "• Personal preferences (e.g., disliking the product or unmet expectations)",
        "• Financial misunderstandings (e.g., unexpected charges, trial-to-subscription conversions, or automatic renewals)"
      ]
    },
    {
      title: "General Refund Policy",
      content: [
        "Unless specified otherwise or required by law, fees paid are typically non-refundable and non-exchangeable if the Money-Back Guarantee conditions are not met.",
        "Special note for residents of certain U.S. states: If you reside in California or Connecticut you may be entitled to cancel your purchase within a specified period (often three business days) for a full refund. You must contact support at hello@traitly.com to request a refund.",
        "For EU residents: In accordance with EU consumer protection laws, you have the right to withdraw from the purchase agreement within 14 days without giving any reason. However, this right is waived once you access our digital content, as you consent to immediate service delivery."
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
      <div className="max-w-[400px] mx-auto px-4 py-12 text-gray-800 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(230,116,99)] to-[rgb(230,156,99)] text-center w-full">Money-Back Policy</h1>
        
        {sections.map((section, index) => (
          <section key={index} className="mb-10 bg-white rounded-lg p-6 shadow-md border border-[rgb(230,116,99)]/20 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-[rgb(230,116,99)]">{section.title}</h2>
            {section.content.map((item, itemIndex) => (
              <p key={itemIndex} className="text-gray-600 mb-2">{item}</p>
            ))}
          </section>
        ))}

        <p className="mt-10 text-sm text-gray-500 text-center w-full">
          For more details about our services and policies, please refer to our{' '}
          <Link href="/privacy" className="text-[rgb(230,116,99)] hover:text-[rgb(230,156,99)] transition duration-300">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="text-[rgb(230,116,99)] hover:text-[rgb(230,156,99)] transition duration-300">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default MoneyBackPage;
