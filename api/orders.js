const { neon } = require('@neondatabase/serverless');

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'description', 'weight', 'delivery'];
const MAX_LIMIT = 200;
const STATUS_VALUES = new Set(['queued', 'processing', 'awaiting_pickup', 'completed', 'cancelled']);
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;
const TWILIO_WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO;

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body || '{}');
  } catch (error) {
    throw new Error('Invalid JSON body');
  }
}

function computeRate(weight) {
  if (weight <= 5) return { label: '0 – 5kg flat rate', cost: 45 };
  if (weight <= 10) return { label: '5 – 10kg flat rate', cost: 82 };
  if (weight <= 20) return { label: '10 – 20kg band', cost: weight * 8.3 };
  return { label: '20kg+ economy rate', cost: weight * 7.5 };
}

function formatDelivery(option) {
  switch (option) {
    case 'home':
      return 'Premium home delivery';
    case 'blantyre':
      return 'Blantyre partner depot';
    default:
      return 'Lilongwe HQ pickup';
  }
}

function buildTimeline(reference) {
  return [
    {
      event: 'order_received',
      note: 'Automation triggered via web form',
      reference,
      timestamp: new Date().toISOString(),
    },
  ];
}

function validatePayload(payload) {
  const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
  if (missing.length) {
    const err = new Error(`Missing required fields: ${missing.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const weight = Number.parseFloat(payload.weight);
  if (Number.isNaN(weight) || weight <= 0) {
    const err = new Error('Weight must be a positive number');
    err.statusCode = 400;
    throw err;
  }

  return {
    ...payload,
    weight,
    priority: Boolean(payload.priority),
    insurance: Boolean(payload.insurance),
  };
}

module.exports = async function handler(req, res) {
  const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'Database connection string not configured' });
  }

  const sql = neon(connectionString);

  if (req.method === 'POST') {
    return handlePost(req, res, sql);
  }

  if (req.method === 'GET') {
    return handleGet(req, res, sql);
  }

  if (req.method === 'PATCH') {
    return handlePatch(req, res, sql);
  }

  res.setHeader('Allow', 'POST, GET, PATCH');
  return res.status(405).json({ error: 'Method Not Allowed' });
};

async function handleGet(req, res, sql) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const params = getQueryParams(req);
  const limitParam = parseInt(params.get('limit') || '50', 10);
  const limit = Number.isNaN(limitParam)
    ? 50
    : Math.min(Math.max(limitParam, 1), MAX_LIMIT);
  const statusFilter = params.get('status');

  try {
    let rows;
    if (statusFilter) {
      rows = await sql`
        select id, reference, customer_name, email, phone, weight_kg, delivery_option,
               base_rate_label, base_rate_amount, add_on_total, grand_total, status,
               timeline, created_at
        from orders
        where status = ${statusFilter}
        order by created_at desc
        limit ${limit};
      `;
    } else {
      rows = await sql`
        select id, reference, customer_name, email, phone, weight_kg, delivery_option,
               base_rate_label, base_rate_amount, add_on_total, grand_total, status,
               timeline, created_at
        from orders
        order by created_at desc
        limit ${limit};
      `;
    }

    return res.status(200).json({
      count: rows.length,
      rows,
      meta: {
        limit,
        status: statusFilter || null,
      },
    });
  } catch (error) {
    console.error('Failed to list orders', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function handlePost(req, res, sql) {
  let payload;
  try {
    payload = validatePayload(parseBody(req));
  } catch (error) {
    const status = error.statusCode || 400;
    return res.status(status).json({ error: error.message });
  }

  const reference = `BC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const base = computeRate(payload.weight);
  let addOnTotal = 0;
  const addOns = [];

  if (payload.priority) {
    addOnTotal += 12;
    addOns.push('Priority flight (+£12)');
  }

  if (payload.insurance) {
    addOnTotal += 6;
    addOns.push('Enhanced insurance (+£6)');
  }

  const grandTotal = base.cost + addOnTotal;
  const timelineJson = JSON.stringify(buildTimeline(reference));

  try {
    const [record] = await sql`
      insert into orders (
        reference,
        customer_name,
        email,
        phone,
        description,
        weight_kg,
        delivery_option,
        priority,
        insurance,
        base_rate_label,
        base_rate_amount,
        add_on_total,
        grand_total,
        status,
        timeline
      ) values (
        ${reference},
        ${payload.name.trim()},
        ${payload.email.trim()},
        ${payload.phone.trim()},
        ${payload.description.trim()},
        ${payload.weight},
        ${payload.delivery},
        ${payload.priority},
        ${payload.insurance},
        ${base.label},
        ${base.cost},
        ${addOnTotal},
        ${grandTotal},
        'queued',
        ${timelineJson}
      )
      returning id, reference, status, created_at;
    `;

    sendTwilioNotification('order_created', {
      reference,
      customer: payload.name,
      email: payload.email,
      status: record.status,
      weight: payload.weight,
    });

    return res.status(201).json({
      reference,
      status: record.status,
      quote: {
        baseLabel: base.label,
        baseAmount: base.cost,
        addOnTotal,
        grandTotal,
      },
      addOns,
      delivery: formatDelivery(payload.delivery),
      createdAt: record.created_at,
      nextSteps: [
        'Check email/WhatsApp for confirmation',
        'Deliver parcels to UK hub address',
        'Pay invoice once final weight is confirmed',
      ],
    });
  } catch (error) {
    console.error('Order intake failed', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}

async function handlePatch(req, res, sql) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let body;
  try {
    body = parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!body?.id || !body?.status) {
    return res.status(400).json({ error: 'id and status are required' });
  }

  if (!STATUS_VALUES.has(body.status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const actor = req.headers['x-admin-actor'] || 'ops-user';
  const timelineEvent = JSON.stringify([
    {
      event: 'status_updated',
      note: `Status set to ${body.status}`,
      actor,
      timestamp: new Date().toISOString(),
    },
  ]);

  try {
    const [row] = await sql`
      update orders
      set status = ${body.status},
          timeline = coalesce(timeline, '[]'::jsonb) || ${timelineEvent}::jsonb,
          updated_at = now()
      where id = ${body.id}
      returning id, reference, status, timeline, updated_at;
    `;

    if (!row) {
      return res.status(404).json({ error: 'Order not found' });
    }

    sendTwilioNotification('status_updated', {
      reference: row.reference,
      status: row.status,
      actor,
      updatedAt: row.updated_at,
    });

    return res.status(200).json({ message: 'Status updated', status: row.status, timeline: row.timeline });
  } catch (error) {
    console.error('Failed to update order status', error);
    return res.status(500).json({ error: 'Failed to update status' });
  }
}

function getQueryParams(req) {
  try {
    const url = new URL(req.url, 'http://localhost');
    return url.searchParams;
  } catch (error) {
    console.warn('Failed to parse query params', error);
    return new URLSearchParams();
  }
}

function isAuthorized(req) {
  const expected = process.env.ADMIN_DASH_TOKEN;
  if (!expected) return true;
  const provided = req.headers['x-admin-token'];
  return Boolean(provided && provided === expected);
}

function sendTwilioNotification(event, payload) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) {
    return;
  }

  const message = buildNotificationMessage(event, payload);
  if (!message) return;

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const body = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: TWILIO_WHATSAPP_TO,
    Body: message,
  });

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  }).catch((error) => {
    console.warn('Twilio notification failed', error);
  });
}

function buildNotificationMessage(event, payload) {
  if (event === 'order_created') {
    return `New order ${payload.reference}\nCustomer: ${payload.customer}\nStatus: ${payload.status}\nWeight: ${payload.weight}kg`;
  }

  if (event === 'status_updated') {
    return `Order ${payload.reference} now ${payload.status}\nUpdated by: ${payload.actor}\nWhen: ${new Date(payload.updatedAt).toLocaleString()}`;
  }

  return null;
}
