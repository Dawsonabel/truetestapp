const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let client;
  
  try {
    const { token } = JSON.parse(event.body);

    if (!token) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Token is required' }) 
      };
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('Users');
    const usersCollection = db.collection('users');

    // Find user with valid reset token
    const user = await usersCollection.findOne({
      _id: ObjectId.createFromHexString(decoded.userId),
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Invalid or expired reset token' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Token is valid',
        userId: user._id 
      })
    };

  } catch (error) {
    console.error('Token verification error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Error verifying token',
        error: error.message 
      }) 
    };
  } finally {
    if (client) await client.close();
  }
};