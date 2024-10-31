const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_MAIN,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    // Create the streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        // Send each chunk with proper JSON formatting and newline
        // Remove the return statement from here!
        console.log(`Sending chunk: ${content}`);
      }
    }

    // Return the complete response after the stream is finished
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      body: `data: ${JSON.stringify({ content: fullResponse })}\n\n`
    };

  } catch (error) {
    console.error('Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'An error occurred', details: error.message }) 
    };
  }
};
