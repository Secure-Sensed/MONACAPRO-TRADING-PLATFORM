-- Migration: Add enhanced fields to existing tables
-- Run this in Supabase SQL editor if you have existing data

-- Add new columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS two_factor_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": true}'::jsonb,
ADD COLUMN IF NOT EXISTS last_login timestamptz;

-- Add constraint if not exists (you may need to do this separately)
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_kyc_status_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_kyc_status_check CHECK (kyc_status in ('pending', 'verified', 'rejected'));

-- Add new columns to traders
ALTER TABLE public.traders
ADD COLUMN IF NOT EXISTS win_rate_percent numeric(5,2),
ADD COLUMN IF NOT EXISTS monthly_return numeric(14,2),
ADD COLUMN IF NOT EXISTS max_drawdown numeric(5,2),
ADD COLUMN IF NOT EXISTS avg_trade_duration interval,
ADD COLUMN IF NOT EXISTS total_volume_managed numeric(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating numeric(3,2),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add constraints to traders
ALTER TABLE public.traders
DROP CONSTRAINT IF EXISTS traders_win_rate_percent_check;

ALTER TABLE public.traders
DROP CONSTRAINT IF EXISTS traders_rating_check;

ALTER TABLE public.traders
ADD CONSTRAINT traders_win_rate_percent_check CHECK (win_rate_percent >= 0 AND win_rate_percent <= 100),
ADD CONSTRAINT traders_rating_check CHECK (rating >= 0 AND rating <= 5);

-- Add trigger for traders updated_at if not exists
DROP TRIGGER IF EXISTS set_traders_updated_at ON public.traders;
CREATE TRIGGER set_traders_updated_at
BEFORE UPDATE ON public.traders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Add new columns to copy_trades
ALTER TABLE public.copy_trades
ADD COLUMN IF NOT EXISTS allocated_percentage numeric(5,2) DEFAULT 100,
ADD COLUMN IF NOT EXISTS fees_paid numeric(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS leverage_used numeric(5,2) DEFAULT 1,
ADD COLUMN IF NOT EXISTS stop_loss numeric(14,2),
ADD COLUMN IF NOT EXISTS take_profit numeric(14,2),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add constraints to copy_trades
ALTER TABLE public.copy_trades
DROP CONSTRAINT IF EXISTS copy_trades_allocated_percentage_check;

ALTER TABLE public.copy_trades
DROP CONSTRAINT IF EXISTS copy_trades_leverage_check;

ALTER TABLE public.copy_trades
ADD CONSTRAINT copy_trades_allocated_percentage_check CHECK (allocated_percentage > 0 AND allocated_percentage <= 100),
ADD CONSTRAINT copy_trades_leverage_check CHECK (leverage_used > 0 AND leverage_used <= 20);

-- Add trigger for copy_trades updated_at if not exists
DROP TRIGGER IF EXISTS set_copy_trades_updated_at ON public.copy_trades;
CREATE TRIGGER set_copy_trades_updated_at
BEFORE UPDATE ON public.copy_trades
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Add new columns to transactions
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS reference_id text,
ADD COLUMN IF NOT EXISTS crypto_network text,
ADD COLUMN IF NOT EXISTS from_address text,
ADD COLUMN IF NOT EXISTS to_address text,
ADD COLUMN IF NOT EXISTS conversion_rate numeric(14,8),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add conversion_rate constraint
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_conversion_rate_check;

ALTER TABLE public.transactions
ADD CONSTRAINT transactions_conversion_rate_check CHECK (conversion_rate > 0);

-- Add trigger for transactions updated_at if not exists
DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.transactions;
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create activity_logs table if not exists
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  changes jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for activity_logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- Enable RLS on activity_logs if not already enabled
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activity_logs
DROP POLICY IF EXISTS activity_logs_select_own_or_admin ON public.activity_logs;
CREATE POLICY activity_logs_select_own_or_admin
ON public.activity_logs
FOR SELECT
USING (user_id = auth.uid() or public.is_admin());

DROP POLICY IF EXISTS activity_logs_insert_admin ON public.activity_logs;
CREATE POLICY activity_logs_insert_admin
ON public.activity_logs
FOR INSERT
WITH CHECK (public.is_admin() or user_id = auth.uid());

DROP POLICY IF EXISTS activity_logs_admin_all ON public.activity_logs;
CREATE POLICY activity_logs_admin_all
ON public.activity_logs
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Realtime funding workflow hardening
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.profile_protected_values_match(
  target_email text,
  target_role text,
  target_status text,
  target_balance numeric,
  target_kyc_status text,
  target_two_factor_enabled boolean
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.email IS NOT DISTINCT FROM target_email
      AND p.role IS NOT DISTINCT FROM target_role
      AND p.status IS NOT DISTINCT FROM target_status
      AND p.balance IS NOT DISTINCT FROM target_balance
      AND p.kyc_status IS NOT DISTINCT FROM target_kyc_status
      AND p.two_factor_enabled IS NOT DISTINCT FROM target_two_factor_enabled
  );
$$;

ALTER TABLE public.wallet_addresses
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS set_wallets_updated_at ON public.wallet_addresses;
CREATE TRIGGER set_wallets_updated_at
BEFORE UPDATE ON public.wallet_addresses
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid()
  AND public.profile_protected_values_match(
    email,
    role,
    status,
    balance,
    kyc_status,
    two_factor_enabled
  )
);

DROP POLICY IF EXISTS transactions_insert_own ON public.transactions;
CREATE POLICY transactions_insert_own
ON public.transactions
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND type IN ('deposit', 'withdrawal')
  AND status = 'pending'
  AND processed_by IS NULL
  AND processed_at IS NULL
);

