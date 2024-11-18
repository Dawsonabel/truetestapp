const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, password, recaptchaToken } = JSON.parse(event.body);

  if (!email || !password || !recaptchaToken) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ message: 'Email, password, and security token are required' }) 
    };
  }

  try {
    const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: recaptchaToken
    });

    const recaptchaResponse = await axios.post(verifyURL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!recaptchaResponse.data.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Security verification failed',
          details: recaptchaResponse.data['error-codes']
        })
      };
    }

    if (recaptchaResponse.data.score < 0.3) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Security verification failed',
          details: 'Risk score too low'
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        message: 'Security verification failed',
        details: error.message
      })
    };
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('Users');
    const usersCollection = db.collection('users');

    // Find the user
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid email or password' }) };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid email or password' }) };
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        token,
        userId: user._id,
        email: user.email,
        name: user.name,
      }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Internal server error' }) 
    };
  } finally {
    await client.close();
  }
};