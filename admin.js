const statusFilter = document.getElementById('statusFilter');
const limitInput = document.getElementById('limitInput');
const refreshButton = document.getElementById('refreshButton');
const connectionStatus = document.getElementById('connectionStatus');
const ordersTableBody = document.getElementById('ordersTableBody');
const recordCount = document.getElementById('recordCount');
const lastSync = document.getElementById('lastSync');
const timelineList = document.getElementById('timelineList');
const contactCard = document.getElementById('contactCard');
const adminTokenInput = document.getElementById('adminTokenInput');
const saveTokenButton = document.getElementById('saveTokenButton');
const logoutButton = document.getElementById('logoutButton');
const userBadge = document.getElementById('userBadge');

const STATUS_OPTIONS = ['queued', 'processing', 'awaiting_pickup', 'completed', 'cancelled'];
const TOKEN_STORAGE_KEY = 'bc_admin_token';
const SESSION_STORAGE_KEY = 'bc_active_user';

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || getSession()?.token || '';
}

function saveToken(value) {
  if (value) {
    localStorage.setItem(TOKEN_STORAGE_KEY, value);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse session payload', error);
    return null;
  }
}

function ensureSession() {
  const session = getSession();
  if (!session?.email) {
    window.location.href = 'login.html';
    return null;
  }
  if (userBadge) {
    userBadge.textContent = `Ops: ${session.email}`;
  }
  if (adminTokenInput && session.token && !adminTokenInput.value) {
    adminTokenInput.value = session.token;
    saveToken(session.token);
  }
  return session;
}

async function fetchOrders(params = {}) {
  const url = new URL('/api/orders', window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  connectionStatus.textContent = 'Syncing…';
  connectionStatus.classList.add('syncing');

  try {
    const headers = {};
    const token = getToken();
    if (token) {
      headers['x-admin-token'] = token;
    }

    const response = await fetch(url, { headers });
    if (response.status === 401) {
      alert('Session expired or unauthorized. Please login again.');
      handleLogout();
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    connectionStatus.textContent = 'Connected';
    connectionStatus.classList.remove('syncing');
    recordCount.textContent = data.count;
    lastSync.textContent = new Date().toLocaleTimeString();
    renderTable(data.rows);
  } catch (error) {
    connectionStatus.textContent = 'Error';
    connectionStatus.classList.remove('syncing');
    console.error(error);
    alert(error.message || 'Failed to fetch orders. Check console for details.');
  }
}

function renderTable(rows) {
  ordersTableBody.innerHTML = '';
  if (!rows.length) {
    ordersTableBody.innerHTML = '<tr><td class="empty-state" colspan="8">No orders match this filter.</td></tr>';
    timelineList.innerHTML = '<li>Select a row to inspect milestones.</li>';
    contactCard.innerHTML = '<p>Reference not selected.</p>';
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.reference}</td>
      <td>
        <strong>${row.customer_name}</strong><br />
        <small>${row.email}</small>
      </td>
      <td>${row.weight_kg} kg</td>
      <td>${row.delivery_option}</td>
      <td>£${(row.grand_total ?? 0).toFixed(2)}</td>
      <td class="status-text">${row.status}</td>
      <td class="update-cell"></td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
    `;

    const updateCell = tr.querySelector('.update-cell');
    const select = document.createElement('select');
    select.className = 'status-select';
    STATUS_OPTIONS.forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      select.appendChild(option);
    });
    select.value = row.status;
    select.addEventListener('change', (event) => {
      event.stopPropagation();
      updateStatus(row.id, event.target.value);
    });
    select.addEventListener('click', (event) => event.stopPropagation());
    updateCell.appendChild(select);

    tr.addEventListener('click', () => selectRow(row));
    ordersTableBody.appendChild(tr);
  });
}

function selectRow(row) {
  timelineList.innerHTML = '';
  try {
    const timeline = Array.isArray(row.timeline) ? row.timeline : JSON.parse(row.timeline || '[]');
    if (!timeline.length) {
      timelineList.innerHTML = '<li>No timeline events logged.</li>';
    } else {
      timeline.forEach((entry) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${entry.event}</strong><br />
          <small>${new Date(entry.timestamp).toLocaleString()}</small><br />
          <span>${entry.note || ''}</span>
        `;
        timelineList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Failed to parse timeline', error);
    timelineList.innerHTML = '<li>Unable to load timeline.</li>';
  }

  contactCard.innerHTML = `
    <p><strong>${row.customer_name}</strong></p>
    <p>Email: <a href="mailto:${row.email}">${row.email}</a></p>
    <p>Phone: <a href="tel:${row.phone}">${row.phone}</a></p>
    <p>Weight: ${row.weight_kg} kg</p>
    <p>Delivery: ${row.delivery_option}</p>
  `;
}

refreshButton?.addEventListener('click', () => {
  fetchOrders({ status: statusFilter.value, limit: limitInput.value });
});

statusFilter?.addEventListener('change', () => {
  fetchOrders({ status: statusFilter.value, limit: limitInput.value });
});

saveTokenButton?.addEventListener('click', () => {
  saveToken(adminTokenInput.value.trim());
  fetchOrders({ status: statusFilter.value, limit: limitInput.value });
});

window.addEventListener('load', () => {
  const session = ensureSession();
  if (!session) return;

  const storedToken = getToken();
  if (storedToken && adminTokenInput) {
    adminTokenInput.value = storedToken;
  }
  fetchOrders({ status: statusFilter.value, limit: limitInput.value });
});

async function updateStatus(id, status) {
  const token = getToken();
  if (!token) {
    alert('Set your admin token first.');
    return;
  }

  connectionStatus.textContent = 'Updating…';

  try {
    const response = await fetch('/api/orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Failed to update status');
    }

    await fetchOrders({ status: statusFilter.value, limit: limitInput.value });
  } catch (error) {
    console.error('Status update failed', error);
    alert(error.message || 'Unable to update status');
    connectionStatus.textContent = 'Error';
  }
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.location.href = 'login.html';
}
