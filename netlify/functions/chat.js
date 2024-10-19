const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_MAIN,
});

exports.handler = async (event, context) => {
    console.log(`API Key: ${process.env.OPENAI_API_KEY_MAIN}`);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
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
