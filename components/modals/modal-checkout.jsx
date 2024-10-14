"use client"; // Ensure this is a client component since it uses routing

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe to initialize Stripe
import styles from "styles/modal.module.css";
import CheckoutForm from "../stripe/checkoutForm";
import CompletePage from "../stripe/completePage";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51PnTlpCRGRRpj41jt6hoYVOOw5riyDlKN6tNeMnbfwKXXUb4aYiuxvrsjxn45B7mtV0IXvKj63fWrkKgKSDWXs4700tb7v6mvC"
);

const CheckoutModal = ({ onClose, price }) => {
  const router = useRouter(); // Initialize the router for navigation
  const [clientSecret, setClientSecret] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPaymentIntent = async () => {
      if (!clientSecret) {
        setIsLoading(true);
        const items = [{ id: "Full Report", amount: parseFloat(price) * 100 }];
        try {
          const response = await fetch("/.netlify/functions/create-pay-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (!data.clientSecret) {
            throw new Error("No clientSecret received from server");
          }
          if (isMounted) {
            setClientSecret(data.clientSecret);
          }
        } catch (error) {
          console.error("Error fetching payment intent:", error.message);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [price, clientSecret]);

  const handleDiscountRedirect = () => {
    router.push("/offer"); // Redirect to the /offer page
  };

  // New function to handle both close button and overlay clicks
  const handleCloseOrRedirect = (e) => {
    // Only trigger if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      handleDiscountRedirect();
    }
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      borderRadius: '4px',
    },
    rules: {
      '.Input': {
        padding: '16px', // Increase padding here
      },
      '.Tab': {
        border: '1px solid #E0E6EB',
      },
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handlePaymentSuccess = (paymentIntentId) => {
    // Redirect to account creation page with payment info
    router.push(`/onboard?paymentIntentId=${paymentIntentId}&price=${price}`);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleCloseOrRedirect}>
      <div className={`${styles.modalContent} ${styles.reducedPadding}`}>
        <div onClick={handleCloseOrRedirect} className={styles.closeButton}>
          &times;
        </div>
        
        {/* Additional Content Above the Form */}
        <div className={styles.customTextContainer}>
          <h2 className="text-xl font-extrabold text-center mt-8 mb-3">Select a payment method</h2>
          <p className="text-sxsm text-center mb-2">You will be charged only <span className="font-semibold">${price} for your 7-day trial.</span> </p>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            {isComplete ? (
              <CompletePage />
            ) : (
              <CheckoutForm 
                dpmCheckerLink="https://stripe.com/docs/payments/payment-methods/overview"
                onComplete={(paymentIntentId) => {
                  setIsComplete(true);
                  handlePaymentSuccess(paymentIntentId);
                }}
              />
            )}
          </Elements>
        ) : (
          <div>Error loading payment information. Please try again.</div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
