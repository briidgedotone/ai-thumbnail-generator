# YTZA Credit System - Complete Workflow

## 📋 Overview
This document outlines the complete credit system workflow for YTZA, from user signup to credit management and refilling.

## 🚀 User Journey & Credit Workflow

### 1. User Signup & Initial Setup

#### Step 1: Authentication
- User signs up via Supabase Auth (email/password or OAuth)
- User record created in `auth.users` table
- User redirected to `/select-plan` page

#### Step 2: Plan Selection
- User chooses between **Free**, **Pro**, or **Studio** plans
- **Free Plan**: 3 credits allocated immediately
- **Pro Plan**: Redirects to Stripe checkout for payment
- **Studio Plan**: Contact sales (custom pricing)

#### Step 3: Credit Allocation
**Free Plan Selection:**
```javascript
// API: /api/select-plan
{
  user_id: "user-uuid",
  subscription_tier: "free",
  balance: 3,
  updated_at: "2024-01-15T10:30:00.000Z"
}
```

**Pro Plan Payment:**
```javascript
// API: /api/verify-payment (after Stripe checkout)
{
  user_id: "user-uuid", 
  subscription_tier: "pro",
  balance: 50,
  updated_at: "2024-01-15T10:30:00.000Z"
}
```

### 2. Credit System Architecture

#### Database Schema (`user_credits` table)
```sql
CREATE TABLE user_credits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### Credit Limits by Plan
- **Free Plan**: 3 credits maximum
- **Pro Plan**: 50 credits maximum
- **Studio Plan**: Custom (handled separately)

### 3. Credit Usage & Deduction

#### Thumbnail Generation Process
1. **Pre-Generation Check** (`/api/generate-thumbnail`)
   ```javascript
   // Check if user has sufficient credits
   const { data: creditsData } = await supabase
     .from('user_credits')
     .select('balance')
     .eq('user_id', user.id)
     .single();
   
   if (creditsData.balance < 1) {
     return error('Insufficient credits');
   }
   ```

2. **Credit Deduction** (Before AI API call)
   ```javascript
   // Deduct 1 credit before generating
   await supabase
     .from('user_credits')
     .update({ balance: creditsData.balance - 1 })
     .eq('user_id', user.id);
   ```

3. **Image Generation**
   - Call OpenAI API with generated prompt
   - Return image URL to frontend
   - Refresh credit display on frontend

#### Regeneration
- Same process as initial generation
- Each regeneration costs 1 credit
- No special handling (treated as new generation)

### 4. Frontend Credit Display

#### Dashboard Credit Counter
```javascript
// Fetches both balance and subscription_tier
const { data: creditsData } = await supabase
  .from('user_credits')
  .select('balance, subscription_tier')
  .eq('user_id', user.id)
  .single();

// Sets correct total based on plan
const totalCredits = tier === 'free' ? 3 : tier === 'pro' ? 50 : 3;
```

#### Real-time Updates
- Credits refresh after each generation/regeneration
- Uses `refreshUserCredits()` callback
- Updates circular progress indicator

### 5. Insufficient Credits Handling

#### When Credits Reach 0
1. **Generation Attempt**: User tries to generate thumbnail
2. **Credit Check**: System checks `balance < 1`
3. **Modal Display**: Shows "Insufficient Credits" modal
4. **Options Presented**:
   - Cancel (close modal)
   - Upgrade to Pro (redirect to pricing)

#### Insufficient Credits Modal
- Shows current credit count (0)
- Explains Pro plan benefits (50 credits/month)
- Provides upgrade path via Stripe

### 6. Credit Refill & Subscription Management

#### Free Plan Users
- **Cannot refill credits manually**
- Must upgrade to Pro for more credits
- Credits reset to 3 upon plan selection

#### Pro Plan Users
- **Monthly Reset**: Credits reset to 50 every billing cycle
- **Subscription Management**: Via Stripe Customer Portal
- **Payment Failure**: Subscription downgrades to Free (3 credits)

#### Upgrade Process (Free → Pro)
1. User clicks "Upgrade" from insufficient credits modal
2. Redirected to Stripe checkout session
3. Payment processed by Stripe
4. Webhook or manual verification updates:
   ```javascript
   {
     subscription_tier: "pro",
     balance: 50
   }
   ```
5. User redirected to `/payment-success`
6. Auto-redirect to dashboard after 3 seconds

### 7. API Endpoints & Credit Operations

#### Core Credit APIs
```javascript
// Plan Selection (Free only)
POST /api/select-plan
Body: { planName: "Free" }
Result: Sets balance to 3, tier to "free"

// Payment Verification (Pro)
POST /api/verify-payment
Body: { sessionId: "stripe_session_id" }
Result: Sets balance to 50, tier to "pro"

// Thumbnail Generation (Deducts 1 credit)
POST /api/generate-thumbnail
Body: { prompt: "generated_prompt" }
Result: Generates image, deducts 1 credit
```

#### Credit Check Utility
```javascript
// Frontend utility
import { checkUserCredits } from '@/utils/credit-utils';

const { hasCredits, currentCredits } = await checkUserCredits();
if (!hasCredits) {
  showInsufficientCreditsModal();
  return;
}
```

### 8. Error Handling & Edge Cases

#### Concurrent Generation Attempts
- Database-level constraints prevent negative balances
- First successful request deducts credit
- Subsequent requests fail with "Insufficient credits"

#### Payment Verification Failures
- User redirected to error page
- Option to retry payment or contact support
- No credits allocated until payment confirmed

#### Subscription Downgrades
- Pro → Free: Balance capped at 3 credits
- Credits above limit preserved until used
- No automatic credit removal

### 9. Future Enhancements

#### Potential Credit System Improvements
1. **Credit Packages**: One-time credit purchases
2. **Rollover Credits**: Unused credits carry to next month
3. **Usage Analytics**: Detailed credit usage tracking
4. **Bulk Discounts**: Reduced cost per credit for high usage
5. **Referral Credits**: Bonus credits for referrals

#### Monitoring & Analytics
- Track credit usage patterns
- Monitor conversion rates (Free → Pro)
- Analyze optimal credit limits
- A/B test pricing strategies

---

## 📊 Summary

**Credit Allocation:**
- Free: 3 credits maximum
- Pro: 50 credits maximum

**Credit Usage:**
- 1 credit per thumbnail generation
- 1 credit per regeneration
- Real-time deduction and display updates

**Refill Methods:**
- Free: Only via plan upgrade
- Pro: Monthly automatic reset

**Zero Credits:**
- Blocks generation attempts
- Shows upgrade modal
- Provides clear upgrade path

This system ensures fair usage, encourages upgrades, and provides a smooth user experience while maintaining clear credit boundaries and progression paths. 