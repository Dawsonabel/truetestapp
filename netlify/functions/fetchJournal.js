const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'GET') {
    try {
      const token = event.headers.authorization?.split(' ')[1];
      if (!token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'No authorization token provided' })
        };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const client = new MongoClient(process.env.MONGODB_URI);
      
      try {
        await client.connect();
        console.log('Connected to MongoDB');

        // Use 'test' database and 'journalentries' collection
        const db = client.db('test');
        const entries = await db.collection('journalentries')
          .find({ userId: userId })
          .sort({ dateTime: -1 })
          .limit(3)
          .toArray();

        console.log(`Found ${entries.length} entries for user ${userId}`);

        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(entries)
        };

      } catch (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      } finally {
        await client.close();
      }

    } catch (error) {
      console.error('Function error:', error);
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Internal server error',
          details: error.message
        })
      };
    }
  }
};

module.exports = { handler };