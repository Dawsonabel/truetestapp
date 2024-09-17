import CheckoutForm from 'components/checkout-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'; 

const stripePromise = loadStripe('pk_test_51PnTlpCRGRRpj41jt6hoYVOOw5riyDlKN6tNeMnbfwKXXUb4aYiuxvrsjxn45B7mtV0IXvKj63fWrkKgKSDWXs4700tb7v6mvC');

export default function Page() {
    return (
        <main className="flex flex-col gap-8 sm:gap-16">
            <section className="flex flex-col gap-4">
                <h2>Stripe Checkout Form</h2>
                <Elements stripe={stripePromise}> 
                    <CheckoutForm />
                </Elements>
            </section>
        </main>
    );
}
