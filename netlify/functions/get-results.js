const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'No token provided' })
    };
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('Users');
    console.log('Available collections:', await db.listCollections().toArray());

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) }
    );

    console.log('Looking for user with ID:', decoded.userId);
    console.log('Found user:', user);

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'No quiz answers found' })
      };
    }

    const response = {
      rawAnswers: user.quizAnswers || [],
      email: user.email,
      debug: {
        totalQuestions: user.quizAnswers ? user.quizAnswers.length : 0,
        userId: user._id,
        timestamp: new Date().toISOString()
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        userId: decoded?.userId 
      })
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
};

// Your existing calculation functions
function calculateEnneagramType(answers) {
  // Your calculation logic
  return "1";
}

function getTypeDescription(answers) {
  // Your description logic
  return "Description";
}

function getStrengths(answers) {
  // Your strengths logic
  return ["Strength 1", "Strength 2"];
}

function getGrowthAreas(answers) {
  // Your growth areas logic
  return ["Growth Area 1", "Growth Area 2"];
}