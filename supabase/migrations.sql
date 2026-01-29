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
