const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const JournalEntrySchema = new mongoose.Schema({
  userId: String,
  type: String,
  responses: mongoose.Schema.Types.Mixed,
  dateTime: { type: Date, default: Date.now }
});

const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const token = event.headers.authorization?.split(' ')[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    if (event.httpMethod === 'GET') {
      const entries = await JournalEntry.find({ userId }).sort({ dateTime: -1 });
      return { 
        statusCode: 200, 
        body: JSON.stringify(entries, (key, value) => {
          if (key === 'dateTime' && value instanceof Date) {
            return value.toISOString();
          }
          return value;
        })
      };
    } else if (event.httpMethod === 'POST') {
      const { type, responses, dateTime } = JSON.parse(event.body);
      const entryDate = new Date(dateTime);

      // For 'Goal' entry types, check for existing entry and update or create
      if (['gratitude', 'anxiety', 'worry'].includes(type)) {
        const startOfDay = new Date(entryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(entryDate.setHours(23, 59, 59, 999));

        const existingEntry = await JournalEntry.findOne({
          userId,
          type,
          dateTime: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingEntry) {
          existingEntry.responses = responses;
          existingEntry.dateTime = entryDate;
          const updatedEntry = await existingEntry.save();
          return { 
            statusCode: 200, 
            body: JSON.stringify(updatedEntry, (key, value) => {
              if (key === 'dateTime' && value instanceof Date) {
                return value.toISOString();
              }
              return value;
            })
          };
        }
      }

      // For mood entries or if no existing 'Goal' entry was found, create a new one
      const newEntry = new JournalEntry({ userId, type, responses, dateTime: entryDate });
      const savedEntry = await newEntry.save();
      return { 
        statusCode: 201, 
        body: JSON.stringify(savedEntry, (key, value) => {
          if (key === 'dateTime' && value instanceof Date) {
            return value.toISOString();
          }
          return value;
        })
      };
    }

    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
