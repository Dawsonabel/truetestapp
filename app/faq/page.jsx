'use client';

import React from 'react';
import Link from 'next/link';

const FAQPage = () => {
  const sections = [
    {
      title: "Personality Test",
      questions: [
        {
          q: "What happens after I take the test?",
          a: "After completing the test, our AI algorithms analyze your responses to generate a personalized personality profile. This profile includes insights into your personality type, strengths, weaknesses, and compatibility with others."
        },
        {
          q: "When will I receive my results?",
          a: "Your results will be available immediately after completing the test. You can access them anytime by logging into your account."
        },
        {
          q: "Will I have to pay extra for the personality test?",
          a: "No, it's included in your subscription."
        }
      ]
    },
    {
      title: "AI Relationship Advice",
      questions: [
        {
          q: "How does the AI relationship advice work?",
          a: "Our AI uses your personality profile and relationship preferences from your test to provide tailored advice. It considers various factors to offer insights and suggestions for improving your relationships."
        },
        {
          q: "Can I get advice for specific situations?",
          a: "Yes, you can input specific relationship scenarios or questions, and the AI will provide personalized advice based on your personality profile."
        }
      ]
    },
    {
      title: "Usage Limits",
      questions: [
        {
          q: "Are there any limits to using the AI chat feature?",
          a: "Yes, there are usage limits for the AI chat feature. Due to active API costs, each user is allocated a certain number of messages per day or month, depending on their subscription tier. This helps us maintain the quality of our service while keeping it affordable."
        },
        {
          q: "What happens if I reach my usage limit?",
          a: "If you reach your usage limit, you'll be notified within the chat interface. You can wait for your limit to reset (daily or monthly, depending on your plan) or consider upgrading to a higher tier for increased usage."
        },
        {
          q: "Can I purchase additional messages?",
          a: "Yes, we offer the option to purchase additional message packs if you need more than your current plan allows. These can be bought from your account settings page."
        }
      ]
    },
    {
      title: "Subscription Features",
      questions: [
        {
          q: "What's included in the subscription?",
          a: "The subscription includes ongoing access to your personality profile, regular AI-generated relationship advice, compatibility assessments, and exclusive content on personal growth."
        },
        {
          q: "How do I cancel my subscription?",
          a: "You can cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period."
        }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        {
          q: "What if I have trouble accessing my results?",
          a: "If you experience any issues accessing your results or using our platform, please contact our support team at hello@traitly.me. We're here to help!"
        },
        {
          q: "Is my data secure?",
          a: "Yes, we take data security seriously. All your personal information and test results are stored securely."
        }
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
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(230,116,99)] to-[rgb(230,156,99)] text-center w-full">Frequently Asked Questions</h1>
        
        {sections.map((section, index) => (
          <section key={index} className="mb-10 bg-white rounded-lg p-6 shadow-md border border-[rgb(230,116,99)]/20 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-[rgb(230,116,99)]">{section.title}</h2>
            {section.questions.map((item, itemIndex) => (
              <div key={itemIndex} className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </section>
        ))}

        <p className="mt-10 text-sm text-gray-500 text-center w-full">
          For more information about our services, please refer to our{' '}
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

export default FAQPage;
