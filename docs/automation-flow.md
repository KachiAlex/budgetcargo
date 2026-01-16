# BudgetCargo Automation Blueprint

This document outlines the first iteration of an end-to-end automated flow for BudgetCargo, covering intake, routing, notifications, and owner visibility.

## 1. System Goals

1. **Structured intake:** Every customer request is persisted with full metadata.
2. **Instant acknowledgements:** Customers receive a consolidation ID and quote immediately after submission.
3. **Operational visibility:** Owners see real-time order queues, SLA timers, and payment states.
4. **Automated milestones:** Status updates travel automatically to customers (WhatsApp/SMS/email) and internal teams.
5. **Extensibility:** The flow can plug in additional services (customs, warehousing, invoicing) without rewriting the core.

## 2. High-level Architecture

```
Browser Form → /api/orders (Vercel Function) → Neon Postgres
                                         ↘ Notification queue (future)
```

- **Frontend:** `app.js` collects parcel data, displays instant quotes, and calls the API.
- **API layer:** `api/orders.js` validates input, computes operational metadata, persists to Neon, and returns automation steps.
- **Database:** Neon-hosted Postgres table `orders` stores structured rows (see schema below).
- **Notifications:** The API prepares a queue payload; future integrations can push to Twilio WhatsApp, SendGrid, Slack, etc.

## 3. Data Model (`orders` table)

| Column              | Type        | Notes |
|---------------------|-------------|-------|
| `id`                | uuid        | Default `uuid_generate_v4()`
| `reference`         | text        | e.g. `BC-2026-4830`
| `customer_name`     | text        | Full name
| `email`             | text        | Contact email
| `phone`             | text        | WhatsApp/phone
| `description`       | text        | Parcel contents
| `weight_kg`         | numeric     | Decimal weight
| `delivery_option`   | text        | `office`, `blantyre`, `home`
| `priority`          | boolean     | Optional add-on
| `insurance`         | boolean     | Optional add-on
| `base_rate_label`   | text        | e.g. `10 – 20kg band`
| `base_rate_amount`  | numeric     | Base cost before add-ons
| `add_on_total`      | numeric     | Sum of extras
| `grand_total`       | numeric     | Final quote
| `status`            | text        | `queued`, `processing`, `awaiting_pickup`, etc.
| `timeline`          | jsonb       | Array of milestone objects (event + timestamp)
| `created_at`        | timestamptz | Default `now()`

Create table SQL:

```sql
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  reference text not null,
  customer_name text not null,
  email text not null,
  phone text not null,
  description text not null,
  weight_kg numeric not null,
  delivery_option text not null,
  priority boolean default false,
  insurance boolean default false,
  base_rate_label text not null,
  base_rate_amount numeric not null,
  add_on_total numeric not null,
  grand_total numeric not null,
  status text not null default 'queued',
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
```

## 4. Automation Steps

1. **Intake:** API validates request, calculates quote, and persists a row.
2. **Reference issuance:** API returns `reference` and `status` to frontend immediately.
3. **Notification queue (planned):** Use Supabase Functions, Vercel cron, or a queue service to watch `orders` table and send
   - Customer confirmation (WhatsApp/email) with payment link.
   - Internal Slack/Teams ping for new drops.
4. **Milestone updates:** Operations dashboard (future) updates `status`; triggers automation to notify customer.
5. **Analytics:** Dashboards read from Neon (SQL views) to display SLA metrics, revenue, weight distributions.

## 5. Environment Variables

Add these to Vercel → Project Settings → Environment Variables:

| Key                           | Description |
|-------------------------------|-------------|
| `NEON_DATABASE_URL`           | Postgres connection string (use a pooled connection string)
| `NEON_SHADOW_DATABASE_URL` (optional) | Use for future migrations/tests
| `ADMIN_DASH_TOKEN`            | Shared secret required for GET/PATCH requests to `/api/orders` (dashboard access)

## 6. Next Steps

- Build `orders` dashboard (protected route) for internal teams.
- Integrate payment links (Stripe/PayPal) tied to each reference.
- Wire notification service (Twilio WhatsApp + SendGrid + Slack).
- Add webhook listener for carrier updates to auto-close orders.

This blueprint drives the initial implementation and keeps the codebase aligned with BudgetCargo’s automation objectives.
