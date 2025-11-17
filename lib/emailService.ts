// Exchange rate for currency conversion in emails
const USD_TO_NGN_RATE = 1650;

// Brevo API configuration
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME || "Shunapee Fashion House";

// Helper function to generate email header/footer wrapper
const getEmailTemplate = (content: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="viewport" content="width=device-width" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;800&display=swap" rel="stylesheet" />
<style>
body{min-width:100%;Margin:0;padding:0;background-color:#242424}
table{border-collapse:collapse;table-layout:fixed}
img{border:0;height:auto;width:100%;max-width:100%}
</style>
</head>
<body style="min-width:100%;Margin:0;padding:0;background-color:#242424;">
${content}
</body>
</html>
`;

// Email templates
export const emailTemplates = {
  // Welcome email for new users
  welcomeEmail: (fullname: string, email: string) => ({
    subject: "Welcome to Shunapee Fashion House! 🎉",
    html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:60px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">SHUNAPEE FASHION HOUSE</h1>
        </td></tr>
      </table>
      
      <!-- Heading -->
      <h1 style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:400;color:#333;line-height:26px;">
        Welcome to Shunapee Fashion House, ${fullname}!
      </h1>
      
      <!-- Content -->
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        Thank you for creating an account with us! We're excited to have you join our community. Your account has been successfully created with the email: <strong>${email}</strong>
      </p>
      
      <p style="margin:0 0 10px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;font-weight:bold;">
        What's Next?
      </p>
      
      <p style="margin:0 0 30px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        • Browse our latest collections<br/>
        • Add items to your wishlist<br/>
        • Enjoy exclusive member benefits<br/>
        • Track your orders easily
      </p>
      
      <!-- Button -->
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td style="background:#333;padding:10px;text-align:center;width:250px;">
          <a href="${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }" style="display:block;font-family:Roboto,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFF;text-decoration:none;">
            START SHOPPING
          </a>
        </td></tr>
      </table>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="background:#242424;padding:48px 50px;text-align:center;">
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Shunapee Fashion House. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
  }),

  // Password reset email
  passwordResetEmail: (fullname: string, resetToken: string) => ({
    subject: "Reset Your Password - Shunapee Fashion House",
    html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:60px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">SHUNAPEE FASHION HOUSE</h1>
        </td></tr>
      </table>
      
      <!-- Heading -->
      <h1 style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:400;color:#333;line-height:26px;">
        Reset Your Password
      </h1>
      
      <!-- Content -->
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        Hi ${fullname},
      </p>
      
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        We received a request to reset your password. Click the button below to create a new password:
      </p>
      
      <!-- Button -->
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td style="background:#333;padding:10px;text-align:center;width:250px;">
          <a href="${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/reset-password?token=${resetToken}" style="display:block;font-family:Roboto,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFF;text-decoration:none;">
            RESET PASSWORD
          </a>
        </td></tr>
      </table>
      
      <p style="margin:30px 0 10px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        Or copy and paste this link into your browser:
      </p>
      
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;line-height:22px;word-break:break-all;">
        ${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/reset-password?token=${resetToken}
      </p>
      
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        This link will expire in 1 hour for security reasons.
      </p>
      
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        If you didn't request this password reset, please ignore this email or contact us if you have concerns.
      </p>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="background:#242424;padding:48px 50px;text-align:center;">
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Shunapee Fashion House. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
  }),

  // Admin notification for new user registration
  newUserAdminNotification: (fullname: string, email: string) => ({
    subject: "🆕 New User Registration - Shunapee Fashion House",
    html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:40px 50px;">
      <h1 style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#10b981;">
        🎉 New User Registration
      </h1>
      
      <p style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        A new user has registered on Shunapee Fashion House:
      </p>
      
      <div style="background:#FFF;padding:15px;margin:10px 0;border-left:4px solid #10b981;">
        <p style="margin:0 0 8px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Name:</strong> ${fullname}
        </p>
        <p style="margin:0 0 8px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </p>
      </div>
      
      <p style="margin:15px 0 0 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Total users on platform is growing! 🚀
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
  }),

  // Order confirmation email for customer
  orderConfirmation: (
    customerName: string,
    orderNumber: number,
    totalPrice: number,
    items: any[],
    shippingAddress: string,
    currency: string = "USD"
  ) => {
    const formatPrice = (amount: number) => {
      if (currency === "NGN") {
        // Convert USD to NGN
        const convertedAmount = amount * USD_TO_NGN_RATE;
        return `₦${convertedAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
      return `$${amount.toFixed(2)}`;
    };

    return {
      subject: `Order Confirmation #${orderNumber} - Shunapee Fashion House`,
      html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:60px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">SHUNAPEE FASHION HOUSE</h1>
        </td></tr>
      </table>
      
      <!-- Heading -->
      <h1 style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:400;color:#333;">
        ${customerName}, thank you for your order.
      </h1>
      
      <!-- Content -->
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        Your order is being processed and will be shipped soon. You will receive an update from us regarding the status of your order and the delivery of the parcel.
      </p>
      
      <!-- Order Number -->
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;font-weight:bold;">
        Order Number
      </p>
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        #${orderNumber}
      </p>
      
      <!-- Delivery Address -->
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;font-weight:bold;">
        Delivery Address
      </p>
      <p style="margin:0 0 30px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        ${shippingAddress}
      </p>
      
      <!-- Order Items -->
      ${items
        .map(
          (item) => `
      <div style="background:#FFF;padding:20px;margin-bottom:10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:70%;">
              <h2 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:#1A1A1A;text-transform:uppercase;">
                ${item.product.name}
              </h2>
            </td>
            <td style="text-align:right;">
              <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;text-transform:uppercase;">
                Quantity: <strong>${item.quantity}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px;">
              <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
                ${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(
            item.quantity * item.price
          )}
              </p>
            </td>
          </tr>
        </table>
      </div>
      `
        )
        .join("")}
      
      <!-- Total -->
      <div style="background:#333;color:#FFF;padding:20px;margin:20px 0;">
        <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:20px;font-weight:bold;text-align:right;">
          Total: ${formatPrice(totalPrice)}
        </p>
      </div>
      
      <p style="margin:0 0 40px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Click the button below for a status update on your delivery.
      </p>
      
      <!-- Button -->
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td style="background:#333;padding:10px;text-align:center;width:250px;">
          <a href="${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/orders" style="display:block;font-family:Roboto,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFF;text-decoration:none;">
            TRACK YOUR ORDER
          </a>
        </td></tr>
      </table>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="background:#242424;padding:48px 50px;text-align:center;">
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Shunapee Fashion House. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
    };
  },

  // Admin notification for new order
  newOrderAdminNotification: (
    customerName: string,
    customerEmail: string,
    orderNumber: number,
    totalPrice: number,
    items: any[],
    currency: string = "USD"
  ) => {
    const formatPrice = (amount: number) => {
      if (currency === "NGN") {
        // Convert USD to NGN
        const convertedAmount = amount * USD_TO_NGN_RATE;
        return `₦${convertedAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
      return `$${amount.toFixed(2)}`;
    };

    return {
      subject: `🛍️ New Order #${orderNumber} - Shunapee Fashion House`,
      html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:40px 50px;">
      <h1 style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#f59e0b;">
        🛍️ New Order Received!
      </h1>
      <h2 style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:20px;font-weight:400;color:#333;">
        Order #${orderNumber}
      </h2>
      
      <div style="background:#FFF;padding:15px;margin:10px 0;border-left:4px solid #f59e0b;">
        <p style="margin:0 0 8px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Customer:</strong> ${customerName}
        </p>
        <p style="margin:0 0 8px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Email:</strong> ${customerEmail}
        </p>
        <p style="margin:0 0 8px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Order Date:</strong> ${new Date().toLocaleString()}
        </p>
        <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Total:</strong> ${formatPrice(totalPrice)}
        </p>
      </div>
      
      <h3 style="margin:20px 0 10px 0;font-family:Roboto,Arial,sans-serif;font-size:18px;color:#333;">
        Order Items:
      </h3>
      
      <div style="background:#FFF;padding:15px;margin:10px 0;">
        ${items
          .map(
            (item) => `
        <div style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#333;">
            ${item.product.name} - Qty: ${item.quantity} × ${formatPrice(
              item.price
            )} = ${formatPrice(item.quantity * item.price)}
          </p>
        </div>
        `
          )
          .join("")}
      </div>
      
      <p style="margin:15px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Please process this order as soon as possible.
      </p>
      
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td style="background:#f59e0b;padding:10px;text-align:center;width:250px;">
          <a href="${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/admin/orders" style="display:block;font-family:Roboto,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFF;text-decoration:none;">
            VIEW IN ADMIN PANEL
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
    };
  },

  // Order status update email for customer
  orderStatusUpdate: (
    customerName: string,
    orderNumber: number,
    status: string,
    trackingNumber?: string,
    shippingAddress?: string
  ) => {
    // Map status to user-friendly messages
    const statusMessages: {
      [key: string]: { title: string; message: string; color: string };
    } = {
      pending: {
        title: "Order Received",
        message: "We've received your order and will begin processing it soon.",
        color: "#f59e0b",
      },
      processing: {
        title: "Order Processing",
        message: "Your order is being prepared for shipment.",
        color: "#3b82f6",
      },
      shipped: {
        title: "Order Shipped!",
        message: "Your order has been shipped and is on its way to you.",
        color: "#8b5cf6",
      },
      delivered: {
        title: "Order Delivered!",
        message:
          "Your order has been successfully delivered. Thank you for shopping with us!",
        color: "#10b981",
      },
      cancelled: {
        title: "Order Cancelled",
        message:
          "Your order has been cancelled. If you have any questions, please contact us.",
        color: "#ef4444",
      },
    };

    const statusInfo = statusMessages[status.toLowerCase()] || {
      title: `Order Status: ${status}`,
      message: `Your order status has been updated to: ${status}`,
      color: "#6b7280",
    };

    return {
      subject: `${statusInfo.title} - Order #${orderNumber}`,
      html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:60px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">SHUNAPEE FASHION HOUSE</h1>
        </td></tr>
      </table>
      
      <!-- Status Banner -->
      <div style="background:${
        statusInfo.color
      };color:#FFF;padding:20px;margin-bottom:30px;text-align:center;border-radius:8px;">
        <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#FFF;">
          ${statusInfo.title}
        </h1>
      </div>
      
      <!-- Greeting -->
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        Hi ${customerName},
      </p>
      
      <p style="margin:0 0 22px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;line-height:22px;">
        ${statusInfo.message}
      </p>
      
      <!-- Order Details -->
      <div style="background:#FFF;padding:20px;margin:20px 0;border-left:4px solid ${
        statusInfo.color
      };">
        <p style="margin:0 0 10px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Order Number:</strong> #${orderNumber}
        </p>
        <p style="margin:0 0 10px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Status:</strong> ${status.toUpperCase()}
        </p>
        ${
          trackingNumber
            ? `
        <p style="margin:0 0 10px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Tracking Number:</strong> ${trackingNumber}
        </p>
        `
            : ""
        }
        ${
          shippingAddress
            ? `
        <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
          <strong>Shipping Address:</strong><br/>
          ${shippingAddress}
        </p>
        `
            : ""
        }
      </div>
      
      ${
        status.toLowerCase() === "shipped" ||
        status.toLowerCase() === "processing"
          ? `
      <p style="margin:20px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        You can track your order status anytime by clicking the button below.
      </p>
      
      <!-- Button -->
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td style="background:#333;padding:10px;text-align:center;width:250px;">
          <a href="${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/orders" style="display:block;font-family:Roboto,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFF;text-decoration:none;">
            TRACK YOUR ORDER
          </a>
        </td></tr>
      </table>
      `
          : ""
      }
      
      ${
        status.toLowerCase() === "delivered"
          ? `
      <p style="margin:20px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        We hope you love your purchase! If you have any feedback or questions, please don't hesitate to contact us.
      </p>
      `
          : ""
      }
      
      <p style="margin:30px 0 0 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Thank you for shopping with Shunapee Fashion House!
      </p>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="background:#242424;padding:48px 50px;text-align:center;">
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Shunapee Fashion House. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
      `),
    };
  },
};

// Service Request Email Function
export async function sendServiceRequestEmail(params: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  serviceType: string;
  category: string;
}): Promise<{ success: boolean; error?: string }> {
  const {
    customerName,
    customerEmail,
    customerPhone,
    message,
    serviceType,
    category,
  } = params;

  const serviceNames: Record<string, string> = {
    event_styling: "Event Styling",
    consultation: "Style Consultation",
    custom_attire: "Custom Attire Request",
  };

  const serviceName = serviceNames[serviceType] || serviceType;

  // Email to customer (confirmation)
  const customerSubject = `Service Request Received - ${serviceName}`;
  const customerHtml = getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:40px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">SHUNAPEE FASHION HOUSE</h1>
        </td></tr>
      </table>

      <h2 style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#333;">
        ✨ Service Request Received
      </h2>

      <p style="margin:0 0 30px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Hi ${customerName},
      </p>

      <p style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Thank you for your interest in our <strong>${serviceName}</strong> service! We've received your request and our team will review it shortly.
      </p>

      <div style="background:#fff;border:2px solid #9333ea;border-radius:8px;padding:24px;margin:30px 0;">
        <h3 style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:18px;font-weight:700;color:#9333ea;">
          Your Request Details
        </h3>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Service:</strong> ${serviceName}
        </p>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Category:</strong> ${
            category.charAt(0).toUpperCase() + category.slice(1)
          }
        </p>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Your Message:</strong><br/>
          ${message}
        </p>
      </div>

      <p style="margin:20px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        We typically respond within 24-48 hours. If you have any urgent questions, please don't hesitate to contact us directly.
      </p>

      <p style="margin:30px 0 0 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        Best regards,<br/>
        <strong>The Shunapee Fashion House Team</strong>
      </p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="background:#242424;padding:48px 50px;text-align:center;">
      <p style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Shunapee Fashion House. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
  `);

  // Email to admin (notification)
  const adminSubject = `New Service Request: ${serviceName}`;
  const adminHtml = getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <h2 style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#333;">
        🔔 New Service Request
      </h2>

      <div style="background:#fff;border:2px solid #9333ea;border-radius:8px;padding:24px;margin:20px 0;">
        <h3 style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:18px;font-weight:700;color:#9333ea;">
          ${serviceName}
        </h3>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Customer Name:</strong> ${customerName}
        </p>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Email:</strong> ${customerEmail}
        </p>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Phone:</strong> ${customerPhone}
        </p>
        <p style="margin:8px 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Category:</strong> ${
            category.charAt(0).toUpperCase() + category.slice(1)
          }
        </p>
        <p style="margin:15px 0 0 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
          <strong>Message:</strong><br/>
          ${message}
        </p>
      </div>

      <p style="margin:20px 0 0 0;font-family:Roboto,Arial,sans-serif;font-size:14px;color:#666;">
        Please respond to the customer at: <a href="mailto:${customerEmail}" style="color:#9333ea;">${customerEmail}</a>
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
  `);

  // Send both emails
  const customerResult = await sendEmail(
    customerEmail,
    customerSubject,
    customerHtml
  );
  const adminResult = await sendEmail(
    process.env.ADMIN_EMAIL || BREVO_SENDER_EMAIL!,
    adminSubject,
    adminHtml
  );

  return {
    success: customerResult.success && adminResult.success,
    error: !customerResult.success
      ? "Failed to send confirmation email"
      : !adminResult.success
      ? "Failed to send admin notification"
      : undefined,
  };
}

// Send email function using Brevo API
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate Brevo API configuration
    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
      console.error("❌ Brevo email configuration missing");
      console.error("BREVO_API_KEY:", BREVO_API_KEY ? "Set" : "Missing");
      console.error(
        "BREVO_SENDER_EMAIL:",
        BREVO_SENDER_EMAIL ? "Set" : "Missing"
      );
      return {
        success: false,
        error:
          "Brevo email service not configured. Please set BREVO_API_KEY and BREVO_SENDER_EMAIL environment variables.",
      };
    }

    console.log(`📧 Attempting to send email via Brevo to: ${to}`);

    // Prepare Brevo API request
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      console.error("❌ Brevo API error:", errorData);
      return {
        success: false,
        error: `Brevo API error: ${errorData.message || response.statusText}`,
      };
    }

    const data = await response.json();
    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`Message ID: ${data.messageId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email via Brevo:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Send email to multiple recipients
export async function sendEmailToMultiple(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const results = await Promise.all(
      recipients.map((email) => sendEmail(email, subject, html))
    );

    const allSuccessful = results.every((result) => result.success);
    return {
      success: allSuccessful,
      error: allSuccessful
        ? undefined
        : "Some emails failed to send. Check logs.",
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
