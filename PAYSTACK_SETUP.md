# Paystack Payment Integration Guide

## Overview
Paystack payment integration has been added to the checkout page, allowing customers to pay securely with their debit/credit cards.

## Features Added

### 1. Checkout Page Integration
- Added Paystack as a payment option alongside Cash on Delivery and Bank Transfer
- Integrated Paystack Inline popup for seamless payment experience
- Automatic currency conversion (USD to NGN) for Paystack transactions
- Payment processing indicator and status handling

### 2. Payment Flow
1. Customer selects "Pay with Paystack" option
2. Fills in delivery and contact information
3. Clicks "Pay with Paystack" button
4. **Order is created with status "pending_payment"**
5. Paystack popup opens with secure payment form
6. Customer enters card details
7. Payment is processed by Paystack
8. **On success:**
   - Order status updated to "paid"
   - Payment reference stored
   - Order confirmation shown
   - Cart cleared
9. **On cancellation:**
   - Order remains in "pending_payment" status
   - "Retry Payment" button shown
   - Customer can retry without creating new order

### 3. Currency Handling
- Paystack only accepts NGN (Nigerian Naira)
- Automatic conversion: 1 USD = 1650 NGN
- Amount converted to Kobo (smallest NGN unit): 1 NGN = 100 Kobo
- Example: $100 → ₦165,000 → 16,500,000 Kobo

## Setup Instructions

