const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Add rate limiting map (Note: This is memory-based and will reset when function cold starts)
const rateLimiter = new Map();
const RATE_LIMIT_MINUTES = 5;
const MAX_ATTEMPTS = 3;

// Helper function to check rate limit
const checkRateLimit = (email) => {
  const now = Date.now();
  const userAttempts = rateLimiter.get(email) || { count: 0, timestamp: now };

  // Reset count if time window has passed
  if (now - userAttempts.timestamp > RATE_LIMIT_MINUTES * 60 * 1000) {
    userAttempts.count = 0;
    userAttempts.timestamp = now;
  }

  // Check if user has exceeded attempts
  if (userAttempts.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil(
      (RATE_LIMIT_MINUTES * 60 * 1000 - (now - userAttempts.timestamp)) / 1000 / 60
    );
    return {
      limited: true,
      timeLeft,
    };
  }

  // Increment attempt count
  userAttempts.count += 1;
  rateLimiter.set(email, userAttempts);
  return { limited: false };
};

exports.handler = async (event, context) => {
  console.log('All environment variables:', {
    ...process.env,
    SMTP_PASS: process.env.SMTP_PORT ? '[REDACTED]' : 'undefined'
  });

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let client;
  
  try {
    const { email, recaptchaToken } = JSON.parse(event.body);
    console.log('Received request with:', {
      email,
      tokenLength: recaptchaToken ? recaptchaToken.length : 0
    });

    if (!email || !recaptchaToken) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Email and reCAPTCHA token are required' }) 
      };
    }

    // Check rate limit
    const rateLimitCheck = checkRateLimit(email);
    if (rateLimitCheck.limited) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          message: `Too many reset attempts. Please try again in ${rateLimitCheck.timeLeft} minutes.`
        })
      };
    }

    // Verify reCAPTCHA
    try {
      console.log('Verifying reCAPTCHA token...');
      
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

      console.log('reCAPTCHA response data:', JSON.stringify(recaptchaResponse.data, null, 2));

      if (!recaptchaResponse.data.success) {
        console.error('reCAPTCHA verification failed:', recaptchaResponse.data);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            message: 'Security verification failed',
            details: recaptchaResponse.data['error-codes']
          })
        };
      }

      // For v3, check the score
      if (recaptchaResponse.data.score < 0.3) { // Lowered threshold for testing
        console.error('reCAPTCHA score too low:', recaptchaResponse.data.score);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            message: 'Security verification failed',
            details: 'Risk score too low'
          })
        };
      }

    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Security verification failed',
          details: error.message
        })
      };
    }

    // Test if environment variables are available
    console.log('Checking environment variables:');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('SMTP settings exist:', {
      host: !!process.env.SMTP_HOST,
      port: !!process.env.SMTP_PORT,
      user: !!process.env.SMTP_USER,
      pass: !!process.env.SMTP_PASS
    });

    client = new MongoClient(process.env.MONGODB_URI);
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db('Users');
    const usersCollection = db.collection('users');

    console.log('Connected to database:', {
        dbName: db.databaseName,
        collection: usersCollection.collectionName
    });

    // Add a test query to see all users first
    const allUsers = await usersCollection.find({}).toArray();
    console.log('All users in collection:', allUsers.map(u => ({ 
        email: u.email,
        _id: u._id.toString()
    })));

    console.log('Searching for email:', email);
    const user = await usersCollection.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
        return { 
            statusCode: 404, 
            body: JSON.stringify({ message: 'No account found with this email' }) 
        };
    }
    
    console.log('User found, generating reset token...');
    
    // Create reset token
    const resetToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update user with reset token
    console.log('Updating user with reset token...');
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetToken, 
          resetTokenExpires: new Date(Date.now() + 3600000) 
        } 
      }
    );

    // Create transporter for sending emails
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      secure: false
    });
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Add verification step
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('SMTP Verification Error:', error);
      throw new Error('Failed to verify SMTP connection');
    }

    // Create reset URL (replace with your actual frontend URL)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log('Reset email sent successfully');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Password reset email sent'
        // Remove the debug token from production
        // debug: { resetToken } 
      }),
    };

  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Internal server error', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }) 
    };
  } finally {
    if (client) {
      console.log('Closing MongoDB connection...');
      await client.close();
    }
  }
};