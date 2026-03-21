# Database Schema Migration Guide

## The Error
You're getting `ERROR: 42703: column "kyc_status" does not exist` because the updated schema hasn't been applied to your Supabase database yet.

## How to Fix

### Option 1: Fresh Database Setup (Recommended if starting fresh)
1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "Run"

### Option 2: Migrate Existing Database (Safer - preserves existing data)
1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and paste the contents of `migrations.sql`
4. Click "Run"

This will add all new columns to your existing tables without losing any data.

## What Was Added

### Profiles Table
- `kyc_status` - KYC verification status (pending/verified/rejected)
- `two_factor_enabled` - 2FA flag
- `notification_preferences` - User notification settings (JSON)
- `last_login` - Track last login time

### Traders Table
- `win_rate_percent` - Win rate as percentage (0-100)
- `monthly_return` - Monthly return metric
- `max_drawdown` - Maximum drawdown percentage
- `avg_trade_duration` - Average trade duration
- `total_volume_managed` - Total volume under management
- `rating` - Trader rating (0-5 stars)
- `updated_at` - Auto-updated timestamp

### Copy Trades Table
- `allocated_percentage` - Percentage of balance allocated (0-100)
- `leverage_used` - Leverage used (1-20x)
- `fees_paid` - Cumulative fees on this copy
- `stop_loss` - Stop-loss price/percentage
- `take_profit` - Take-profit price/percentage
- `updated_at` - Auto-updated timestamp

### Transactions Table
- `reference_id` - External transaction reference
- `crypto_network` - Blockchain network (ethereum, polygon, etc)
- `from_address` - Source address for transfers
- `to_address` - Destination address for transfers
- `conversion_rate` - Currency conversion rate
- `updated_at` - Auto-updated timestamp

### New Activity Logs Table
- Complete audit trail of user actions
- Tracks changes to entities
- Includes IP address and user agent
- Indexed for performance

## After Migration

Once you've run the migration script, your error should be resolved. Your Supabase database will now support all the enhanced features defined in the schema.
