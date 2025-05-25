# YTZA Environment Variables Configuration

## Overview

This document lists all environment variables required for the YTZA application to function properly in production.

## Required Environment Variables

### 🔐 Authentication & Database

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 🤖 AI Services

```bash
# OpenAI Configuration (Required for thumbnail generation)
OPENAI_API_KEY=sk-your-openai-api-key

# Google Gemini Configuration (Required for content generation)
GEMINI_API_KEY=your-gemini-api-key
```

### 💳 Payment Processing

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key  # Use sk_test_ for testing
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID_PRO=price_your-pro-plan-price-id  # Stripe price ID for Pro plan
```

### 🌐 Application Configuration

```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com  # Your production domain
NODE_ENV=production  # Set to 'production' for production deployment
```

## Environment Variable Details

### Supabase Variables

| Variable | Purpose | Where to Find |
|----------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side operations | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side operations | Supabase Dashboard → Settings → API |

### AI Service Variables

| Variable | Purpose | Where to Find |
|----------|---------|---------------|
| `OPENAI_API_KEY` | OpenAI API access for DALL-E image generation | OpenAI Platform → API Keys |
| `GEMINI_API_KEY` | Google Gemini API for content generation | Google AI Studio → API Keys |

### Stripe Variables

| Variable | Purpose | Where to Find |
|----------|---------|---------------|
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook endpoint secret for security | Stripe Dashboard → Developers → Webhooks |
| `STRIPE_PRICE_ID_PRO` | Price ID for Pro plan ($29 one-time) | Stripe Dashboard → Products → Pro Plan |

### Application Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_APP_URL` | Your production domain URL | `https://ytza.com` |
| `NODE_ENV` | Environment mode | `production` |

## Setup Instructions

### 1. Create Environment File

For local development:
```bash
# Create .env.local file in project root
touch .env.local
```

For production deployment:
- Set environment variables in your hosting platform (Vercel, Netlify, etc.)

### 2. Configure Each Service

#### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy the URL and keys to your environment variables
4. Set up the database schema (see `DATABASE_SCHEMA.md`)

#### OpenAI Setup
1. Create account at [platform.openai.com](https://platform.openai.com)
2. Generate API key in API Keys section
3. Ensure you have credits/billing set up
4. Add key to environment variables

#### Gemini Setup
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Add key to environment variables

#### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Create a product for "YTZA Pro Plan" ($29 one-time payment)
3. Copy the price ID from the product
4. Set up webhook endpoint pointing to `/api/webhooks/stripe`
5. Copy secret keys and webhook secret

### 3. Verify Configuration

Run this command to check if all required variables are set:

```bash
# Check environment variables (create this script)
node -e "
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_ID_PRO',
  'NEXT_PUBLIC_APP_URL'
];

const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.log('❌ Missing environment variables:');
  missing.forEach(key => console.log('  -', key));
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}
"
```

## Security Notes

### 🔒 Secret Management

- **Never commit** `.env.local` or `.env` files to version control
- Use your hosting platform's environment variable settings for production
- Rotate API keys regularly
- Use different keys for development and production

### 🛡️ Key Permissions

- **Supabase Service Role**: Has full database access - keep secure
- **OpenAI API Key**: Monitor usage to prevent unexpected charges
- **Stripe Secret Key**: Can process payments - extremely sensitive
- **Webhook Secrets**: Verify webhook authenticity

## Deployment Platforms

### Vercel
```bash
# Set environment variables via Vercel CLI
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
# ... etc for all variables
```

### Netlify
```bash
# Set via Netlify CLI
netlify env:set OPENAI_API_KEY "your-key-here"
netlify env:set STRIPE_SECRET_KEY "your-key-here"
# ... etc for all variables
```

### Docker
```dockerfile
# In your Dockerfile or docker-compose.yml
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
# ... etc for all variables
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `NEXT_PUBLIC_APP_URL` matches your actual domain
2. **Payment Failures**: Verify Stripe webhook endpoint is correctly configured
3. **AI Generation Fails**: Check API key validity and account credits
4. **Database Errors**: Verify Supabase keys and RLS policies

### Testing Environment Variables

```bash
# Test API connections
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
curl -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/products
```

---

*Last Updated: $(date)*
*Configuration Version: 1.0* 