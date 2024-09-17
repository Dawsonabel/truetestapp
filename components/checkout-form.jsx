"use client"; // Only this file needs to be client-side

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PnTlpCRGRRpj41jt6hoYVOOw5riyDlKN6tNeMnbfwKXXUb4aYiuxvrsjxn45B7mtV0IXvKj63fWrkKgKSDWXs4700tb7v6mvC');

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Fetch the Payment Intent client secret
        fetch('/.netlify/edge-functions/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: [{ id: 'xl-tshirt', amount: 1000 }] }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) return;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://trait.netlify.app/revalidation',
            },
        });

        if (result.error) {
            setMessage(result.error.message);
        } else {
            setMessage('Payment successful!');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {clientSecret && (
                <div>
                    <CardElement />
                    <button type="submit" disabled={!stripe || loading}>
                        {loading ? 'Processing...' : 'Pay'}
                    </button>
                </div>
            )}
            {message && <p>{message}</p>}
        </form>
    );
}
