const { neon } = require('@neondatabase/serverless');
const Stripe = require('stripe');

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body || '{}');
  } catch (error) {
    throw new Error('Invalid JSON body');
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

  if (!stripeSecret) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  if (!connectionString) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  let payload;
  try {
    payload = parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const reference = (payload.reference || '').trim();
  const amount = Number(payload.amount);

  if (!reference || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'reference and a positive amount are required' });
  }

  const sql = neon(connectionString);
  const stripe = Stripe(stripeSecret);

  let order;
  try {
    const [row] = await sql`
      select id, reference, grand_total, status
      from orders
      where reference = ${reference}
      limit 1;
    `;
    order = row;
  } catch (error) {
    console.error('Failed to fetch order', error);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const origin = req.headers.origin || process.env.VERCEL_URL || 'https://budgetcargo.vercel.app';
  const successUrl = `${origin}/?payment=success&ref=${encodeURIComponent(reference)}`;
  const cancelUrl = `${origin}/?payment=cancel&ref=${encodeURIComponent(reference)}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `BudgetCargo Shipping · ${reference}`,
              description: `Consolidation ID ${reference}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        reference,
        order_id: order.id,
      },
    });

    await sql`
      update orders
      set stripe_session_id = ${session.id},
          updated_at = now()
      where id = ${order.id};
    `;

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed', error);
    return res.status(500).json({ error: 'Failed to create payment session' });
  }
};
