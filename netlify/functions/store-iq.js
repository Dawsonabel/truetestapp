const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const token = event.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { iqScore } = JSON.parse(event.body);
    
    console.log('Attempting to store IQ score:', {
      userId,
      iqScore,
      tokenInfo: decoded
    });

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('accounts');
    const collection = db.collection('iq_scores'); // New collection specifically for IQ scores
    
    // Insert or update the IQ score
    const result = await collection.updateOne(
      { userId: userId },
      { 
        $set: { 
          userId: userId,
          iqScore: iqScore,
          updatedAt: new Date()
        }
      },
      { upsert: true } // Create if doesn't exist
    );

    console.log('Update result:', result);

    await client.close();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
    
  } catch (error) {
    console.error('Error in store-iq:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to store IQ score',
        details: error.message 
      })
    };
  }
}; 