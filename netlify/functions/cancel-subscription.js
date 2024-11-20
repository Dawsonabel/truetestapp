const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  console.log('Starting cancel-subscription function');
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
    }

    // Validate authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized - Invalid token format' }),
      };
    }

    const token = authHeader.split(' ')[1];
    
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully');
    } catch (error) {
      console.error('Token verification failed:', error);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized - Invalid token' }),
      };
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db('Users');
    
    // Find user
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decodedToken.userId) 
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    console.log('User found, checking subscription status');

    // Handle trial cancellation
    if (user.subscriptionStatus === 'trial') {
      console.log('Cancelling trial subscription');
      await db.collection('users').updateOne(
        { _id: new ObjectId(decodedToken.userId) },
        { $set: { subscriptionStatus: 'cancelled' } }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Trial cancelled successfully',
        }),
      };
    }

    // Validate Stripe customer
    if (!user.stripeCustomerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No subscription found' }),
      };
    }

    // Retrieve Stripe customer
    console.log('Retrieving Stripe customer:', user.stripeCustomerId);
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

    // Cancel subscription
    console.log('Cancelling Stripe subscription:', subscription.id);
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        cancel_at_period_end: true,
      }
    );

    // Update user status
    await db.collection('users').updateOne(
      { _id: new ObjectId(decodedToken.userId) },
      { $set: { subscriptionStatus: 'canceling' } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscription cancelled successfully',
        subscription: canceledSubscription,
      }),
    };
  } catch (error) {
    console.error('Subscription cancellation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Handle specific error types
    if (error.type === 'StripeError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Payment processing error',
          error: error.message 
        }),
      };
    }

    if (error.name === 'MongoServerError') {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Database error',
          error: error.message 
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message
      }),
    };
  } finally {
    // Ensure MongoDB connection is closed
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
};