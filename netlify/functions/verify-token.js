const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
    }

    const { token } = JSON.parse(event.body);

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Token is required' }),
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      statusCode: 200,
      body: JSON.stringify({ decoded }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: error.message || 'Token verification failed' }),
    };
  }
};