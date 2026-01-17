const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

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

  const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  let payload;
  try {
    payload = parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const email = (payload.email || '').trim().toLowerCase();
  const password = payload.password || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = neon(connectionString);

  try {
    const [account] = await sql`
      select id, email, password_hash, api_token
      from admin_accounts
      where email = ${email}
      limit 1;
    `;

    if (!account) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, account.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ email: account.email, token: account.api_token });
  } catch (error) {
    console.error('Failed to login', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};
