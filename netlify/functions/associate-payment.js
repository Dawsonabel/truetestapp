const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
  const data = JSON.parse(event.body);

  try {
    const result = await client.query(
      q.Create(
        q.Collection('user_payments'),
        {
          data: {
            userId: data.userId,
            paymentIntentId: data.paymentIntentId,
            amount: data.amount
          }
        }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Payment associated successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to associate payment" })
    };
  }
};