# Supabase setup (Monacap Trading Pro)

## 1) Create project
Create a new Supabase project and open the SQL editor.

## 2) Run schema
Run `supabase/schema.sql` first (enables extensions, tables, RLS, RPCs, triggers).

## 3) Seed (optional)
Run `supabase/seed.sql` to load default traders, plans, and wallet addresses.

## 4) Frontend env
Create `frontend/.env.local` with:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5) Admin users
Admin access is based on `profiles.role = 'admin'`.
After creating an admin account, run:
```
update public.profiles set role = 'admin' where email = 'admin@monacaptradingpro.com';
```

## 6) Auth emails (signup + login notifications)
Supabase will send **email confirmation** by default for new signups.
For additional **welcome + login notifications**, deploy the Edge Function:

Optional: configure custom SMTP in Supabase Dashboard → Auth → SMTP Settings
to send confirmation/recovery emails from your own domain.

1. Set function secrets in Supabase:
   - `RESEND_API_KEY` (your Resend API key)
   - `FROM_EMAIL` (e.g. `no-reply@monacaptradingpro.com`)
2. Deploy the function `send-auth-email` from `supabase/functions/send-auth-email`.

CLI example:
```
supabase secrets set RESEND_API_KEY=... FROM_EMAIL=...
supabase functions deploy send-auth-email
```

The frontend calls this function automatically after signup/login.

## 7) Data migration (existing Postgres)
If you already have data in the old database:

- Tables you can migrate directly: `traders`, `plans`, `wallet_addresses`, `transactions`, `copy_trades`.
- `profiles` can be migrated, but **auth users must exist in Supabase** first because `profiles.id` references `auth.users.id`.
- Password hashes from the old system are **not** compatible with Supabase Auth. Users will need to reset passwords or be re-created in Supabase Auth.

Typical flow:
1. Create/import users in Supabase Auth (so each user has an `auth.users.id`).
2. Insert matching rows into `public.profiles` with the same `id` values.
3. Import data tables (transactions/copy_trades/etc.).

Example data-only export (adjust connection and table list):
```
pg_dump --data-only --table=traders --table=plans --table=wallet_addresses --table=transactions --table=copy_trades \
  postgres://USER:PASSWORD@HOST:PORT/DATABASE > data.sql
```
Then run `data.sql` against Supabase.

Note: `transactions.user_id` and `copy_trades.user_id` must match existing `profiles.id`.
