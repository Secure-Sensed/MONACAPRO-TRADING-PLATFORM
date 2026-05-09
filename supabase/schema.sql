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
  kyc_status text not null default 'pending',
  two_factor_enabled boolean not null default false,
  notification_preferences jsonb default '{"email": true, "push": true}'::jsonb,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  drop constraint if exists profiles_kyc_status_check;

alter table public.profiles
  add constraint profiles_kyc_status_check
  check (kyc_status in ('pending', 'verified', 'rejected'));

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Helper to detect admin user (based on profiles.role)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.profile_protected_values_match(
  target_email text,
  target_role text,
  target_status text,
  target_balance numeric,
  target_kyc_status text,
  target_two_factor_enabled boolean
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.email is not distinct from target_email
      and p.role is not distinct from target_role
      and p.status is not distinct from target_status
      and p.balance is not distinct from target_balance
      and p.kyc_status is not distinct from target_kyc_status
      and p.two_factor_enabled is not distinct from target_two_factor_enabled
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
  win_rate_percent numeric(5,2),
  monthly_return numeric(14,2),
  max_drawdown numeric(5,2),
  avg_trade_duration interval,
  total_volume_managed numeric(14,2) not null default 0,
  rating numeric(3,2),
  followers integer not null default 0,
  trades integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.traders
  drop constraint if exists traders_win_rate_percent_check;

alter table public.traders
  add constraint traders_win_rate_percent_check
  check (win_rate_percent >= 0 and win_rate_percent <= 100);

alter table public.traders
  drop constraint if exists traders_rating_check;

alter table public.traders
  add constraint traders_rating_check
  check (rating >= 0 and rating <= 5);

drop trigger if exists set_traders_updated_at on public.traders;
create trigger set_traders_updated_at
before update on public.traders
for each row
execute function public.set_updated_at();

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
  allocated_percentage numeric(5,2) not null default 100,
  current_profit numeric(14,2) not null default 0,
  fees_paid numeric(14,2) not null default 0,
  leverage_used numeric(5,2) not null default 1,
  stop_loss numeric(14,2),
  take_profit numeric(14,2),
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.copy_trades
  drop constraint if exists copy_trades_allocated_percentage_check;

alter table public.copy_trades
  add constraint copy_trades_allocated_percentage_check
  check (allocated_percentage > 0 and allocated_percentage <= 100);

alter table public.copy_trades
  drop constraint if exists copy_trades_leverage_check;

alter table public.copy_trades
  add constraint copy_trades_leverage_check
  check (leverage_used > 0 and leverage_used <= 20);

drop trigger if exists set_copy_trades_updated_at on public.copy_trades;
create trigger set_copy_trades_updated_at
before update on public.copy_trades
for each row
execute function public.set_updated_at();

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
  reference_id text,
  crypto_network text,
  from_address text,
  to_address text,
  conversion_rate numeric(14,8),
  processed_by uuid references public.profiles(id),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.transactions
  drop constraint if exists transactions_type_check;

alter table public.transactions
  add constraint transactions_type_check
  check (type in ('deposit', 'withdrawal', 'trade'));

alter table public.transactions
  drop constraint if exists transactions_status_check;

alter table public.transactions
  add constraint transactions_status_check
  check (status in ('pending', 'completed', 'rejected'));

alter table public.transactions
  drop constraint if exists transactions_amount_check;

alter table public.transactions
  add constraint transactions_amount_check
  check (amount > 0);

alter table public.transactions
  drop constraint if exists transactions_conversion_rate_check;

alter table public.transactions
  add constraint transactions_conversion_rate_check
  check (conversion_rate > 0);

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_updated_at();

-- Wallet addresses
create table if not exists public.wallet_addresses (
  method text primary key,
  address jsonb not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_wallets_updated_at on public.wallet_addresses;
create trigger set_wallets_updated_at
before update on public.wallet_addresses
for each row
execute function public.set_updated_at();

-- Admin-controlled website settings
create table if not exists public.platform_settings (
  id text primary key default 'default',
  platform_name text not null default 'Monacap Trading Pro',
  support_email text not null default 'support@monacaptradingpro.com',
  support_phone text not null default '+1 (800) 555-0123',
  support_address text not null default '123 Financial District, Sydney, NSW 2000, Australia',
  min_deposit numeric(14,2) not null default 250,
  min_withdrawal numeric(14,2) not null default 100,
  max_withdrawal numeric(14,2) not null default 100000,
  max_leverage text not null default '1:2000',
  registrations_enabled boolean not null default true,
  deposits_enabled boolean not null default true,
  withdrawals_enabled boolean not null default true,
  copy_trading_enabled boolean not null default true,
  maintenance_mode boolean not null default false,
  announcement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_platform_settings_updated_at on public.platform_settings;
create trigger set_platform_settings_updated_at
before update on public.platform_settings
for each row
execute function public.set_updated_at();

insert into public.platform_settings (id)
values ('default')
on conflict (id) do nothing;

-- Contact form messages routed into the admin inbox
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages
  drop constraint if exists contact_messages_status_check;

alter table public.contact_messages
  add constraint contact_messages_status_check
  check (status in ('new', 'in_progress', 'resolved', 'archived'));

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row
execute function public.set_updated_at();

-- Activity logs for audit trail
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id text,
  changes jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at);
create index if not exists idx_activity_logs_entity on public.activity_logs(entity_type, entity_id);
create index if not exists idx_profiles_role_status on public.profiles(role, status);
create index if not exists idx_transactions_user_created on public.transactions(user_id, created_at desc);
create index if not exists idx_transactions_status_type on public.transactions(status, type);
create index if not exists idx_copy_trades_user_status on public.copy_trades(user_id, status);
create index if not exists idx_contact_messages_status_created on public.contact_messages(status, created_at desc);

alter table public.profiles replica identity full;
alter table public.transactions replica identity full;
alter table public.wallet_addresses replica identity full;
alter table public.copy_trades replica identity full;
alter table public.traders replica identity full;
alter table public.plans replica identity full;
alter table public.platform_settings replica identity full;
alter table public.contact_messages replica identity full;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
    ) then
      execute 'alter publication supabase_realtime add table public.profiles';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'transactions'
    ) then
      execute 'alter publication supabase_realtime add table public.transactions';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'wallet_addresses'
    ) then
      execute 'alter publication supabase_realtime add table public.wallet_addresses';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'copy_trades'
    ) then
      execute 'alter publication supabase_realtime add table public.copy_trades';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'traders'
    ) then
      execute 'alter publication supabase_realtime add table public.traders';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'plans'
    ) then
      execute 'alter publication supabase_realtime add table public.plans';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'platform_settings'
    ) then
      execute 'alter publication supabase_realtime add table public.platform_settings';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'contact_messages'
    ) then
      execute 'alter publication supabase_realtime add table public.contact_messages';
    end if;
  end if;
