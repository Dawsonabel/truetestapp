const jwt = require('jsonwebtoken');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  try {
    const token = authHeader.split(' ')[1];
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const { email: submittedEmail } = JSON.parse(event.body);

    if (email.toLowerCase() === submittedEmail.toLowerCase()) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email verified successfully' }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email verification failed' }),
      };
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};