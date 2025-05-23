# YTZA Credit System - Complete Workflow (One-Time Payment Model)

## 📋 Overview
This document outlines the complete credit system workflow for YTZA, from user signup to credit management and purchasing additional credits. **Updated for one-time payment model.**

## 🚀 User Journey & Credit Workflow

### 1. User Signup & Initial Setup

#### Step 1: Authentication
- User signs up via Supabase Auth (email/password or OAuth)
- User record created in `auth.users` table
- User redirected to `/select-plan` page

#### Step 2: Plan Selection
- User chooses between **Free**, **Pro**, or **Studio** plans
- **Free Plan**: 3 credits allocated immediately
- **Pro Plan**: Redirects to Stripe checkout for **one-time payment**
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

**Pro Plan Payment (One-time):**
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
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'pro'
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### Credit Limits by Plan
- **Free Plan**: 3 credits (one-time allocation)
- **Pro Plan**: 50 credits (one-time allocation, lifetime access)
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
3. **Modal Display**: Shows appropriate modal based on user tier
4. **Options Presented**:
   - **Free Users**: Upgrade to Pro OR buy credit packs
   - **Pro Users**: Buy additional credit packs

#### Insufficient Credits Modal
- Shows current credit count (0)
- Explains Pro plan benefits (50 credits/month)
- Provides upgrade path via Stripe

### 6. Credit Replenishment & Management

#### Free Plan Users
- **Cannot refill credits manually**
- Must purchase Pro upgrade for $29 (gets Pro tier + 50 credits)

#### Pro Plan Users (Lifetime)
- **No monthly reset** - credits are purchased as needed
- **Purchase 50 More Credits**: $29 for 50 additional credits
- **Lifetime Pro Features**: Always have access to Pro features

#### Credit Purchase Process (Same for Both Tiers)
1. User clicks "Buy Credits" or "Upgrade" from insufficient credits modal
2. Redirected to Stripe checkout session ($29 one-time payment)
3. Payment processed by Stripe
4. Payment verification determines action based on current tier:
   ```javascript
   // Free User Payment
   {
     subscription_tier: "pro",
     balance: 50  // New Pro user gets 50 credits
   }
   
   // Pro User Payment  
   {
     subscription_tier: "pro", 
     balance: existingBalance + 50  // Add 50 to current balance
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

// Payment Verification (Handles Both Upgrade and Credit Purchase)
POST /api/verify-payment
Body: { sessionId: "stripe_session_id" }
Result: 
- Free users: Sets balance to 50, tier to "pro"
- Pro users: Adds 50 to existing balance, tier stays "pro"

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

### 9. Benefits of Simplified System

#### Single Product Strategy
- **One Stripe Product**: Reduces complexity in payment processing
- **Consistent Pricing**: $29 always gets 50 credits, regardless of user tier
- **Simplified UI**: Same modal flow for all users
- **Clear Value Proposition**: Easy to understand for users

#### User Experience Benefits
- **Free Users**: Clear upgrade path with immediate value (Pro features + credits)
- **Pro Users**: Simple credit replenishment without tier confusion
- **No Decision Fatigue**: Only one purchase option to consider

---

## 📊 Summary

**Credit Allocation:**
- Free: 3 credits (one-time)
- Pro: 50 credits (one-time) + lifetime Pro features

**Credit Usage:**
- 1 credit per thumbnail generation/regeneration
- Real-time deduction and display updates

**Replenishment Methods:**
- Free: Purchase Pro upgrade ($29) → Get Pro tier + 50 credits
- Pro: Purchase 50 more credits ($29) → Add 50 to existing balance

**Payment Model:**
- **One-time payments only** (no recurring subscriptions)
- **Single price point**: $29 for 50 credits (regardless of user tier)
- Pro plan gives lifetime access to Pro features
- Same checkout flow for both free and pro users

This system provides better value for users (lifetime access) and simpler billing management while maintaining clear upgrade paths and credit monetization. 