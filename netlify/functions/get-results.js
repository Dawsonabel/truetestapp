const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  console.log('Get Results function called');

  try {
    const token = event.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    console.log('Decoded userId:', userId);

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('accounts');
    const collection = db.collection('iq_scores');

    // Find the IQ score document for this user
    const result = await collection.findOne({ userId: userId });
    
    await client.close();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        iqScore: result ? result.iqScore : null
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch results' })
    };
  }
};