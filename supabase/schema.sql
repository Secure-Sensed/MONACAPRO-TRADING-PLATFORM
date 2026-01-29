-- Supabase schema + RLS for Monacap Trading Pro
-- Run this in the Supabase SQL editor (in order).

create extension if not exists pgcrypto;

-- Timestamp helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text not null default '',
  role text not null default 'user',
  status text not null default 'active',
  balance numeric(14,2) not null default 0,
  phone text,
  country text,
  picture text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Helper to detect admin user (based on profiles.role)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Traders
create table if not exists public.traders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image text,
  profit text,
  risk text,
  win_rate text,
  followers integer not null default 0,
  trades integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Plans
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric(14,2) not null,
  duration text not null,
  features jsonb not null default '[]'::jsonb,
  popular boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Copy trades
create table if not exists public.copy_trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trader_id uuid references public.traders(id) on delete set null,
  amount numeric(14,2) not null,
  current_profit numeric(14,2) not null default 0,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

-- Transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  amount numeric(14,2) not null,
  method text,
  asset text,
  details jsonb,
  status text not null default 'pending',
  processed_by uuid references public.profiles(id),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.transactions
  add constraint transactions_type_check
  check (type in ('deposit', 'withdrawal', 'trade'));

alter table public.transactions
  add constraint transactions_status_check
  check (status in ('pending', 'completed', 'rejected'));

alter table public.transactions
  add constraint transactions_amount_check
  check (amount > 0);

-- Wallet addresses
create table if not exists public.wallet_addresses (
  method text primary key,
  address jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger set_wallets_updated_at
before update on public.wallet_addresses
for each row
execute function public.set_updated_at();

-- Keep profiles in sync with auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

create or replace function public.sync_user_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set email = new.email,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_updated'
  ) then
    create trigger on_auth_user_updated
    after update of email on auth.users
    for each row execute function public.sync_user_email();
  end if;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.traders enable row level security;
alter table public.plans enable row level security;
alter table public.copy_trades enable row level security;
alter table public.transactions enable row level security;
alter table public.wallet_addresses enable row level security;

-- Profiles policies
create policy profiles_select_own_or_admin
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

create policy profiles_insert_own
on public.profiles
for insert
with check (id = auth.uid());

create policy profiles_update_own
on public.profiles
for update
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = (select p.role from public.profiles p where p.id = auth.uid())
  and status = (select p.status from public.profiles p where p.id = auth.uid())
  and balance = (select p.balance from public.profiles p where p.id = auth.uid())
);

create policy profiles_admin_update
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

create policy profiles_admin_delete
on public.profiles
for delete
using (public.is_admin());

create policy profiles_admin_all
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

-- Traders policies
create policy traders_select_public
on public.traders
for select
using (is_active = true);

create policy traders_admin_all
on public.traders
for all
using (public.is_admin())
with check (public.is_admin());

-- Plans policies
create policy plans_select_public
on public.plans
for select
using (is_active = true);

create policy plans_admin_all
on public.plans
for all
using (public.is_admin())
with check (public.is_admin());

-- Copy trades policies
create policy copy_trades_select_own_or_admin
on public.copy_trades
for select
using (user_id = auth.uid() or public.is_admin());

create policy copy_trades_insert_own
on public.copy_trades
for insert
with check (user_id = auth.uid());

create policy copy_trades_update_own
on public.copy_trades
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy copy_trades_admin_all
on public.copy_trades
for all
using (public.is_admin())
with check (public.is_admin());

-- Transactions policies
create policy transactions_select_own_or_admin
on public.transactions
for select
using (user_id = auth.uid() or public.is_admin());

create policy transactions_insert_own
on public.transactions
for insert
with check (user_id = auth.uid());

create policy transactions_admin_update
on public.transactions
for update
using (public.is_admin())
with check (public.is_admin());

create policy transactions_admin_delete
on public.transactions
for delete
using (public.is_admin());

create policy transactions_admin_all
on public.transactions
for all
using (public.is_admin())
with check (public.is_admin());

-- Wallet policies
create policy wallet_addresses_select_public
on public.wallet_addresses
for select
using (true);

create policy wallet_addresses_admin_all
on public.wallet_addresses
for all
using (public.is_admin())
with check (public.is_admin());

-- RPC: approve/reject transaction (admin only)
create or replace function public.approve_transaction(transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tx record;
  current_balance numeric;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  select * into tx
  from public.transactions
  where id = transaction_id
  for update;

  if not found then
    raise exception 'Transaction not found';
  end if;

  if tx.status <> 'pending' then
    raise exception 'Transaction already processed';
  end if;

  select balance into current_balance
  from public.profiles
  where id = tx.user_id
  for update;

  if not found then
    raise exception 'User not found';
  end if;

  if tx.type = 'deposit' then
    update public.profiles
    set balance = current_balance + tx.amount,
        updated_at = now()
    where id = tx.user_id;
  elsif tx.type = 'withdrawal' then
    if current_balance - tx.amount < 0 then
      raise exception 'Insufficient balance';
    end if;
    update public.profiles
    set balance = current_balance - tx.amount,
        updated_at = now()
    where id = tx.user_id;
  end if;

  update public.transactions
  set status = 'completed',
      processed_by = auth.uid(),
      processed_at = now()
  where id = transaction_id;
end;
$$;

create or replace function public.reject_transaction(transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tx record;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  select * into tx
  from public.transactions
  where id = transaction_id
  for update;

  if not found then
    raise exception 'Transaction not found';
  end if;

  if tx.status <> 'pending' then
    raise exception 'Transaction already processed';
  end if;

  update public.transactions
  set status = 'rejected',
      processed_by = auth.uid(),
      processed_at = now()
  where id = transaction_id;
end;
$$;

-- Admin helper to delete a user (auth + profile)
create or replace function public.admin_delete_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  delete from auth.users where id = target_id;
end;
$$;
