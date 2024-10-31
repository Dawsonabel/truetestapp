export default async function handler(request, context) {
  // Common headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Handle GET - API health check
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  // Handle POST - Chat completion
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      
      // Use the prepared messages that include the system context
      const messages = Array.isArray(body.messages) ? body.messages : [];
      
      // Log the messages for debugging
      console.log('Sending messages to OpenAI:', messages);

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY_MAIN')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          stream: true,
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      // Set up streaming response
      return new Response(openaiResponse.body, {
        headers: {
          ...headers,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });

    } catch (error) {
      console.error('Chat function error:', error);
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle any other HTTP method
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}