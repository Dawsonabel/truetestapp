import stripeModule from 'stripe';

// Initialize Stripe with your secret key
const stripe = stripeModule(process.env.STRIPE_SECRET_KEY);

export async function handler(event, context) {
  try {
    const { items } = JSON.parse(event.body);

    const amount = items[0].amount;  // Calculate or retrieve the amount dynamically

    // Create a payment intent with the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}