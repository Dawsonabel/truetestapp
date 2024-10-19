const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_MAIN,
});

// Define the system message (prompt) for the journal feature
const JOURNAL_PROMPT = `You are an AI assistant specialized in helping users with journaling. 
Your role is to encourage self-reflection, provide thoughtful questions, and offer supportive 
responses to help users express their thoughts and feelings in their journal entries. 
Please be empathetic, non-judgmental, and encourage positive self-reflection.`;

exports.handler = async (event, context) => {
    console.log(`API Key: ${process.env.OPENAI_API_KEY_MAIN}`);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    // Add the journal prompt as the first message if it's not already there
    const fullMessages = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system', content: JOURNAL_PROMPT }, ...messages];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // Updated to a valid model name
      messages: fullMessages,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: completion.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error in chat function:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'An error occurred', details: error.message }) 
    };
  }
};
