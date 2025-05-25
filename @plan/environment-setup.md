# 🔧 Environment Variables Setup for YTZA

## Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

### SUPABASE CONFIGURATION
```bash
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# For server-side operations (if needed)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### AI SERVICES
```bash
# Google Gemini API for content generation
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API for thumbnail generation  
OPENAI_API_KEY=your_openai_api_key_here
```

### PAYMENT PROCESSING
```bash
# Stripe configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Stripe webhook secret for verifying webhook signatures
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### APPLICATION CONFIGURATION
```bash
# Your application's public URL (important for Stripe redirects)
# Development: http://localhost:3000
# Production: https://yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development vs Production

### Development (.env.local)
- Use test Stripe keys (`sk_test_...`, `pk_test_...`)
- Use development Supabase project
- Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### Production
- Use live Stripe keys (`sk_live_...`, `pk_live_...`)
- Use production Supabase project
- Set `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Configure all variables in your hosting platform (Vercel, Netlify, etc.)

## Security Notes
- Never commit `.env*` files to version control
- Use different API keys for development and production
- Regenerate webhook secrets for production
- Keep service role keys secure and only use when necessary

## Verification Checklist
- [ ] All required environment variables are set
- [ ] Supabase connection works
- [ ] Stripe payment flow works
- [ ] AI content generation works
- [ ] AI thumbnail generation works
- [ ] Application URL redirects work properly 