### Step 1: Create Paystack Account
1. Visit [https://paystack.com](https://paystack.com)
2. Click "Get Started" and create an account
3. Verify your email address
4. Complete your business profile

### Step 2: Get API Keys
1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

**Important:** 
- Use **Test Keys** for development (`pk_test_` and `sk_test_`)
- Use **Live Keys** for production (`pk_live_` and `sk_live_`)

### Step 3: Configure Environment Variables

Add the following to your `.env` file:

```bash
# Paystack Payment Integration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_public_key_here"
PAYSTACK_SECRET_KEY="sk_test_your_secret_key_here"
```

**For Production (Vercel):**
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add both variables with your **Live Keys**

### Step 4: Test the Integration

#### Using Test Cards
Paystack provides test cards for development:

**Successful Transaction:**
- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Transaction:**
- Card Number: `5060666666666666666`
- CVV: Any
- Expiry: Any future date

More test cards: [Paystack Test Cards](https://paystack.com/docs/payments/test-payments/#test-cards)

## Technical Implementation

### Files Modified

#### 1. `pages/checkout.tsx`
**Changes:**
- Added `PAYSTACK` to `PaymentType`
- Added Paystack payment option UI
- Implemented `handlePaystackPayment()` function
- Added currency conversion utilities
- Updated Place Order button logic
- Added Paystack script to Head

**Key Functions:**
```typescript
// Convert USD to NGN
const convertUSDToNGN = (usdAmount: number) => {
  const exchangeRate = 1650; // 1 USD = 1650 NGN
  return usdAmount * exchangeRate;
};

// Convert NGN to Kobo (Paystack smallest unit)
const convertToKobo = (amount: number) => {
  return Math.round(amount * 100);
};

// Handle Paystack Payment
const handlePaystackPayment = () => {
  // Opens Paystack popup with transaction details
  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amountInKobo,
    currency: "NGN",
    callback: function(response) {
      // Payment successful - create order
    },
    onClose: function() {
      // Payment cancelled
    }
  });
  handler.openIframe();
};
```

#### 2. `.env` and `.env.example`
Added Paystack environment variables

### Payment Metadata
Customer information is sent to Paystack as metadata:
- Customer Name
- Phone Number
- Email Address

This helps with:
- Order tracking
- Customer support
- Fraud prevention
- Payment reconciliation

## Security Best Practices

### 1. API Key Management
✅ **DO:**
- Store keys in environment variables
- Use test keys for development
- Use live keys only in production
- Rotate keys periodically

❌ **DON'T:**
- Commit keys to Git
- Share keys publicly
- Use live keys in development
- Hardcode keys in code

### 2. Public vs Secret Keys
- **Public Key** (`NEXT_PUBLIC_*`): Safe to expose in browser
- **Secret Key**: NEVER expose in frontend, only use in backend

### 3. Payment Verification
Currently, orders are created immediately after payment callback. For production, consider:
- Adding webhook verification
- Verifying payment on backend before creating order
- Implementing idempotency checks

## Testing Checklist

- [ ] Paystack option appears in checkout
- [ ] Can select Paystack payment method
- [ ] Button text changes to "Pay with Paystack"
- [ ] Paystack popup opens on button click
- [ ] Can enter test card details
- [ ] Successful payment creates order
- [ ] Cancelled payment returns to checkout
- [ ] Currency conversion works correctly
- [ ] Order confirmation displays after payment
- [ ] Email notification sent (if enabled)

## Currency Conversion Notes

### Current Implementation
- Exchange Rate: **1 USD = 1650 NGN** (hardcoded)
- This rate should be updated based on current exchange rates

### Recommended Improvements
1. **Dynamic Exchange Rates:**
   ```typescript
   // Fetch from API like exchangerate-api.com
   const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
   const data = await response.json();
   const rate = data.rates.NGN;
   ```

2. **Admin Configuration:**
   - Allow admin to set exchange rate
   - Store in database
   - Update periodically

3. **Multi-Currency Support:**
   - Store rate in context
   - Use consistent rate across app
   - Display converted amount before payment

## Webhook Setup (Recommended for Production)

Webhooks provide server-side payment verification:

### 1. Create Webhook Endpoint
```typescript
// pages/api/paystack-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest('hex');
    
  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
    
    if (event.event === 'charge.success') {
      // Update order status
      // Send confirmation email
    }
  }
  
  res.status(200).end();
}
```

### 2. Configure in Paystack Dashboard
1. Go to **Settings** → **API Keys & Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/paystack-webhook`
3. Select events to receive
4. Save changes

## Troubleshooting

### Issue: Paystack popup not opening
**Solutions:**
- Check browser console for errors
- Verify Paystack script is loaded
- Ensure public key is correct
- Disable ad blockers/popup blockers

### Issue: Payment fails immediately
**Solutions:**
- Check test card details are correct
- Verify amount is in Kobo (multiply by 100)
- Check internet connection
- Use different test card

### Issue: Order not created after payment
**Solutions:**
- Check browser console for API errors
- Verify backend is running
- Check database connection
- Review order creation logs

### Issue: Currency conversion incorrect
**Solutions:**
- Verify exchange rate (currently 1650)
- Check amount calculation in Kobo
- Test with known USD/NGN values

## Production Deployment

### Before Going Live:
1. ✅ Switch to Live API keys
2. ✅ Update environment variables in Vercel
3. ✅ Test with real (small amount) transaction
4. ✅ Set up webhook for payment verification
5. ✅ Update exchange rate to current rate
6. ✅ Enable error logging and monitoring
7. ✅ Test different card types
8. ✅ Verify email notifications work
9. ✅ Check order creation flow
10. ✅ Test refund process

### Compliance Requirements:
- Business registration with Paystack
- Valid business documents
- Bank account for settlement
- Terms of service and refund policy
- Privacy policy
- Contact information

## Support & Resources

- **Paystack Documentation:** https://paystack.com/docs
- **API Reference:** https://paystack.com/docs/api
- **Support:** support@paystack.com
- **Test Cards:** https://paystack.com/docs/payments/test-payments
- **Dashboard:** https://dashboard.paystack.com

## Next Steps

### Recommended Enhancements:
1. **Payment Verification Endpoint**
   - Verify payment on backend before order creation
   - Use Paystack transaction verification API

2. **Webhook Integration**
   - Handle payment success/failure events
   - Update order status automatically

3. **Dynamic Exchange Rates**
   - Fetch current USD to NGN rate
   - Update regularly via cron job

4. **Payment Receipt**
   - Generate PDF receipt
   - Send via email
   - Store in database

5. **Refund Handling**
   - Admin interface for refunds
   - Integration with Paystack refund API

6. **Analytics**
   - Track payment success/failure rates
   - Monitor popular payment methods
   - Revenue reporting

---

**Implementation Complete!** 🎉

Paystack payment is now integrated and ready for testing. Remember to switch to live keys before production deployment.
