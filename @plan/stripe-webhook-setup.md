# 🔗 Stripe Webhook Setup Guide for YTZA

## Step 1: Access Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** for development (or Live mode for production)
3. Navigate to **Developers** → **Webhooks**

## Step 2: Create a New Webhook Endpoint

1. Click **"Add endpoint"**
2. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - For development: `http://localhost:3000/api/webhooks/stripe`
   - For production: `https://yourdomain.com/api/webhooks/stripe`

## Step 3: Select Events to Listen For

Select these events (relevant to YTZA's payment system):
- ✅ `checkout.session.completed` - When payment is successful
- ✅ `payment_intent.succeeded` - When payment intent succeeds
- ✅ `payment_intent.payment_failed` - When payment fails
- ✅ `invoice.payment_succeeded` - For subscription payments
- ✅ `customer.subscription.created` - When subscription is created
- ✅ `customer.subscription.updated` - When subscription changes
- ✅ `customer.subscription.deleted` - When subscription is cancelled

## Step 4: Get the Webhook Secret

1. After creating the webhook, click on it
2. Go to **"Signing secret"** section
3. Click **"Reveal"** to show the secret
4. Copy the secret (starts with `whsec_...`)

## Step 5: Add to Environment Variables

Add this line to your `.env.local` file:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

## Step 6: Create Webhook Handler (if not exists)

The webhook endpoint should be at `src/app/api/webhooks/stripe/route.ts`

## Step 7: Test the Webhook

1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Or use the **"Send test webhook"** feature in Stripe Dashboard

## Security Notes

- ⚠️ **Never expose webhook secrets in client-side code**
- 🔒 **Always verify webhook signatures in your API handler**
- 🔄 **Use different webhook secrets for test and live modes**
- 📝 **Keep track of which webhooks are for which environment**

## Production Checklist

- [ ] Development webhook created and secret added to .env.local
- [ ] Production webhook created with production domain
- [ ] Production webhook secret configured in hosting platform
- [ ] Webhook handler properly verifies signatures
- [ ] Test webhook events work correctly 