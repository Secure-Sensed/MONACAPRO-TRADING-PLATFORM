-- Optional seed data for traders, plans, and wallet addresses

insert into public.traders (name, image, profit, risk, win_rate)
values
  ('John Martinez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', '+58.24%', 'Medium', '76.71%'),
  ('Sarah Chen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', '+92.15%', 'High', '82.34%'),
  ('Michael Johnson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', '+45.67%', 'Low', '71.23%')
on conflict (name) do nothing;

insert into public.plans (name, price, duration, features, popular)
values
  (
    'Starter',
    500,
    '30 days',
    '["Copy up to 2 traders", "Basic risk management", "Email support", "Market analysis reports"]'::jsonb,
    false
  ),
  (
    'Professional',
    2000,
    '30 days',
    '["Copy up to 5 traders", "Advanced risk management", "Priority support", "Daily market analysis", "Trading signals"]'::jsonb,
    true
  ),
  (
    'Elite',
    5000,
    '30 days',
    '["Copy unlimited traders", "Custom risk management", "24/7 VIP support", "Personal account manager", "Premium trading signals", "Exclusive webinars"]'::jsonb,
    false
  )
on conflict (name) do nothing;

insert into public.wallet_addresses (method, address)
values
  ('bitcoin', '"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"'::jsonb),
  ('ethereum', '"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8"'::jsonb),
  ('usdt_trc20', '"TXYZopYRdj2D9XRtbG4uTdwZjX9c2V4h9q"'::jsonb),
  ('usdt_erc20', '"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8"'::jsonb),
  (
    'bank_transfer',
    '{
      "bank_name": "Chase Bank",
      "account_name": "Monacap Trading Pro LLC",
      "account_number": "1234567890",
      "routing_number": "021000021",
      "swift_code": "CHASUS33"
    }'::jsonb
  ),
  ('paypal', '"payments@monacaptradingpro.com"'::jsonb)
ON CONFLICT (method) DO UPDATE
SET address = EXCLUDED.address,
    updated_at = now();
