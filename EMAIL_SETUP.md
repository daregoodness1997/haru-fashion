# 📧 Email Notification System - Shunapee Fashion House Fashion

## Overview
Automated email notification system for user registrations and order placements. Sends professional HTML emails to customers and admin notifications.

---

## ✨ Features

### 1. **Welcome Email (New User Registration)**
- ✅ Sent to new users upon account creation
- 📧 Professional branded welcome message
- 🎯 Call-to-action button to start shopping
- 📋 Account details confirmation

### 2. **Admin Notification (New Registration)**
- ✅ Notifies admin when new users register
- 📊 User details (name, email, registration date)
- 🚀 Helps track user growth

### 3. **Order Confirmation Email (Customer)**
- ✅ Sent to customers after placing an order
- 📦 Order number and details
- 💰 Itemized product list with prices
- 📍 Shipping address confirmation
- 📅 Delivery information

### 4. **Order Notification Email (Admin)**
- ✅ Alerts admin of new orders
- 🛍️ Complete order details
- 👤 Customer information
- 🔗 Direct link to admin panel
- ⚡ Enables quick order processing

---

## 🛠️ Setup Instructions

### Step 1: Email Provider Setup

#### Option A: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create App Password:**
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Shunapee Fashion House Fashion"
   - Copy the 16-character password

3. **Update Environment Variables:**
   ```bash
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_USER="your-gmail@gmail.com"
   EMAIL_PASSWORD="your-16-char-app-password"
   ADMIN_EMAIL="admin@Shunapee Fashion Housefashion.com"
   ```

#### Option B: Other Email Providers

**SendGrid:**
```bash
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASSWORD="your-sendgrid-api-key"
```

**Mailgun:**
```bash
EMAIL_HOST="smtp.mailgun.org"
EMAIL_PORT="587"
EMAIL_USER="your-mailgun-smtp-username"
EMAIL_PASSWORD="your-mailgun-smtp-password"
```

**Outlook/Hotmail:**
```bash
EMAIL_HOST="smtp-mail.outlook.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@outlook.com"
EMAIL_PASSWORD="your-password"
```

### Step 2: Configure Environment Variables

1. **Update `.env` file:**
   ```bash
   # Email Configuration
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   ADMIN_EMAIL="admin@Shunapee Fashion Housefashion.com"
   ```

2. **Update `.env.local` (if using):**
   - Copy the same email configuration

3. **Restart Development Server:**
   ```bash
   npm run dev
   ```

---

## 📨 Email Templates

### 1. Welcome Email
**Triggered:** User registration  
**Recipient:** New user  
**Subject:** "Welcome to Shunapee Fashion House Fashion! 🎉"

**Content:**
- Personalized greeting
- Account confirmation
- What's next (features overview)
- Call-to-action button
- Support contact information

### 2. Admin Registration Notification
**Triggered:** User registration  
**Recipient:** Admin (from ADMIN_EMAIL env)  
**Subject:** "🆕 New User Registration - Shunapee Fashion House Fashion"

**Content:**
- New user's name and email
- Registration timestamp
- User growth metric

### 3. Order Confirmation
**Triggered:** Order placement  
**Recipient:** Customer  
**Subject:** "Order Confirmation #[OrderNumber] - Shunapee Fashion House Fashion"

**Content:**
- Order number
- Itemized product list
- Total price
- Shipping address
- Delivery date
- Order tracking information

### 4. Admin Order Notification
**Triggered:** Order placement  
**Recipient:** Admin (from ADMIN_EMAIL env)  
**Subject:** "🛍️ New Order #[OrderNumber] - Shunapee Fashion House Fashion"

**Content:**
- Customer name and email
- Order number and date
- Total amount
- Product list
- Direct link to admin panel

---

## 🔧 Technical Details

### File Structure
```
lib/
  emailService.ts          # Email service and templates

pages/api/v1/
  auth/
    register.ts            # Sends welcome email
  orders.ts                # Sends order confirmation
```

### Email Service Functions

#### `sendEmail(to, subject, html)`
Sends email to a single recipient.

**Parameters:**
- `to` (string): Recipient email address
- `subject` (string): Email subject
- `html` (string): HTML email content

**Returns:**
- `{ success: boolean, error?: string }`

**Example:**
```typescript
import { sendEmail, emailTemplates } from '@/lib/emailService';

const template = emailTemplates.welcomeEmail("John Doe", "john@example.com");
await sendEmail("john@example.com", template.subject, template.html);
```

#### `sendEmailToMultiple(recipients, subject, html)`
Sends email to multiple recipients.

**Parameters:**
- `recipients` (string[]): Array of email addresses
- `subject` (string): Email subject
- `html` (string): HTML email content

**Returns:**
- `{ success: boolean, error?: string }`

