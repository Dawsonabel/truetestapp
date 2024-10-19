const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
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
    console.error('Error logging in user:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Internal server error', 
        error: error.message,
      }) 
    };
  } finally {
    await client.close();
  }
};