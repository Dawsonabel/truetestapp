const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  console.log('Function started');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
    console.log('Parsed request body:', parsedBody);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return { 
      statusCode: 400, 
      body: JSON.stringify({ message: 'Invalid request body', error: error.message }) 
    };
  }

  const { email, password, name, paymentIntentId, userId, quizAnswers } = parsedBody;

  // Validate required fields
  if (!email || !password || !name) {
    console.error('Missing required fields:', { email: !!email, password: !!password, name: !!name });
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('Users');
    const usersCollection = db.collection('users');

    // Check if user exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { statusCode: 400, body: JSON.stringify({ message: 'User already exists' }) };
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch PaymentIntent
    console.log('Retrieving PaymentIntent:', paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('PaymentIntent retrieved:', { id: paymentIntent.id, status: paymentIntent.status });

    let stripeCustomerId;

    if (paymentIntent.customer) {
      stripeCustomerId = paymentIntent.customer;
      console.log('Using existing Stripe customer:', stripeCustomerId);
    } else {
      console.log('Creating new Stripe customer...');
      const stripeCustomer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: { userId: userId },
      });
      stripeCustomerId = stripeCustomer.id;
      console.log('Created new Stripe customer:', stripeCustomerId);
    }

    // Create new user
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

    console.log('Inserting new user...');
    const result = await usersCollection.insertOne(newUser);
    console.log('User created successfully:', result.insertedId);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully', userId: result.insertedId }),
    };
  } catch (error) {
    console.error('Error creating user:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // More specific error messages based on error type
    if (error.name === 'MongoServerError') {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ message: 'Database error', error: error.message }) 
      };
    } else if (error.type === 'StripeError') {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ message: 'Payment processing error', error: error.message }) 
      };
    }
    
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Internal server error', 
        error: error.message,
        type: error.name
      }) 
    };
  } finally {
    console.log('Closing MongoDB connection');
    await client.close();
  }
};
