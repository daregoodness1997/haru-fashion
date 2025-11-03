# Email Configuration for Vercel Deployment

## Summary of Changes

### 1. **Updated to Promise-based API** (Critical for Vercel)
- ✅ Removed all callback functions from `transporter.verify()` and `transporter.sendMail()`
- ✅ Using native Promise API: `await transporter.sendMail()` instead of callbacks
- ✅ This prevents serverless functions from terminating before callbacks execute

### 2. **Switched from Port 465 to Port 587**
- ✅ Port 587 (STARTTLS) works better in serverless environments
- ✅ Port 465 (implicit SSL) is often blocked by cloud providers
- ❌ Port 465 can cause timeout issues on Vercel

### 3. **Added Runtime Configuration**
- ✅ Added `export const config = { runtime: "nodejs" }` to API routes
- ✅ Ensures functions run in Node.js runtime (not Edge)
- ✅ Nodemailer requires Node.js stream module

### 4. **Optimized Transporter Settings**
```javascript
{
  secure: false,              // false for port 587
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  pool: true,                 // Connection pooling
  maxConnections: 5,
  maxMessages: 10
}
```

## Vercel Environment Variables

**Required in Vercel Dashboard → Settings → Environment Variables:**

```bash
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=admin@lumenware.com.ng
EMAIL_PASSWORD=eeQnKP4CnExs
ADMIN_EMAIL=goodness.dare@lumenware.com.ng
SUPPORT_EMAIL=admin@lumenware.com.ng
```

## Testing

### Local Testing
```bash
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com"}'
```

### Production Testing (Vercel)
```bash
curl -X POST https://your-app.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com"}'
```

## Troubleshooting

### Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to "Functions" tab
4. Look for the API route logs
5. Check for emoji markers:
   - 📧 Attempting to send
   - 🔍 Verifying connection
   - ✅ Success
   - ❌ Error

### Common Issues

**Timeout Error:**
- ✅ Make sure using port 587 (not 465)
- ✅ Check environment variables are set in Vercel
- ✅ Verify SMTP credentials are correct

**Connection Refused:**
- ✅ Ensure using `runtime: "nodejs"` in API route
- ✅ Check if email provider allows connections from Vercel IPs
- ✅ Verify firewall settings on email provider

**Callback Never Executes:**
- ✅ Use Promise API (no callbacks)
- ✅ Always `await transporter.sendMail()`
- ✅ Don't use callback parameter

## Files Modified

1. `/lib/emailService.ts` - Updated to Promise-based API
2. `/pages/api/v1/orders.ts` - Added runtime config
3. `/pages/api/test-email.ts` - New test endpoint
4. `/.env` - Changed EMAIL_PORT from 465 to 587

## Next Steps

1. ✅ Commit changes to Git
2. ✅ Push to trigger Vercel deployment
3. ✅ Update environment variables in Vercel
4. ✅ Test using `/api/test-email` endpoint
5. ✅ Check Vercel function logs for detailed output

## Alternative: Use Resend or SendGrid

If issues persist, consider using dedicated email services:

### Resend (Recommended for Vercel)
```bash
npm install resend
```

### SendGrid
```bash
npm install @sendgrid/mail
```

Both have better Vercel integration and don't require SMTP configuration.
