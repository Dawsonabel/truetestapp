"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';
import BubbleIndicator from "app/payment/components/bubble-indicator.jsx";
import EnneagramSvg from "components/SVGs/enneagram.jsx";
import styles from "app/payment/styles/payment.module.css";
import CheckoutModal from "components/modals/modal-checkout";
import StickyHeader from "components/sticky-header";
import SecureCheckout from "app/payment/components/secure-checkout.jsx";
import Details from "app/payment/components/whatsInside.jsx";
import CardWrapper from "app/payment/components/card-wrapper.jsx";
import Reviews from "app/payment/components/reviews.jsx";
import Graph from "app/payment/components/graph.jsx";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState('1');

  useEffect(() => {
    const storedPrice = localStorage.getItem('selectedPrice');
    if (storedPrice) {
      setPrice(storedPrice);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const secondSectionRef = useRef(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const phrases = [
    "Personality Type",
    "AI Relationship Advice",
    "Compatibility Type",
    "Strengths",
    "Weaknesses",
  ];

  const handleScroll = () => {
    secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleNext = useCallback(() => {
    if (currentPhraseIndex === phrases.length - 1) {
      setCurrentPhraseIndex(0);
    } else {
      setCurrentPhraseIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentPhraseIndex, phrases.length]);

  useEffect(() => {
    const intervalId = setInterval(handleNext, 3000);
    return () => clearInterval(intervalId);
  }, [currentPhraseIndex, handleNext]);

  return (
    <div className={styles.body}>
      <input type="hidden" id="selectedPrice" value={price} />
      <StickyHeader openModal={openModal} />

      <div className="flex flex-col min-h-screen">
        {/* First Section */}
        <div className="w-full flex flex-col items-center justify-between">
          {/* Top content */}
          <div className="w-full flex-grow flex flex-col items-center justify-center pt-1 pb-4">
            <div className={styles["enneagram-container"]}>
              <EnneagramSvg />
            </div>

            <div className="text-center mt-4" style={{ width: "400px", maxWidth: "100%" }}>
              <p className="text-3xl text-black font-extrabold mb-0">Find Out Your <br /></p>
              <div className={styles["fixed-text-container"]}>
                <div className="leading-tight text-center text-3xl font-bold text-mixed-500 mx-0 mb-0">
                  {phrases[currentPhraseIndex]}
                </div>
              </div>

              <BubbleIndicator currentIndex={currentPhraseIndex} totalBubbles={phrases.length} />

              <div className="text-mixed-400 text-sm font-semibold mt-5 mb-0">
                <p>And More!</p>
              </div>
            </div>
          </div>
        </div>

        <CardWrapper price={price} />

        {/* Content below the card */}
        <div className="w-full">
          <SecureCheckout openModal={openModal} />
        </div>
      </div>

      {/* Second Section */}
      <div ref={secondSectionRef} className="w-full bg-white h-screen flex flex-col justify-start items-center">
        <Details />
        <Reviews />
        <Graph />
        <CardWrapper price={price} />

        {/* Content below the card */}
        <div className="w-full">
          <SecureCheckout openModal={openModal} />
        </div>
        <p className="text-center text-sm text-gray-500 py-6">Contact</p>

        </div>

      {isModalOpen && <CheckoutModal onClose={closeModal} price={price} />}
      
    </div>
  );
};

export default HomePage;
