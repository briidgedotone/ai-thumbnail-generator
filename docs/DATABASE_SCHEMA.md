# YTZA Database Schema Documentation

## Overview

This document describes the database schema for the YTZA (AI YouTube Thumbnail Generator) application. The database is hosted on Supabase (PostgreSQL) and consists of 4 main tables that handle user management, project storage, credit tracking, and purchase history.

## Database Tables

### 1. `profiles` Table

**Purpose**: Stores user profile information linked to Supabase Auth users.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | - | Primary key, references auth.users.id |
| `full_name` | `text` | YES | - | User's full name |
| `email` | `text` | YES | - | User's email address |
| `created_at` | `timestamp with time zone` | YES | `now()` | Profile creation timestamp |
| `updated_at` | `timestamp with time zone` | YES | `now()` | Last profile update timestamp |

**Constraints:**
- Primary Key: `id`

**Indexes:**
- `profiles_pkey` (UNIQUE): `id`

---

### 2. `projects` Table

**Purpose**: Stores user-generated thumbnail projects with associated metadata.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key, unique project identifier |
| `user_id` | `uuid` | YES | - | Foreign key to profiles.id |
| `selected_style_id` | `text` | YES | - | Thumbnail style (beast-style, minimalist-style, etc.) |
| `thumbnail_storage_path` | `text` | YES | - | URL/path to generated thumbnail image |
| `generated_yt_title` | `text` | YES | - | AI-generated YouTube video title |
| `generated_yt_description` | `text` | YES | - | AI-generated YouTube video description |
| `generated_yt_tags` | `text` | YES | - | AI-generated YouTube tags (comma-separated) |
| `created_at` | `timestamp without time zone` | YES | `CURRENT_TIMESTAMP` | Project creation timestamp |
| `updated_at` | `timestamp without time zone` | YES | `CURRENT_TIMESTAMP` | Last project update timestamp |

**Constraints:**
- Primary Key: `id`
- Foreign Key: `user_id` → `profiles.id`

**Indexes:**
- `projects_pkey` (UNIQUE): `id`

**Style IDs:**
- `beast-style`: High-energy, bold thumbnail style
- `minimalist-style`: Clean, simple thumbnail style
- `cinematic-style`: Movie-like, dramatic thumbnail style
- `clickbait-style`: Attention-grabbing thumbnail style

---

### 3. `user_credits` Table

**Purpose**: Tracks user credit balances and subscription tiers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `user_id` | `uuid` | NO | - | Primary key, references profiles.id |
| `balance` | `numeric` | NO | - | Current credit balance |
| `last_refilled_at` | `timestamp without time zone` | YES | - | Last time credits were refilled |
| `subscription_tier` | `varchar(50)` | YES | `NULL` | User's subscription tier |
| `updated_at` | `timestamp without time zone` | YES | `CURRENT_TIMESTAMP` | Last balance update timestamp |

**Constraints:**
- Primary Key: `user_id`

**Indexes:**
- `user_credits_pkey` (UNIQUE): `user_id`

**Subscription Tiers:**
- `free`: 3 credits (one-time allocation)
- `pro`: 50 credits + lifetime Pro features ($29 one-time payment)
- `studio`: Custom enterprise tier (contact sales)

---

### 4. `user_purchases` Table

**Purpose**: Records all user purchases and payment transactions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key, unique purchase identifier |
| `user_id` | `uuid` | YES | - | References profiles.id |
| `stripe_session_id` | `text` | NO | - | Stripe checkout session ID |
| `amount_cents` | `integer` | NO | - | Purchase amount in cents |
| `credits_added` | `integer` | NO | - | Number of credits added to user account |
| `purchase_type` | `text` | NO | - | Type of purchase (e.g., 'pro_plan') |
| `created_at` | `timestamp with time zone` | YES | `now()` | Purchase timestamp |
| `payment_method_last4` | `text` | YES | - | Last 4 digits of payment method |
| `receipt_url` | `text` | YES | - | Stripe receipt URL |

**Constraints:**
- Primary Key: `id`

**Indexes:**
- `user_purchases_pkey` (UNIQUE): `id`

**Purchase Types:**
- `pro_plan`: One-time Pro plan purchase ($29, 50 credits)

---

## Relationships

```
profiles (1) ←→ (many) projects
profiles (1) ←→ (1) user_credits
profiles (1) ←→ (many) user_purchases
```

### Foreign Key Relationships

1. **projects.user_id** → **profiles.id**
   - Each project belongs to one user
   - Users can have multiple projects

2. **user_credits.user_id** → **profiles.id** (implicit)
   - Each user has one credit record
   - One-to-one relationship

3. **user_purchases.user_id** → **profiles.id** (implicit)
   - Each purchase belongs to one user
   - Users can have multiple purchases

---

## Data Flow

### User Registration
1. User signs up via Supabase Auth
2. Profile record created in `profiles` table
3. Initial credit record created in `user_credits` table (3 free credits)

### Project Creation
1. User generates thumbnail via AI
2. Credit deducted from `user_credits.balance`
3. Project saved to `projects` table with generated content
4. Thumbnail image stored in Supabase Storage

### Purchase Flow
1. User initiates Pro plan purchase
2. Stripe checkout session created
3. Payment processed via Stripe
4. Purchase recorded in `user_purchases` table
5. Credits added to `user_credits.balance`
6. Subscription tier updated to 'pro'

### Credit Management
- Credits are deducted for each AI generation
- Failed generations automatically refund credits
- Pro users get 50 credits with lifetime access
- No recurring subscriptions (one-time payments only)

---

## Storage

### Supabase Storage Buckets

**thumbnails** bucket:
- Stores generated thumbnail images
- Public read access
- Files named: `thumbnail-{timestamp}.png`
- Referenced via `projects.thumbnail_storage_path`

---

## Security & Access Control

### Row Level Security (RLS)
- All tables should have RLS enabled
- Users can only access their own data
- Policies based on `auth.uid()` matching `user_id`

### API Access
- Server-side operations use service role key
- Client-side operations use anon key with RLS
- Authentication handled via Supabase Auth middleware

---

## Migration Scripts

### Initial Setup
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own credits" ON user_credits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);
```

### Indexes for Performance
```sql
-- Add indexes for common queries
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX idx_user_purchases_created_at ON user_purchases(created_at DESC);
```

---

## Backup & Maintenance

### Backup Strategy
- Supabase provides automated daily backups
- Point-in-time recovery available
- Export capabilities for data migration

### Monitoring
- Monitor table sizes and growth
- Track credit usage patterns
- Monitor failed transactions

---

## Environment Variables Required

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

*Last Updated: $(date)*
*Schema Version: 1.0* 