#### Email Templates
All templates are in `emailTemplates` object:
- `welcomeEmail(fullname, email)`
- `newUserAdminNotification(fullname, email)`
- `orderConfirmation(customerName, orderNumber, totalPrice, items, shippingAddress)`
- `newOrderAdminNotification(customerName, customerEmail, orderNumber, totalPrice, items)`

---

## 🧪 Testing

### Test Email Configuration
```bash
# Create a test user
POST /api/v1/auth/register
{
  "email": "test@example.com",
  "fullname": "Test User",
  "password": "password123"
}
```

**Expected:**
- ✅ User receives welcome email
- ✅ Admin receives new user notification
- ✅ Check spam folder if not received

### Test Order Emails
```bash
# Place a test order
POST /api/v1/orders
{
  "customerId": 1,
  "shippingAddress": "123 Test St",
  "totalPrice": 100,
  "products": [...]
}
```

**Expected:**
- ✅ Customer receives order confirmation
- ✅ Admin receives order notification

---

## 🚨 Troubleshooting

### Emails Not Sending

**Check 1: Environment Variables**
```bash
# Verify in terminal
echo $EMAIL_USER
echo $EMAIL_PASSWORD
```

**Check 2: Console Logs**
Look for error messages in terminal:
```
Failed to send welcome email: [error details]
```

**Check 3: Email Provider Settings**
- Gmail: Ensure 2FA is enabled and App Password is used
- Other: Verify SMTP settings are correct

**Check 4: Firewall/Network**
- Port 587 must be open
- Some networks block SMTP

### Common Errors

**"Invalid login"**
- Gmail: Use App Password, not regular password
- Other: Check credentials

**"Connection timeout"**
- Check EMAIL_HOST and EMAIL_PORT
- Verify network connection

**"Email not configured"**
- Ensure EMAIL_USER and EMAIL_PASSWORD are set
- Restart development server

---

## 🎨 Customizing Email Templates

### Modify Existing Templates

**Location:** `lib/emailService.ts`

**Example - Update Welcome Email:**
```typescript
welcomeEmail: (fullname: string, email: string) => ({
  subject: "Welcome to Your Store! 🎉",  // Change subject
  html: `
    <!-- Customize HTML here -->
    <h1>Welcome ${fullname}!</h1>
    <p>Your custom message here</p>
  `,
})
```

### Add New Template

```typescript
// In emailTemplates object
newTemplate: (param1: string, param2: string) => ({
  subject: "Your Subject",
  html: `
    <!DOCTYPE html>
    <html>
      <!-- Your HTML template -->
    </html>
  `,
})
```

---

## 📊 Email Analytics

To track email delivery:

1. **SendGrid:** Built-in analytics dashboard
2. **Mailgun:** Comprehensive tracking and logs
3. **Gmail:** No built-in analytics (use for testing only)

---

## 🔒 Security Best Practices

1. **Never commit credentials:**
   - ✅ Use .env files (already in .gitignore)
   - ✅ Use App Passwords, not main passwords

2. **Production setup:**
   - Use professional email service (SendGrid, Mailgun)
   - Set up SPF, DKIM, DMARC records
   - Use dedicated sending domain

3. **Rate limiting:**
   - Consider implementing email rate limits
   - Prevent spam/abuse

---

## 🚀 Production Deployment

### Recommended Services

**SendGrid** (Free tier: 100 emails/day)
- ✅ Easy setup
- ✅ Good deliverability
- ✅ Analytics included

**Mailgun** (Free tier: 5,000 emails/month)
- ✅ Powerful API
- ✅ Detailed logs
- ✅ Great for transactional emails

**AWS SES** (Very cheap)
- ✅ Highly scalable
- ✅ Best pricing
- ⚠️ Requires more setup

### Environment Variables for Production
```bash
# Vercel/Production
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add ADMIN_EMAIL
```

---

## 📋 Checklist

**Setup:**
- [ ] Install nodemailer (`npm install nodemailer`)
- [ ] Create email service account (Gmail App Password or SendGrid)
- [ ] Update .env with email credentials
- [ ] Set ADMIN_EMAIL in .env
- [ ] Restart development server

**Testing:**
- [ ] Register new user → Check welcome email
- [ ] Check admin email for new user notification
- [ ] Place test order → Check order confirmation
- [ ] Check admin email for order notification
- [ ] Verify emails not in spam folder

**Production:**
- [ ] Use professional email service
- [ ] Configure SPF/DKIM/DMARC
- [ ] Test in production environment
- [ ] Monitor email deliverability
- [ ] Set up error alerts

---

## 🎯 Future Enhancements

- [ ] Email templates in database (editable via admin)
- [ ] Order status update emails
- [ ] Password reset emails
- [ ] Promotional email campaigns
- [ ] Email preferences (unsubscribe)
- [ ] Multi-language email templates
- [ ] Email delivery queue (for high volume)
- [ ] A/B testing for emails

---

**Last Updated:** November 2, 2025  
**Status:** ✅ Production Ready (Configure email provider first)
