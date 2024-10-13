"use client";

import { useState } from "react";
import styles from 'app/discount/styles/discount.module.css';
import CheckoutModal from "components/modals/modal-checkoutSecret"; // Import the CheckoutModal

export default function SecretDiscountPage() {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleStartTrial = () => {
    // Open the Checkout Modal instead of navigating away
    setIsCheckoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCheckoutModalOpen(false);
  };

  return (
    <>
      <div className={styles.discountOverlay}>
        <div className={styles.customDiscountContent}>
          <h2 className={styles.sdu}>
            Secret Discount Unlocked!
          </h2>
          <div className={styles.customDiscountCard}>
            <p className="text-center text-2xl text-black font-semibold">
              Your secret discount 👇
            </p>
            <p className="text-center text-md text-gray-500 mb-7">
              7-Day Trial. Cancel Anytime.
            </p>
            <div className={styles.discountRow}>
              <div className={styles.appliedRow}>
                <p className="font-bold text-md text-white">
                  😌&nbsp;&nbsp;Discount applied!
                </p>
                <div className={styles.discountText}>
                  <span className={styles.original}>-33%</span>
                  <span className={styles.new}>-67%</span>
                </div>
              </div>
            </div>
            <div className={styles.discountRow}>
              <span className="text-black text-sm">
                Your cost for 1 month after trial:
              </span>
              <div className={styles.discountText}>
                <span className={styles.originalPrice}>$60</span>
                <span className={styles.newPrice}>$19</span>
              </div>
            </div>
            <p className="text-sm text-black italic">Big Savings!</p>
            <div className="w-full h-[1px] bg-mixed-600 my-4"></div>
            <div className={styles.discountRow}>
              <span className="text-black font-bold">New Total Today:</span>
              <span className="text-mixed-100 font-extrabold text-xl mr-1">$1</span>
            </div>
          </div>
          <button className={styles.trialButton} onClick={handleStartTrial}>
            Start 7-Day Trial Now
          </button>
          <div className={styles.noticeText}>
            <p className="text-gray-600 mt-6 text-sm text-center">
              By proceeding, you acknowledge that unless canceled before the
              7-day trial ends, a $19 charge will be applied for the first 30
              days, followed by the regular $40 fee every 30 days thereafter
              until cancellation via settings. For more details on cancellation
              and refund policies, visit our{" "}
              <a href="/subscription" className="underline">
                Subscription Terms.
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal onClose={handleCloseModal} />
      )}
    </>
  );
}
