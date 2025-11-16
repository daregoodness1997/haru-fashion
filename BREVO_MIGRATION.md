# Migration from SMTP to Brevo API

## Summary of Changes

The email service has been migrated from SMTP (using nodemailer) to **Brevo API** for better reliability on serverless platforms like Vercel.

## What Changed

### Code Changes
- **`lib/emailService.ts`**: Replaced nodemailer SMTP transport with Brevo REST API
- **`test-email.js`**: Updated to test Brevo API instead of SMTP
- **`.env.example`**: Updated to reflect new Brevo environment variables

### Environment Variables

**New (Required):**
```env
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Shunapee Fashion House
```

**Old (No longer needed):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Migration Steps

### 1. Sign up for Brevo
1. Go to https://www.brevo.com/
2. Create a free account (300 emails/day free forever)
3. Verify your email

### 2. Get API Key
1. Log in to Brevo dashboard
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Click **Generate a new API key**
4. Name it (e.g., "Shunapee Production")
5. Copy the API key

### 3. Verify Sender Email
1. Go to **Senders & IPs** → **Senders**
2. Add your sender email (e.g., noreply@yourdomain.com)
3. Verify it via the email link sent by Brevo

### 4. Update Environment Variables

**Local Development (.env.local):**
```env
BREVO_API_KEY=xkeysib-your-actual-api-key-here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Shunapee Fashion House
```

**Vercel:**
```bash
# Add to Vercel via CLI
vercel env add BREVO_API_KEY
vercel env add BREVO_SENDER_EMAIL
vercel env add BREVO_SENDER_NAME

# Or via Vercel Dashboard
# Project Settings → Environment Variables
```

### 5. Remove Old Variables (Optional)
You can remove these from your environment:
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`

Keep these (still used):
- `ADMIN_EMAIL` - for receiving admin notifications
- `SUPPORT_EMAIL` - for customer support

### 6. Test Email Service
```bash
node test-email.js
```

You should see:
```
✅ Test email sent successfully via Brevo!
Message ID: <message-id>
✨ Brevo email system is working correctly!
```

## Benefits of Brevo

1. **No SMTP Connection Issues**: REST API works perfectly on serverless
2. **Better Deliverability**: Brevo has high delivery rates
3. **Free Tier**: 300 emails/day free (9,000/month)
4. **Email Analytics**: Track opens, clicks, and bounces
5. **Reliable**: 99.9% uptime SLA
6. **Fast**: No connection setup overhead

## Rollback (If Needed)

If you need to rollback to SMTP:

1. Keep nodemailer installed:
```bash
npm install nodemailer @types/nodemailer
```

2. Revert `lib/emailService.ts` to the SMTP version (check git history)

3. Add back SMTP environment variables:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Troubleshooting

### Error: "Brevo email configuration missing"
- Check that `BREVO_API_KEY` is set
- Check that `BREVO_SENDER_EMAIL` is set

### Error: "Unauthorized"
- Your API key is invalid or expired
- Generate a new API key from Brevo dashboard

### Emails not being delivered
- Check spam folder
- Verify sender email in Brevo dashboard
- Check Brevo dashboard for delivery logs
- Ensure you haven't hit the 300/day limit

## Support

- Brevo Setup Guide: See `BREVO_SETUP.md`
- Brevo Dashboard: https://app.brevo.com/
- Brevo Docs: https://developers.brevo.com/docs
- Brevo Support: support@brevo.com

## Next Steps

1. ✅ Update environment variables
2. ✅ Test email service with `node test-email.js`
3. ✅ Deploy to Vercel
4. ✅ Test registration and order emails in production
5. ⚠️ Monitor Brevo dashboard for email statistics
6. 💡 Consider upgrading if you need more than 300 emails/day
