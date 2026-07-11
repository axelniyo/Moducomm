const Stripe  = require('stripe');
const Payment = require('./Payment.model');

const stripe = Stripe(process.env.STRIPE_API_KEY);

/**
 * POST /api/payment/create-intent
 * Body: { amount, currency? }
 * Creates a Stripe PaymentIntent and returns the client_secret to the frontend.
 */
async function createPaymentIntent(req, res) {
  const { amount, currency = 'usd' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'A valid amount is required.' });
  }

  try {
    // amount must be in smallest currency unit (cents)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    // Record payment attempt in DB
    await Payment.create({
      userId:                 req.user.id,
      amount,
      currency:               currency.toLowerCase(),
      status:                 'PENDING',
      stripePaymentIntentId:  paymentIntent.id,
      provider:               'STRIPE',
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('createPaymentIntent error:', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/payment/history — return all payment records for the current user
 */
async function getPaymentHistory(req, res) {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPaymentIntent, getPaymentHistory };
