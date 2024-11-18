const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let client;
  
  try {
    const { token, newPassword } = JSON.parse(event.body);

    if (!token || !newPassword) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Token and new password are required' }) 
      };
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('Users');
    const usersCollection = db.collection('users');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and remove reset token
    const result = await usersCollection.updateOne(
      {
        _id: ObjectId.createFromHexString(decoded.userId),
        resetToken: token,
        resetTokenExpires: { $gt: new Date() }
      },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" }
      }
    );

    if (result.matchedCount === 0) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Invalid or expired reset token' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password updated successfully' })
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Error updating password' }) 
    };
  } finally {
    if (client) await client.close();
  }
};