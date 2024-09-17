import Link from 'next/link';
import { Card } from 'components/card';
import { RandomQuote } from 'components/random-quote';
import { Markdown } from 'components/markdown';
import { ContextAlert } from 'components/context-alert';
import { getNetlifyContext } from 'utils';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PnTlpCRGRRpj41jt6hoYVOOw5riyDlKN6tNeMnbfwKXXUb4aYiuxvrsjxn45B7mtV0IXvKj63fWrkKgKSDWXs4700tb7v6mvC');

const cards = [];
const ctx = getNetlifyContext();

export default function Page() {
    return (
        <main className="flex flex-col gap-8 sm:gap-16">
            <section className="flex flex-col items-start gap-3 sm:gap-4">
                <ContextAlert />
                <h1 className="mb-0">Netlify Platform Starter - Next.js</h1>
                <p className="text-lg">Get started with Next.js and Netlify in seconds.</p>
                <Link
                    href="https://docs.netlify.com/frameworks/next-js/overview/"
                    className="btn btn-lg btn-primary sm:btn-wide"
                >
                    Read the Docs
                </Link>
            </section>
            {!!ctx && (
                <section className="flex flex-col gap-4">
                    <RuntimeContextCard />
                </section>
            )}
            <section className="flex flex-col gap-4">
                <h2>Stripe Checkout Form</h2>
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </section>
        </main>
    );
}

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Call your Netlify serverless function to get the Payment Intent client secret
        fetch('/.netlify/edge-functions/create-payment-intent.js', {
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

function RuntimeContextCard() {
    const title = `Netlify Context: running in ${ctx} mode.`;
    if (ctx === 'dev') {
        return <Card title={title} text="Next.js will rebuild any page you navigate to, including static pages." />;
    } else {
        return <Card title={title} text="This page was statically-generated at build time." />;
    }
}