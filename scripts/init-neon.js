#!/usr/bin/env node
const { neon } = require('@neondatabase/serverless');

async function main() {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.error('NEON_DATABASE_URL env var is required.');
    process.exit(1);
  }

  const sql = neon(connectionString);

  console.log('Connecting to Neon…');

  await sql`create extension if not exists "uuid-ossp"`;

  await sql`
    create table if not exists public.orders (
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
    )
  `;

  await sql`create index if not exists orders_reference_idx on public.orders(reference)`;
  await sql`create index if not exists orders_status_idx on public.orders(status)`;

  console.log('Orders table ready.');
}

main().catch((error) => {
  console.error('Failed to initialise Neon schema');
  console.error(error);
  process.exit(1);
});
