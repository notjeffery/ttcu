-- ttcu schema — mirrors the first-city-bank transaction-ledger design.
-- Wallet balances are derived from ledger entries, never stored/mutated
-- directly, so every credit/debit is auditable.

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  account_name text not null default 'Wallet',
  full_name text not null,
  account_number text not null unique,
  routing_number text not null default '021000021', -- placeholder institution routing number
  card_last4 text not null default '0000',
  created_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) not null,
  entry_type text not null check (entry_type in ('credit', 'debit')),
  amount numeric(14, 2) not null check (amount > 0),
  description text,
  posted_by uuid references auth.users(id),
  reference text,
  created_at timestamptz not null default now()
);

create or replace view public.account_balances as
select
  account_id,
  coalesce(sum(case when entry_type = 'credit' then amount else -amount end), 0)
    as balance
from public.ledger_entries
group by account_id;

alter table public.accounts enable row level security;
alter table public.ledger_entries enable row level security;

create policy "Users can view their own accounts"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own account"
  on public.accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own ledger entries"
  on public.ledger_entries for select
  using (
    account_id in (
      select id from public.accounts where user_id = auth.uid()
    )
  );

Per-action restrictions, admin-controlled. When true, that action is
-- blocked for the account and the user should use their card instead.
alter table public.accounts
  add column if not exists send_restricted boolean not null default false,
  add column if not exists request_restricted boolean not null default false,
  add column if not exists add_funds_restricted boolean not null default false;