const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, password, name, paymentIntentId, userId, quizAnswers } = JSON.parse(event.body);

  if (!email || !password || !name) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('Users');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { statusCode: 400, body: JSON.stringify({ message: 'User already exists' }) };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    let stripeCustomerId;

    if (paymentIntent.customer) {
      // If the PaymentIntent already has a customer, use that
      stripeCustomerId = paymentIntent.customer;
    } else {
      // Create a new Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          userId: userId,
        },
      });
      stripeCustomerId = stripeCustomer.id;
    }

    // Create new user document
    const newUser = {
      email,
      password: hashedPassword,
      name,
      stripeCustomerId,
      paymentIntentId,
      userId,
      quizAnswers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new user
    const result = await usersCollection.insertOne(newUser);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully', userId: result.insertedId }),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Internal server error', 
        error: error.message,
        stack: error.stack
      }) 
    };
  } finally {
    await client.close();
  }
};
