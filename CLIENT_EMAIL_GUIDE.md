# Client-Side Email Service

This guide shows how to send emails from the client side (React components) in your Next.js application.

## Quick Start

### 1. Simple Email

```typescript
import { sendClientEmail } from "../lib/clientEmailService";

// Send a simple email
const result = await sendClientEmail({
  to: "customer@example.com",
  subject: "Hello from Shunapee Fashion House",
  text: "This is a plain text email"
});

if (result.success) {
  console.log("Email sent!");
} else {
  console.error("Error:", result.error);
}
```

### 2. HTML Email

```typescript
import { sendClientEmail } from "../lib/clientEmailService";

const result = await sendClientEmail({
  to: "customer@example.com",
  subject: "Welcome!",
  html: "<h1>Welcome to our store!</h1><p>We're glad to have you.</p>"
});
```

### 3. Template-Based Emails (Recommended)

```typescript
import { sendWelcomeEmail } from "../lib/clientEmailService";

// Send welcome email using predefined template
const result = await sendWelcomeEmail(
  "customer@example.com",
  "John Doe"
);
```

## Using React Hook

The easiest way to send emails from React components is using the `useEmail` hook:

### Basic Usage

```tsx
import { useEmail } from "../components/Util/useEmail";

function MyComponent() {
  const { sendEmail, sending, error, success, reset } = useEmail();

  const handleSend = async () => {
    await sendEmail({
      to: "customer@example.com",
      subject: "Test Email",
      text: "This is a test"
    });
  };

  return (
    <div>
      <button onClick={handleSend} disabled={sending}>
        {sending ? "Sending..." : "Send Email"}
      </button>
      {success && <p style={{color: "green"}}>Email sent successfully!</p>}
      {error && <p style={{color: "red"}}>Error: {error}</p>}
      <button onClick={reset}>Clear Status</button>
    </div>
  );
}
```

### Template Email Hook

```tsx
import { useTemplateEmail } from "../components/Util/useEmail";

function OrderComponent() {
  const { 
    sendOrderConfirmation, 
    sending, 
    error, 
    success 
  } = useTemplateEmail();

  const handlePlaceOrder = async () => {
    const result = await sendOrderConfirmation({
      to: "customer@example.com",
      customerName: "John Doe",
      orderNumber: 12345,
      totalPrice: 150.00,
      items: [
        {
          product: { name: "Blue T-Shirt" },
          quantity: 2,
          price: 50.00
        },
        {
          product: { name: "Jeans" },
          quantity: 1,
          price: 50.00
        }
      ],
      shippingAddress: "123 Main St, Uyo, Akwa Ibom",
      currency: "NGN"
    });

    if (result.success) {
      console.log("Order confirmation sent!");
    }
  };

  return (
    <div>
      <button onClick={handlePlaceOrder} disabled={sending}>
        {sending ? "Placing Order..." : "Place Order"}
      </button>
      {success && <p>Order placed! Confirmation email sent.</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Available Template Functions

### 1. Welcome Email
```typescript
import { sendWelcomeEmail } from "../lib/clientEmailService";

await sendWelcomeEmail(
  "customer@example.com",
  "John Doe"
);
```

### 2. Order Confirmation
```typescript
import { sendOrderConfirmationEmail } from "../lib/clientEmailService";

await sendOrderConfirmationEmail({
  to: "customer@example.com",
  customerName: "John Doe",
  orderNumber: 12345,
  totalPrice: 150.00,
  items: [
    {
      product: { name: "Product Name" },
      quantity: 2,
      price: 75.00
    }
  ],
  shippingAddress: "123 Main St, City",
  currency: "NGN" // Optional, defaults to USD
});
```

### 3. Order Status Update
```typescript
import { sendOrderStatusUpdateEmail } from "../lib/clientEmailService";

await sendOrderStatusUpdateEmail({
  to: "customer@example.com",
  customerName: "John Doe",
  orderNumber: 12345,
  status: "shipped",
  trackingNumber: "TRACK123", // Optional
  shippingAddress: "123 Main St" // Optional
});
```

### 4. Admin Notifications
```typescript
import { 
  sendNewUserAdminNotification,
  sendNewOrderAdminNotification 
} from "../lib/clientEmailService";

// New user notification
await sendNewUserAdminNotification(
  "admin@lumenware.com.ng",
  "John Doe",
  "customer@example.com"
);

// New order notification
await sendNewOrderAdminNotification({
  adminEmail: "admin@lumenware.com.ng",
  customerName: "John Doe",
  customerEmail: "customer@example.com",
  orderNumber: 12345,
  totalPrice: 150.00,
  items: [...],
  currency: "NGN"
});
```

## API Endpoint

All client-side emails go through: `POST /api/send-email`

### Request Format

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Email Content</h1>",
  // OR use template
  "template": "welcome",
  "templateData": {
    "fullname": "John Doe",
    "email": "john@example.com"
  }
}
```

### Response Format

Success:
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Order Status Values

When using `orderStatusUpdate` template, these status values have special formatting:

- `pending` - Order Received (orange)
- `processing` - Order Processing (blue)
- `shipped` - Order Shipped (purple)
- `delivered` - Order Delivered (green)
- `cancelled` - Order Cancelled (red)

## Currency Support

Both USD and NGN currencies are supported:

```typescript
// USD (default)
await sendOrderConfirmationEmail({
  // ... other params
  currency: "USD"
});

// Nigerian Naira (auto-converts prices)
await sendOrderConfirmationEmail({
  // ... other params
  currency: "NGN"
});
```

Exchange rate: 1 USD = ₦1,650 (configured in `lib/emailService.ts`)

## Error Handling

```typescript
const result = await sendClientEmail({
  to: "customer@example.com",
  subject: "Test",
  text: "Test email"
});

if (!result.success) {
  // Handle error
  console.error("Failed to send email:", result.error);
  
  // Show user-friendly message
  alert("Sorry, we couldn't send the email. Please try again.");
}
```

## Best Practices

1. **Always handle errors**: Check `result.success` before assuming email was sent
2. **Use templates**: Prefer template-based emails for consistent branding
3. **Loading states**: Show loading indicator while `sending` is true
4. **User feedback**: Display success/error messages to users
5. **Don't block UI**: Email sending is async, don't wait for it to complete critical operations
6. **Validate input**: Ensure email addresses and required data are valid before sending

## Example: Registration Flow

```tsx
import { useTemplateEmail } from "../components/Util/useEmail";

function RegisterForm() {
  const { sendWelcome, sendAdminUserNotification } = useTemplateEmail();
  
  const handleRegister = async (formData) => {
    // 1. Create user account
    const user = await createUser(formData);
    
    // 2. Send welcome email to user (don't wait)
    sendWelcome(user.email, user.fullname).catch(err => 
      console.error("Failed to send welcome email:", err)
    );
    
    // 3. Notify admin (don't wait)
    sendAdminUserNotification(
      process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      user.fullname,
      user.email
    ).catch(err => 
      console.error("Failed to notify admin:", err)
    );
    
    // 4. Redirect user (don't wait for emails)
    router.push("/dashboard");
  };
  
  return <form onSubmit={handleRegister}>...</form>;
}
```

## Troubleshooting

### Email not sending?

1. Check Vercel environment variables are set:
   - `EMAIL_HOST=smtp.zoho.com`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=admin@lumenware.com.ng`
   - `EMAIL_PASSWORD=your-password`

2. Check browser console for errors
3. Check Vercel function logs
4. Verify recipient email address is valid

### Timeout errors?

- Port 587 should be used (not 465)
- Check SMTP credentials are correct
- Verify Zoho account is active