end;
$$;

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

-- Backfill old auth users and expose auth + profile data to admins.
create or replace function public.sync_auth_users_to_profiles()
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  inserted_count integer;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  insert into public.profiles (id, email, full_name, created_at, updated_at)
  select
    au.id,
    au.email,
    coalesce(au.raw_user_meta_data->>'full_name', ''),
    au.created_at,
    now()
  from auth.users au
  left join public.profiles p on p.id = au.id
  where p.id is null
  on conflict (id) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  full_name text,
  role text,
  status text,
  balance numeric,
  phone text,
  country text,
  picture text,
  kyc_status text,
  two_factor_enabled boolean,
  notification_preferences jsonb,
  last_login timestamptz,
  auth_created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz,
  profile_exists boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return query
  select
    au.id as user_id,
    coalesce(p.email, au.email) as email,
    coalesce(p.full_name, au.raw_user_meta_data->>'full_name', '') as full_name,
    coalesce(p.role, 'user') as role,
    coalesce(p.status, 'active') as status,
    coalesce(p.balance, 0) as balance,
    p.phone,
    p.country,
    p.picture,
    coalesce(p.kyc_status, 'pending') as kyc_status,
    coalesce(p.two_factor_enabled, false) as two_factor_enabled,
    coalesce(p.notification_preferences, '{"email": true, "push": true}'::jsonb) as notification_preferences,
    p.last_login,
    au.created_at as auth_created_at,
    au.last_sign_in_at,
    au.email_confirmed_at,
    (p.id is not null) as profile_exists,
    coalesce(p.created_at, au.created_at) as created_at,
    p.updated_at
  from auth.users au
  left join public.profiles p on p.id = au.id
  order by coalesce(p.created_at, au.created_at) desc;
end;
$$;

grant execute on function public.sync_auth_users_to_profiles() to authenticated;
grant execute on function public.admin_list_users() to authenticated;

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
alter table public.platform_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles policies
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
using (id = auth.uid())
with check (
  id = auth.uid()
  and public.profile_protected_values_match(
    email,
    role,
    status,
    balance,
    kyc_status,
    two_factor_enabled
  )
);

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete
on public.profiles
for delete
using (public.is_admin());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

