'use client';

import React from 'react';
import Link from 'next/link';

const SubscriptionTerms = () => {
  const sections = [
    {
      title: "1. Trial Period and Charges",
      content: "TRAITLY offers various subscription plans, some of which may include a trial period. The specific duration of the trial and subsequent charges may vary based on the offer you select. Generally:",
      items: [
        "Trial periods typically last 7 days, but may vary based on promotional offers.",
        "If you do not cancel at least 24 hours before the trial period ends, you will be automatically charged for the subscription.",
        "Initial charges after the trial period may be discounted (e.g., $19 for the first month), followed by the regular subscription fee thereafter.",
        "Regular subscription fees are typically $40 per month but may vary based on the specific plan or promotional offer."
      ]
    },
    {
      title: "2. Billing Cycle",
      content: "Unless otherwise specified in your chosen offer:",
      items: [
        "Subscriptions are billed on a monthly basis (every 30 days).",
        "The billing date is based on the date you initially subscribed or when your trial period ended.",
        "Charges will continue automatically until you cancel your subscription."
      ]
    },
    {
      title: "3. Cancellation",
      content: "You may cancel your subscription at any time:",
      items: [
        "To avoid charges, cancel before the end of your trial period (if applicable).",
        "Cancellation can be done through your account settings on the TRAITLY website or app.",
        "Upon cancellation, you will retain access to the service until the end of your current billing period.",
        "No partial refunds are provided for unused portions of a billing period."
      ]
    },
    {
      title: "4. Refunds",
      content: "Our refund policy is as follows:",
      items: [
        "We do not typically offer refunds for subscription fees already paid.",
        "In exceptional circumstances, refunds may be considered on a case-by-case basis.",
        "To request a refund, please contact our customer support team."
      ]
    },
    {
      title: "5. Changes to Subscription",
      content: "TRAITLY reserves the right to:",
      items: [
        "Modify subscription fees with advance notice to subscribers.",
        "Change, add, or remove features from the service.",
        "Offer new subscription plans or promotional rates."
      ]
    },
    {
      title: "6. Payment Processing",
      content: "Please note:",
      items: [
        'Charges will appear on your statement as "traitly.me".',
        "We use secure, third-party payment processors to handle all transactions.",
        "It is your responsibility to ensure your payment method is valid and up to date."
      ]
    },
    {
      title: "7. Cancel Your Subscription",
      content: "To cancel your subscription, please follow these steps:",
      items: [
        "Log in to your TRAITLY account on our website or app.",
        "Navigate to 'Settings' in your account menu.",
        "Select 'Account', then 'Billing'.",
        "Click on 'Cancel Subscription'.",
        "Follow the on-screen prompts to confirm your cancellation.",
        "Enter your email address to finalize the cancellation process.",
        "You will receive a confirmation email once your cancellation is complete.",
        "Remember, you'll retain access to TRAITLY services until the end of your current billing period."
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
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(230,116,99)] to-[rgb(230,156,99)] text-center w-full">Subscription Terms</h1>
        
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
          <Link href="/privacy" className="text-[rgb(230,116,99)] hover:text-[rgb(230,156,99)] transition duration-300">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default SubscriptionTerms;
