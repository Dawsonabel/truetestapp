const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const mongoClient = new MongoClient(process.env.MONGODB_URI);

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  console.log('Received request:', event);

  // Check for Authorization header
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid Authorization header found');
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  const token = authHeader.split(' ')[1];
  console.log('Received token:', token);
  
  const decodedToken = verifyToken(token);
  console.log('Decoded token:', decodedToken);

  if (!decodedToken) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Invalid token' }),
    };
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    const db = mongoClient.db('Users'); // Explicitly specify the 'Users' database
    console.log('Database name:', db.databaseName);

    const usersCollection = db.collection('users');
    console.log('Querying collection:', usersCollection.collectionName);

    console.log('Searching for user with userId:', decodedToken.userId);
    const user = await usersCollection.findOne({ _id: new ObjectId(decodedToken.userId) });
    console.log('Query result:', user);

    if (!user) {
      console.log('User not found in database');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    console.log('User found:', user);

    // Return user data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        stripeCustomerId: user.stripeCustomerId,
        paymentIntentId: user.paymentIntentId,
        userId: user.userId,
      }),
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error fetching user data', error: error.message }),
    };
  } finally {
    console.log('Closing MongoDB connection');
    await mongoClient.close();
  }
};
