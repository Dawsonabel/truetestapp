const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('Users');
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decodedToken.userId) 
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    if (user.subscriptionStatus === 'trial') {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decodedToken.userId) },
        { $set: { subscriptionStatus: 'cancelled' } }
      );

      await client.close();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Trial cancelled successfully',
        }),
      };
    }

    if (!user.stripeCustomerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No subscription found' }),
      };
    }

    const customer = await stripe.customers.retrieve(user.stripeCustomerId, {
      expand: ['subscriptions.data'],
    });

    const subscription = customer.subscriptions?.data?.[0];

    if (!subscription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No active subscription found' }),
      };
    }

    const canceledSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        cancel_at_period_end: true,
      }
    );

    await db.collection('users').updateOne(
      { _id: new ObjectId(decodedToken.userId) },
      { $set: { subscriptionStatus: 'canceling' } }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscription cancelled successfully',
        subscription: canceledSubscription,
      }),
    };
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error cancelling subscription' }),
    };
  }
};