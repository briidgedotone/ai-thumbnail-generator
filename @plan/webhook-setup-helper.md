# 🛠️ Quick Webhook Setup Helper

## What I've Created for You:

✅ **Webhook Handler**: `src/app/api/webhooks/stripe/route.ts`
- Handles payment success/failure events
- Verifies webhook signatures securely
- Updates user subscriptions in Supabase
- Includes comprehensive error handling

## Your Next Steps:

### 1. Get Webhook Secret from Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Developers** → **Webhooks** → **Add endpoint**
3. **Endpoint URL**: `http://localhost:3000/api/webhooks/stripe` (for development)
4. **Events to select**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. **Save** and copy the **signing secret** (starts with `whsec_...`)

### 2. Add to Your .env.local
Open your `.env.local` file and add:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

### 3. Test the Setup
Run this command to test:
```bash
npm run dev
```

The webhook endpoint will be available at: `http://localhost:3000/api/webhooks/stripe`

## Quick Verification Commands:

After adding the webhook secret, run these to verify:

```bash
# Check if webhook secret is loaded
echo "Webhook secret configured: $([ -n "$STRIPE_WEBHOOK_SECRET" ] && echo "✅ Yes" || echo "❌ No")"

# Test build with new webhook handler
npm run build
```

## What This Webhook Handler Does:

- ✅ Verifies webhook signatures for security
- ✅ Handles successful payments
- ✅ Updates user subscription status in Supabase
- ✅ Logs all events for debugging
- ✅ Handles errors gracefully

Ready to add your webhook secret? 🚀 