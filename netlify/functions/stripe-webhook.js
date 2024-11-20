const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = event.headers['stripe-signature'];

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      webhookSecret
    );

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('Users');
    const users = db.collection('users');

    switch (stripeEvent.type) {
      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object;
        await users.updateOne(
          { stripeCustomerId: subscription.customer },
          { $set: { subscriptionStatus: 'cancelled' } }
        );
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = stripeEvent.data.object;
        await users.updateOne(
          { stripeCustomerId: updatedSubscription.customer },
          { $set: { subscriptionStatus: updatedSubscription.status } }
        );
        break;
    }

    await client.close();
    return { statusCode: 200, body: JSON.stringify({ received: true }) };

  } catch (err) {
    console.error('Webhook Error:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
};