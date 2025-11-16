# Brevo Email Setup Guide

This project now uses **Brevo (formerly Sendinblue)** API for sending transactional emails. Brevo is more reliable for serverless deployments like Vercel compared to SMTP.

## Why Brevo?

- ✅ **RESTful API** - No SMTP connection issues on serverless
- ✅ **Reliable** - Better deliverability and uptime
- ✅ **Free Tier** - 300 emails/day free forever
- ✅ **Easy Setup** - Just an API key needed
- ✅ **Email Analytics** - Track opens, clicks, and delivery

## Setup Steps

### 1. Create Brevo Account

1. Go to [Brevo.com](https://www.brevo.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Brevo dashboard
2. Go to **Settings** → **SMTP & API**
3. Click on **API Keys** tab
4. Click **Generate a new API key**
5. Give it a name (e.g., "Shunapee Production")
6. Copy the API key (save it securely - you won't see it again!)

### 3. Configure Sender Email

1. In Brevo dashboard, go to **Senders & IPs** → **Senders**
2. Add and verify your sender email (e.g., noreply@yourdomain.com)
3. Follow the verification steps (you'll need to verify via email link)

### 4. Add Environment Variables

Add these to your `.env.local` file:

```env
# Brevo Email Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Shunapee Fashion House
```

### 5. Add to Vercel

Add the same environment variables to your Vercel project:

```bash
vercel env add BREVO_API_KEY
vercel env add BREVO_SENDER_EMAIL
vercel env add BREVO_SENDER_NAME
```

Or add them via Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable for Production, Preview, and Development

## Testing

Test your email setup:

```bash
# Using the existing test script (update it for Brevo)
node test-email.js
```

Or test via API endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Test User","email":"test@example.com","password":"password123"}'
```

## Email Features

The service sends these emails:

1. **Welcome Email** - When new users register
2. **Order Confirmation** - When orders are placed
3. **Order Status Updates** - When order status changes
4. **Admin Notifications** - For new users and orders

## Brevo Free Tier Limits

- 300 emails/day free
- Up to 9,000 emails/month free
- All features included (API, SMTP, automation)

If you need more, upgrade to a paid plan starting at $25/month for 20,000 emails.

## Troubleshooting

### "Brevo email configuration missing" error
- Check that `BREVO_API_KEY` is set
- Check that `BREVO_SENDER_EMAIL` is set
- Verify environment variables are loaded

### "Brevo API error: Unauthorized" 
- Your API key is invalid or expired
- Generate a new API key from Brevo dashboard

### "Sender email not verified"
- Go to Brevo dashboard → Senders
- Verify your sender email address
- Use the verified email in `BREVO_SENDER_EMAIL`

### Emails not being received
- Check spam folder
- Verify sender email is verified in Brevo
- Check Brevo dashboard for delivery logs
- Ensure you haven't exceeded daily limit (300/day)

## Migration from SMTP

The old SMTP configuration used these variables (no longer needed):
- ~~EMAIL_HOST~~ → Not needed
- ~~EMAIL_PORT~~ → Not needed
- ~~EMAIL_PASSWORD~~ → Not needed
- ~~EMAIL_USER~~ → Can be used as fallback for BREVO_SENDER_EMAIL

You can remove nodemailer from package.json if not used elsewhere:
```bash
npm uninstall nodemailer @types/nodemailer
```

## API Documentation

For advanced usage, see [Brevo API Docs](https://developers.brevo.com/docs)

## Support

- Brevo Support: support@brevo.com
- Brevo Status: https://status.brevo.com/
