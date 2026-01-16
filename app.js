const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');
const summaryTitle = orderSummary?.querySelector('h3');
const summaryDesc = orderSummary?.querySelector('.summary-desc');
const summaryList = orderSummary?.querySelector('ul');
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

function computeRate(weight) {
  if (weight <= 5) {
    return { label: '0 – 5kg flat rate', cost: 45 };
  }

  if (weight <= 10) {
    return { label: '5 – 10kg flat rate', cost: 82 };
  }

  if (weight <= 20) {
    return { label: '10 – 20kg band', cost: weight * 8.3 };
  }

  return { label: '20kg+ economy rate', cost: weight * 7.5 };
}

function buildSummaryItems(data) {
  const { name, email, phone, description, weight, delivery, addOns, quote, reference } = data;

  return [
    `Client: ${name} • ${phone}`,
    `Contact: ${email}`,
    `Items: ${description}`,
    `Weight: ${weight.toFixed(1)} kg (${quote.baseLabel})`,
    `Add-ons: ${addOns.length ? addOns.join(', ') : 'None'}`,
    `Delivery: ${delivery === 'home' ? 'Premium door delivery' : delivery === 'blantyre' ? 'Blantyre partner depot' : 'Lilongwe HQ pickup'}`,
    `Automation: Consolidation ID ${reference} issued. Customs prep queued.`,
    `Estimated total: ${formatCurrency(quote.total)}`,
  ];
}

function renderSummary(items, reference) {
  if (!summaryList || !summaryTitle || !summaryDesc) return;

  summaryTitle.textContent = `Quote ready · Ref ${reference}`;
  summaryDesc.textContent = 'We emailed your consolidation ID. Pay once weight is confirmed.';
  summaryList.innerHTML = '';

  items.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    summaryList.appendChild(li);
  });
}

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const weight = parseFloat(formData.get('weight'));
  if (!weight || Number.isNaN(weight)) {
    orderForm.reportValidity();
    return;
  }

  const base = computeRate(weight);
  let total = base.cost;
  const addOns = [];

  if (formData.get('priority')) {
    total += 12;
    addOns.push('Priority flight (+£12)');
  }

  if (formData.get('insurance')) {
    total += 6;
    addOns.push('Enhanced insurance (+£6)');
  }

  const reference = `BC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  const payload = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone').trim(),
    description: formData.get('description').trim(),
    weight,
    delivery: formData.get('delivery'),
    addOns,
    reference,
    quote: {
      baseLabel: base.label,
      total,
    },
  };

  const items = buildSummaryItems(payload);
  renderSummary(items, reference);

  orderSummary.classList.add('active');

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = `Automation triggered · ${reference}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);

  orderForm.reset();
});
