const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  const pricePerItem = 100; // $1 in cents
  return items.length * pricePerItem;
};

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let items;
  try {
    const body = JSON.parse(event.body);
    items = body.items;
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      })
    };
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};