-- Traders policies
drop policy if exists traders_select_public on public.traders;
create policy traders_select_public
on public.traders
for select
using (is_active = true);

drop policy if exists traders_admin_all on public.traders;
create policy traders_admin_all
on public.traders
for all
using (public.is_admin())
with check (public.is_admin());

-- Plans policies
drop policy if exists plans_select_public on public.plans;
create policy plans_select_public
on public.plans
for select
using (is_active = true);

drop policy if exists plans_admin_all on public.plans;
create policy plans_admin_all
on public.plans
for all
using (public.is_admin())
with check (public.is_admin());

-- Copy trades policies
drop policy if exists copy_trades_select_own_or_admin on public.copy_trades;
create policy copy_trades_select_own_or_admin
on public.copy_trades
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists copy_trades_insert_own on public.copy_trades;
create policy copy_trades_insert_own
on public.copy_trades
for insert
with check (user_id = auth.uid());

drop policy if exists copy_trades_update_own on public.copy_trades;
create policy copy_trades_update_own
on public.copy_trades
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists copy_trades_admin_all on public.copy_trades;
create policy copy_trades_admin_all
on public.copy_trades
for all
using (public.is_admin())
with check (public.is_admin());

-- Transactions policies
drop policy if exists transactions_select_own_or_admin on public.transactions;
create policy transactions_select_own_or_admin
on public.transactions
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists transactions_insert_own on public.transactions;
create policy transactions_insert_own
on public.transactions
for insert
with check (
  user_id = auth.uid()
  and type in ('deposit', 'withdrawal')
  and status = 'pending'
  and processed_by is null
  and processed_at is null
);

drop policy if exists transactions_admin_update on public.transactions;
create policy transactions_admin_update
on public.transactions
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists transactions_admin_delete on public.transactions;
create policy transactions_admin_delete
on public.transactions
for delete
using (public.is_admin());

drop policy if exists transactions_admin_all on public.transactions;
create policy transactions_admin_all
on public.transactions
for all
using (public.is_admin())
with check (public.is_admin());

-- Wallet policies
drop policy if exists wallet_addresses_select_public on public.wallet_addresses;
drop policy if exists wallet_addresses_select_authenticated on public.wallet_addresses;
create policy wallet_addresses_select_public
on public.wallet_addresses
for select
using (auth.uid() is not null);

drop policy if exists wallet_addresses_admin_all on public.wallet_addresses;
create policy wallet_addresses_admin_all
on public.wallet_addresses
for all
using (public.is_admin())
with check (public.is_admin());

-- Platform settings policies
drop policy if exists platform_settings_select_public on public.platform_settings;
create policy platform_settings_select_public
on public.platform_settings
for select
using (true);

drop policy if exists platform_settings_admin_all on public.platform_settings;
create policy platform_settings_admin_all
on public.platform_settings
for all
using (public.is_admin())
with check (public.is_admin());

-- Contact message policies
drop policy if exists contact_messages_insert_public on public.contact_messages;
create policy contact_messages_insert_public
on public.contact_messages
for insert
with check (true);

drop policy if exists contact_messages_admin_all on public.contact_messages;
create policy contact_messages_admin_all
on public.contact_messages
for all
using (public.is_admin())
with check (public.is_admin());

-- Activity logs policies
drop policy if exists activity_logs_select_own_or_admin on public.activity_logs;
create policy activity_logs_select_own_or_admin
on public.activity_logs
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists activity_logs_insert_admin on public.activity_logs;
create policy activity_logs_insert_admin
on public.activity_logs
for insert
with check (public.is_admin() or user_id = auth.uid());

drop policy if exists activity_logs_admin_all on public.activity_logs;
create policy activity_logs_admin_all
on public.activity_logs
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
      processed_at = now(),
      updated_at = now()
  where id = transaction_id;

  insert into public.activity_logs (user_id, action, entity_type, entity_id, changes)
  values (
    auth.uid(),
    'approve_transaction',
    'transaction',
    transaction_id::text,
    jsonb_build_object(
      'target_user_id', tx.user_id,
      'type', tx.type,
      'amount', tx.amount
    )
  );
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
      processed_at = now(),
      updated_at = now()
  where id = transaction_id;

  insert into public.activity_logs (user_id, action, entity_type, entity_id, changes)
  values (
    auth.uid(),
    'reject_transaction',
    'transaction',
    transaction_id::text,
    jsonb_build_object(
      'target_user_id', tx.user_id,
      'type', tx.type,
      'amount', tx.amount
    )
  );
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
