# Password Reset Implementation Guide

## Overview
Complete password reset functionality has been implemented for Shunapee Fashion House, allowing users to securely reset their passwords via email.

## Components Added

### 1. Database Schema (`prisma/schema.prisma`)
- Added `PasswordResetToken` model to store password reset tokens
- Tokens are hashed for security
- Tokens expire after 1 hour
- Cascading delete when user is deleted

### 2. Email Template (`lib/emailService.ts`)
- `passwordResetEmail()` - Professional email with reset link
- Includes button and plaintext link
- Shows expiration time (1 hour)
- Branded with Shunapee Fashion House styling

### 3. API Endpoints

#### `/api/v1/auth/forgot-password` (POST)
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Features:**
- Validates email exists in database
- Generates secure random token (32 bytes)
- Hashes token before storing in database
- Sends password reset email via Brevo
- Returns generic success message (prevents email enumeration)

#### `/api/v1/auth/reset-password` (POST)
**Request:**
```json
{
  "token": "abc123...",
  "newPassword": "newSecurePassword"
}
```

**Features:**
- Validates token exists and hasn't expired
- Validates password strength (min 6 characters)
- Hashes new password with bcrypt
- Updates user's password
- Deletes used token
- Returns success/error message

### 4. Frontend Components

#### `components/Auth/ForgotPassword.tsx`
- Modal form for requesting password reset
- Shows toast notification on success
- Closes modal after 2 seconds
- Error handling for invalid emails

#### `pages/reset-password.tsx`
- Standalone page for resetting password
- Validates token from URL query
- Password confirmation field
- Success state with redirect
- Error handling for expired/invalid tokens

### 5. Translations
Added to all language files (`en.json`, `fr.json`, `es.json`):
- `forgot_password_success`: "Password reset link sent! Please check your email."

## Database Migration

Run this SQL to add the password reset tokens table:

```sql
-- See prisma/migrations/add_password_reset_token.sql
```

Or use Prisma:
```bash
npx prisma migrate dev --name add_password_reset_token
```

## Environment Variables Required

```env
# Brevo API (for sending emails)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@shunapee.com
BREVO_SENDER_NAME=Shunapee Fashion House

# Frontend URL (for reset link)
NEXT_PUBLIC_BACKEND_URL=https://yourdomain.com
```

## User Flow

### Request Password Reset
1. User clicks "Forgot Password" in login modal
2. Enters email address
3. System checks if email exists
4. Generates secure token and stores in database
5. Sends email with reset link
6. Shows success toast and closes modal

### Reset Password
1. User clicks link in email
2. Redirected to `/reset-password?token=abc123...`
3. Enters new password (twice for confirmation)
4. System validates token and updates password
5. Shows success message
6. Redirects to homepage

## Security Features

✅ **Token Security**
- 32-byte cryptographically secure random tokens
- Tokens are hashed before storage (SHA-256)
- Tokens expire after 1 hour
- Used tokens are immediately deleted

✅ **Email Enumeration Prevention**
- Always returns success message, even if email doesn't exist
- No indication whether email exists in system

✅ **Password Security**
- Minimum 6 character requirement
- Hashed with bcrypt (10 rounds)
- Password confirmation required

✅ **Rate Limiting Ready**
- Can add rate limiting middleware to prevent abuse
- Old tokens automatically replaced when new request made

## Testing

### Test Forgot Password Flow
1. Visit your site and click login
2. Click "Forgot Password"
3. Enter a registered email
4. Check email inbox for reset link
5. Click link or copy to browser
6. Enter new password
7. Verify you can login with new password

### Test Edge Cases
- ❌ Non-existent email (should still show success)
- ❌ Expired token (should show error)
- ❌ Invalid token (should show error)
- ❌ Password too short (should show validation error)
- ❌ Passwords don't match (should show validation error)

## Integration with Existing Auth

The password reset integrates seamlessly with:
- `context/AuthContext.tsx` - Uses existing `forgotPassword()` method
- `components/Auth/AuthForm.tsx` - Modal management
- `lib/emailService.ts` - Brevo email sending

## Monitoring & Logs

Console logs are added for:
- ✅ Password reset requests
- ✅ Email sending success/failure
- ✅ Password updates
- ❌ Invalid token attempts
- ❌ Non-existent email requests

## Next Steps

1. **Deploy Migration**: Run the database migration in production
2. **Test Emails**: Verify Brevo is configured and emails are sending
3. **Monitor**: Watch logs for any issues
4. **Optional Enhancements**:
   - Add rate limiting (e.g., max 3 requests per hour per IP)
   - Add email templates for successful password change notification
   - Add "remember me" option on login after reset
   - Track password reset metrics

## Troubleshooting

### Emails Not Sending
- Check `BREVO_API_KEY` is set correctly
- Verify sender email is verified in Brevo
- Check console logs for Brevo API errors

### Token Validation Fails
- Ensure database migration was run
- Check token hasn't expired (1 hour limit)
- Verify token in URL matches database (case-sensitive)

### Database Errors
- Run Prisma generate: `npx prisma generate`
- Run migration: `npx prisma migrate dev`
- Check database connection string

## Files Modified/Created

**Modified:**
- `prisma/schema.prisma` - Added PasswordResetToken model
- `lib/emailService.ts` - Added password reset email template
- `components/Auth/ForgotPassword.tsx` - Added toast and close functionality
- `components/Auth/AuthForm.tsx` - Pass onClose prop
- `messages/common/en.json` - Added success message
- `messages/common/fr.json` - Added French translation
- `messages/common/es.json` - Added Spanish translation
- `styles/globals.css` - Added fade-in animation

**Created:**
- `pages/api/v1/auth/forgot-password.ts` - Forgot password API
- `pages/api/v1/auth/reset-password.ts` - Reset password API  
- `pages/reset-password.tsx` - Password reset page
- `prisma/migrations/add_password_reset_token.sql` - Migration SQL

---

**Implementation Complete!** 🎉

The password reset feature is now fully functional and ready for production use.
