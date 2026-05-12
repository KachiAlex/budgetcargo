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
const errorFields = document.querySelectorAll('.input-error');

function setFieldError(input, message = '') {
  const errorElement = document.querySelector(`.input-error[data-error-for="${input.name}"]`);
  if (!errorElement) return;

  if (message) {
    input.classList.add('error');
    errorElement.textContent = message;
  } else {
    input.classList.remove('error');
    errorElement.textContent = '';
  }
}

function validateField(input) {
  let validityMessage = '';
  if (input.validity.valueMissing) {
    validityMessage = 'Required field';
  } else if (input.type === 'email' && input.validity.typeMismatch) {
    validityMessage = 'Enter a valid email';
  } else if (input.type === 'number' && input.validity.rangeUnderflow) {
    validityMessage = `Minimum ${input.min}kg`;
  }

  setFieldError(input, validityMessage);
  return !validityMessage;
}

function validateForm() {
  if (!orderForm) return false;
  const inputs = orderForm.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  return isValid;
}

orderForm?.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
  if (target.required) {
    validateField(target);
  }
});

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

function computeClientSideQuote(weight, priority, insurance, delivery) {
  let baseCost;
  let baseLabel;

  if (weight <= 5) {
    baseCost = 45;
    baseLabel = '0 – 5kg flat rate';
  } else if (weight <= 10) {
    baseCost = 82;
    baseLabel = '5 – 10kg flat rate';
  } else if (weight <= 20) {
    baseCost = weight * 8.3;
    baseLabel = '10 – 20kg band';
  } else {
    baseCost = weight * 7.5;
    baseLabel = '20kg+ economy rate';
  }

  let addOnTotal = 0;
  const addOns = [];

  if (priority) {
    addOnTotal += 12;
    addOns.push('Priority flight (+£12)');
  }

  if (insurance) {
    addOnTotal += 6;
    addOns.push('Enhanced insurance (+£6)');
  }

  const grandTotal = baseCost + addOnTotal;

  let deliveryLabel;
  switch (delivery) {
    case 'home':
      deliveryLabel = 'Premium home delivery';
      break;
    case 'blantyre':
      deliveryLabel = 'Blantyre partner depot';
      break;
    default:
      deliveryLabel = 'Lilongwe HQ pickup';
  }

  return {
    baseLabel,
    baseAmount: baseCost,
    addOnTotal,
    grandTotal,
    addOns,
    delivery: deliveryLabel,
  };
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

function renderSummary(items, reference, nextSteps = [], amount = null) {
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
    paymentButton?.setAttribute('data-amount', amount || '0');
    whatsappButton?.setAttribute('data-reference', reference);
  }
}

paymentButton?.addEventListener('click', async () => {
  const reference = paymentButton.getAttribute('data-reference');
  const amount = parseFloat(paymentButton.getAttribute('data-amount') || '0');
  if (!reference || amount <= 0) {
    alert('Quote information not available. Please generate a quote first.');
    return;
  }

  const originalText = paymentButton.textContent;
  paymentButton.disabled = true;
  paymentButton.textContent = 'Processing...';

  try {
    const response = await fetch('/api/payment/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, amount }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Payment initialization failed');
    }

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No payment URL returned');
    }
  } catch (error) {
    alert(error.message || 'Unable to initialize payment. Please try again.');
  } finally {
    paymentButton.disabled = false;
    paymentButton.textContent = originalText;
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

  if (!validateForm()) {
    return;
  }

  const formData = new FormData(orderForm);
  const weight = parseFloat(formData.get('weight'));

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
    renderSummary(summaryItems, result.reference, result.nextSteps, result.quote.grandTotal);
    orderSummary.classList.add('active');

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = `Automation triggered · ${result.reference}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 4000);

    orderForm.reset();
    errorFields.forEach((field) => (field.textContent = ''));
  } catch (error) {
    console.error('API submission failed, using client-side calculation:', error);
    
    const clientQuote = computeClientSideQuote(
      payload.weight,
      payload.priority,
      payload.insurance,
      payload.delivery
    );
    
    const reference = `BC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
    
    const summaryItems = buildSummaryItems({
      ...payload,
      addOns: clientQuote.addOns,
      quote: {
        baseLabel: clientQuote.baseLabel,
        grandTotal: clientQuote.grandTotal,
      },
      reference,
      delivery: clientQuote.delivery,
    });
    
    renderSummary(summaryItems, reference, [
      'Quote generated locally',
      'Contact us to confirm and proceed to payment',
    ], clientQuote.grandTotal);
    orderSummary.classList.add('active');

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = `Quote generated · ${reference}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 4000);

    orderForm.reset();
    errorFields.forEach((field) => (field.textContent = ''));
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
});
