const tabs = document.querySelectorAll('.login-tab');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const ACCOUNT_STORAGE_KEY = 'bc_ops_accounts';
const SESSION_STORAGE_KEY = 'bc_active_user';
const TOKEN_STORAGE_KEY = 'bc_admin_token';

function switchTab(target) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === target));
  registerForm.classList.toggle('active', target === 'register');
  loginForm.classList.toggle('active', target === 'login');
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || {};
  } catch (error) {
    console.warn('Failed to parse accounts store', error);
    return {};
  }
}

function saveAccounts(data) {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(data));
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function persistSession({ email, token }) {
  const sessionPayload = { email, token };
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

function redirectToDashboard() {
  window.location.href = 'admin.html';
}

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const email = formData.get('email').trim().toLowerCase();
  const password = formData.get('password');
  const confirm = formData.get('confirm');
  const token = formData.get('token').trim();

  if (password !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  if (!token) {
    alert('Admin token is required to create an account.');
    return;
  }

  const accounts = getAccounts();
  if (accounts[email]) {
    alert('An account with this email already exists.');
    return;
  }

  const passwordHash = await hashPassword(password);
  accounts[email] = { passwordHash, token };
  saveAccounts(accounts);
  persistSession({ email, token });
  alert('Account created. Redirecting to dashboard.');
  redirectToDashboard();
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get('email').trim().toLowerCase();
  const password = formData.get('password');

  const accounts = getAccounts();
  const account = accounts[email];
  if (!account) {
    alert('No account found for that email.');
    return;
  }

  const hash = await hashPassword(password);
  if (hash !== account.passwordHash) {
    alert('Incorrect password.');
    return;
  }

  persistSession({ email, token: account.token });
  alert('Login successful. Redirecting to dashboard.');
  redirectToDashboard();
});

// Auto redirect if the user already has an active session
window.addEventListener('load', () => {
  const sessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (sessionRaw) {
    try {
      const parsed = JSON.parse(sessionRaw);
      if (parsed?.email) {
        redirectToDashboard();
      }
    } catch (error) {
      console.warn('Failed to parse session data', error);
    }
  }
});
