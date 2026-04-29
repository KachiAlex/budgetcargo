const tabs = document.querySelectorAll('.login-tab');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

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

async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error || 'Request failed';
    throw new Error(message);
  }

  return response.json();
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
  const payload = {
    email: formData.get('email').trim().toLowerCase(),
    password: formData.get('password'),
    confirm: formData.get('confirm'),
    registrationCode: formData.get('registrationCode'),
  };

  try {
    const data = await postJSON('/api/auth/register', payload);
    persistSession({ email: data.email, token: data.token });
    alert('Account created. Redirecting to dashboard.');
    redirectToDashboard();
  } catch (error) {
    alert(error.message);
  }
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = {
    email: formData.get('email').trim().toLowerCase(),
    password: formData.get('password'),
  };

  try {
    const data = await postJSON('/api/auth/login', payload);
    persistSession({ email: data.email, token: data.token });
    alert('Login successful. Redirecting to dashboard.');
    redirectToDashboard();
  } catch (error) {
    alert(error.message);
  }
});

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