DROP POLICY IF EXISTS wallet_addresses_select_public ON public.wallet_addresses;
DROP POLICY IF EXISTS wallet_addresses_select_authenticated ON public.wallet_addresses;
CREATE POLICY wallet_addresses_select_authenticated
ON public.wallet_addresses
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_profiles_role_status ON public.profiles(role, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON public.transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status_type ON public.transactions(status, type);
CREATE INDEX IF NOT EXISTS idx_copy_trades_user_status ON public.copy_trades(user_id, status);

ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.wallet_addresses REPLICA IDENTITY FULL;
ALTER TABLE public.copy_trades REPLICA IDENTITY FULL;
ALTER TABLE public.traders REPLICA IDENTITY FULL;
ALTER TABLE public.plans REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'transactions'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'wallet_addresses'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_addresses';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'copy_trades'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.copy_trades';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'traders'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.traders';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'plans'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.plans';
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_transaction(transaction_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tx record;
  current_balance numeric;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  SELECT * INTO tx
  FROM public.transactions
  WHERE id = transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  IF tx.status <> 'pending' THEN
    RAISE EXCEPTION 'Transaction already processed';
  END IF;

  SELECT balance INTO current_balance
  FROM public.profiles
  WHERE id = tx.user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF tx.type = 'deposit' THEN
    UPDATE public.profiles
    SET balance = current_balance + tx.amount,
        updated_at = now()
    WHERE id = tx.user_id;
  ELSIF tx.type = 'withdrawal' THEN
    IF current_balance - tx.amount < 0 THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
    UPDATE public.profiles
    SET balance = current_balance - tx.amount,
        updated_at = now()
    WHERE id = tx.user_id;
  END IF;

  UPDATE public.transactions
  SET status = 'completed',
      processed_by = auth.uid(),
      processed_at = now(),
      updated_at = now()
  WHERE id = transaction_id;

  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, changes)
  VALUES (
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
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_transaction(transaction_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tx record;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  SELECT * INTO tx
  FROM public.transactions
  WHERE id = transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  IF tx.status <> 'pending' THEN
    RAISE EXCEPTION 'Transaction already processed';
  END IF;

  UPDATE public.transactions
  SET status = 'rejected',
      processed_by = auth.uid(),
      processed_at = now(),
      updated_at = now()
  WHERE id = transaction_id;

  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, changes)
  VALUES (
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
END;
$$;

-- Backfill old Supabase Auth users into profiles and list Auth users for the admin dashboard.
CREATE OR REPLACE FUNCTION public.sync_auth_users_to_profiles()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  inserted_count integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    au.created_at,
    now()
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE p.id IS NULL
  ON CONFLICT (id) DO NOTHING;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    au.id AS user_id,
    COALESCE(p.email, au.email) AS email,
    COALESCE(p.full_name, au.raw_user_meta_data->>'full_name', '') AS full_name,
    COALESCE(p.role, 'user') AS role,
    COALESCE(p.status, 'active') AS status,
    COALESCE(p.balance, 0) AS balance,
    p.phone,
    p.country,
    p.picture,
    COALESCE(p.kyc_status, 'pending') AS kyc_status,
    COALESCE(p.two_factor_enabled, false) AS two_factor_enabled,
    COALESCE(p.notification_preferences, '{"email": true, "push": true}'::jsonb) AS notification_preferences,
    p.last_login,
    au.created_at AS auth_created_at,
    au.last_sign_in_at,
    au.email_confirmed_at,
    (p.id IS NOT NULL) AS profile_exists,
    COALESCE(p.created_at, au.created_at) AS created_at,
    p.updated_at
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  ORDER BY COALESCE(p.created_at, au.created_at) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_auth_users_to_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;

-- Admin website controls and contact inbox
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id text PRIMARY KEY DEFAULT 'default',
  platform_name text NOT NULL DEFAULT 'Monacap Trading Pro',
  support_email text NOT NULL DEFAULT 'support@monacaptradingpro.com',
  support_phone text NOT NULL DEFAULT '+1 (800) 555-0123',
  support_address text NOT NULL DEFAULT '123 Financial District, Sydney, NSW 2000, Australia',
  min_deposit numeric(14,2) NOT NULL DEFAULT 250,
  min_withdrawal numeric(14,2) NOT NULL DEFAULT 100,
  max_withdrawal numeric(14,2) NOT NULL DEFAULT 100000,
  max_leverage text NOT NULL DEFAULT '1:2000',
  registrations_enabled boolean NOT NULL DEFAULT true,
  deposits_enabled boolean NOT NULL DEFAULT true,
  withdrawals_enabled boolean NOT NULL DEFAULT true,
  copy_trading_enabled boolean NOT NULL DEFAULT true,
  maintenance_mode boolean NOT NULL DEFAULT false,
  announcement text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_platform_settings_updated_at ON public.platform_settings;
CREATE TRIGGER set_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.platform_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages
DROP CONSTRAINT IF EXISTS contact_messages_status_check;

ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_status_check
CHECK (status in ('new', 'in_progress', 'resolved', 'archived'));

DROP TRIGGER IF EXISTS set_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER set_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON public.contact_messages(status, created_at DESC);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings REPLICA IDENTITY FULL;
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;

DROP POLICY IF EXISTS platform_settings_select_public ON public.platform_settings;
CREATE POLICY platform_settings_select_public
ON public.platform_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS platform_settings_admin_all ON public.platform_settings;
CREATE POLICY platform_settings_admin_all
ON public.platform_settings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS contact_messages_insert_public ON public.contact_messages;
CREATE POLICY contact_messages_insert_public
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS contact_messages_admin_all ON public.contact_messages;
CREATE POLICY contact_messages_admin_all
ON public.contact_messages
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'platform_settings'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_settings';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_messages'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages';
    END IF;
  END IF;
END;
$$;
