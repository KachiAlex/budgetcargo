const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  const registrationCode = process.env.REGISTRATION_CODE;
  if (!connectionString || !registrationCode) {
    return res.status(500).json({ error: 'Server not configured for registration' });
  }

  let payload;
  try {
    payload = parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const email = (payload.email || '').trim().toLowerCase();
  const password = payload.password || '';
  const confirm = payload.confirm || '';
  const code = (payload.registrationCode || '').trim();

  if (!email || !password || !confirm || !code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password !== confirm) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (code !== registrationCode) {
    return res.status(401).json({ error: 'Invalid registration code' });
  }

  const sql = neon(connectionString);

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const apiToken = crypto.randomBytes(32).toString('base64url');

    const [account] = await sql`
      insert into admin_accounts (email, password_hash, api_token)
      values (${email}, ${passwordHash}, ${apiToken})
      returning id, email, api_token;
    `;

    return res.status(201).json({
      message: 'Account created',
      email: account.email,
      token: account.api_token,
    });
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'Account already exists for that email' });
    }
    console.error('Failed to create admin account', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
};
