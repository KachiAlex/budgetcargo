function showToast(message, duration = 4000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

// Hamburger Menu Toggle
(function initHamburgerMenu() {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const navDrawer = document.getElementById('navDrawer');
  const navDrawerClose = document.getElementById('navDrawerClose');
  const navDrawerLinks = document.querySelectorAll('.nav-drawer-links a');

  if (!hamburgerMenu || !navDrawer) return;

  // Toggle drawer on hamburger click
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navDrawer.classList.toggle('active');
    document.body.style.overflow = navDrawer.classList.contains('active') ? 'hidden' : '';
  });

  // Close drawer on close button click
  navDrawerClose?.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    navDrawer.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close drawer when clicking on a link
  navDrawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerMenu.classList.remove('active');
      navDrawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close drawer when clicking outside (on the overlay)
  navDrawer.addEventListener('click', (e) => {
    if (e.target === navDrawer) {
      hamburgerMenu.classList.remove('active');
      navDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

(function handlePaymentRedirect() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const ref = params.get('ref');
  if (payment === 'success') {
    showToast(ref ? `Payment successful · ${ref}` : 'Payment successful', 6000);
    window.history.replaceState({}, '', window.location.pathname);
  } else if (payment === 'cancel') {
    showToast(ref ? `Payment cancelled · ${ref}` : 'Payment cancelled', 4000);
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');
const summaryTitle = orderSummary?.querySelector('h3');
const summaryDesc = orderSummary?.querySelector('.summary-desc');
const summaryList = orderSummary?.querySelector('ul');
const summaryAlert = document.createElement('p');
summaryAlert.className = 'summary-alert';
const paymentButton = document.getElementById('paymentButton');
const whatsappButton = document.getElementById('whatsappButton');
const summaryActions = document.getElementById('summaryActions');
const scrollButtons = document.querySelectorAll('[data-scroll]');

scrollButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(amount);
}

function buildSummaryItems(data) {
  const { name, email, phone, description, weight, delivery, addOns, quote, reference } = data;

  return [
    `Client: ${name} • ${phone}`,
    `Contact: ${email}`,
    `Items: ${description}`,
    `Weight: ${weight.toFixed(1)} kg (${quote.baseLabel})`,
    `Add-ons: ${addOns.length ? addOns.join(', ') : 'None'}`,
    `Delivery: ${delivery}`,
    `Automation: Consolidation ID ${reference} issued. Customs prep queued.`,
    `Estimated total: ${formatCurrency(quote.grandTotal)}`,
  ];
}

function renderSummary(items, reference, nextSteps = []) {
  if (!summaryList || !summaryTitle || !summaryDesc) return;

  summaryTitle.textContent = `Quote ready · Ref ${reference}`;
  summaryDesc.textContent = 'We emailed your consolidation ID. Pay once weight is confirmed.';
  summaryList.innerHTML = '';
  summaryAlert.textContent = nextSteps.length ? `Next steps: ${nextSteps.join(' → ')}` : '';
  if (nextSteps.length && !summaryAlert.isConnected) {
    orderSummary?.insertBefore(summaryAlert, summaryList);
  }

  items.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    summaryList.appendChild(li);
  });

  if (summaryActions) {
    summaryActions.hidden = false;
    paymentButton?.setAttribute('data-reference', reference);
    whatsappButton?.setAttribute('data-reference', reference);
  }
}

function storeQuoteAmount(amount) {
  paymentButton?.setAttribute('data-amount', String(amount));
}

paymentButton?.addEventListener('click', async () => {
  const reference = paymentButton.getAttribute('data-reference');
  const amount = parseFloat(paymentButton.getAttribute('data-amount'));
  if (!reference || Number.isNaN(amount)) return;

  paymentButton.disabled = true;
  paymentButton.textContent = 'Redirecting to Stripe…';

  try {
    const response = await fetch('/api/payment/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, amount }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Failed to start payment');
    }

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    alert(error.message || 'Unable to start payment. Please try again.');
    paymentButton.disabled = false;
    paymentButton.textContent = 'Proceed to Payment';
  }
});

whatsappButton?.addEventListener('click', () => {
  const reference = whatsappButton.getAttribute('data-reference');
  if (!reference) return;
  const message = encodeURIComponent(`Hi BudgetCargo team, following up on reference ${reference}. Please confirm payment steps.`);
  window.open(`https://wa.me/447756168494?text=${message}`, '_blank');
});

async function submitOrder(payload) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error || 'Failed to submit order';
    throw new Error(message);
  }

  return response.json();
}

orderForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const weight = parseFloat(formData.get('weight'));
  if (!weight || Number.isNaN(weight)) {
    orderForm.reportValidity();
    return;
  }

  const payload = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone').trim(),
    description: formData.get('description').trim(),
    weight,
    delivery: formData.get('delivery'),
    priority: Boolean(formData.get('priority')),
    insurance: Boolean(formData.get('insurance')),
  };

  const submitButton = orderForm.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Generating quote...';
  }

  try {
    const result = await submitOrder(payload);
    const summaryItems = buildSummaryItems({
      ...payload,
      addOns: result.addOns,
      quote: {
        baseLabel: result.quote.baseLabel,
        grandTotal: result.quote.grandTotal,
      },
      reference: result.reference,
      delivery: result.delivery,
    });
    renderSummary(summaryItems, result.reference, result.nextSteps);
    storeQuoteAmount(result.quote.grandTotal);
    orderSummary.classList.add('active');

    showToast(`Automation triggered · ${result.reference}`);

    orderForm.reset();
  } catch (error) {
    alert(error.message || 'Unable to submit order. Please try again.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
});
