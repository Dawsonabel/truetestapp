const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  console.log("Creating payment intent...");

  try {
    const { items } = JSON.parse(event.body); // Assuming the items and amounts are passed via POST body
    console.log("Received items:", items);

    // Validate or calculate the total amount here, in this example we assume it's passed correctly
    const amount = items[0].amount; // Example: retrieving the amount for the first item
    const currency = 'usd'; // Set the desired currency

    // Create the payment intent with support for multiple payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Ensure that amount is in the smallest currency unit (e.g., cents for USD)
      currency: currency,
      description: `Purchase of ${items[0].id}`, // Optional: Adding a description for the payment
      payment_method_types: [
        'card',        // Include other payment methods as needed
        'apple_pay',   // Example: add Apple Pay
        'ach_credit_transfer' // Example: add ACH bank transfer (optional)
      ],
    });

    console.log("Payment Intent created:", paymentIntent);

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret, // Send the clientSecret to the frontend
      }),
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
