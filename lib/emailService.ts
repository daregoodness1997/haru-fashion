import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    subject: "Welcome to Haru Fashion! 🎉",
    html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:60px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">HARU FASHION</h1>
        </td></tr>
      </table>
      
      <!-- Heading -->
      <h1 style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:400;color:#333;line-height:26px;">
        Welcome to Haru Fashion, ${fullname}!
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
        © ${new Date().getFullYear()} Haru Fashion. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
  }),

  // Admin notification for new user registration
  newUserAdminNotification: (fullname: string, email: string) => ({
    subject: "🆕 New User Registration - Haru Fashion",
    html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:40px 50px;">
      <h1 style="margin:0 0 20px 0;font-family:Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#10b981;">
        🎉 New User Registration
      </h1>
      
      <p style="margin:0 0 15px 0;font-family:Roboto,Arial,sans-serif;font-size:16px;color:#333;">
        A new user has registered on Haru Fashion:
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
    shippingAddress: string
  ) => ({
    subject: `Order Confirmation #${orderNumber} - Haru Fashion`,
    html: getEmailTemplate(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:45px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#F8F8F8;">
    <tr><td style="padding:60px 50px;">
      <!-- Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:60px;">
          <h1 style="margin:0;font-family:Roboto,Arial,sans-serif;font-size:28px;font-weight:800;color:#333;">HARU FASHION</h1>
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
                $${item.price.toFixed(2)} × ${item.quantity} = $${(
            item.quantity * item.price
          ).toFixed(2)}
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
          Total: $${totalPrice.toFixed(2)}
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
        © ${new Date().getFullYear()} Haru Fashion. All rights reserved.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
    `),
  }),

  // Admin notification for new order
  newOrderAdminNotification: (
    customerName: string,
    customerEmail: string,
    orderNumber: number,
    totalPrice: number,
    items: any[]
  ) => ({
    subject: `🛍️ New Order #${orderNumber} - Haru Fashion`,
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
          <strong>Total:</strong> $${totalPrice.toFixed(2)}
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
            ${item.product.name} - Qty: ${
              item.quantity
            } × $${item.price.toFixed(2)} = $${(
              item.quantity * item.price
            ).toFixed(2)}
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
  }),
};

// Send email function
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email configuration missing");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    await transporter.sendMail({
      from: `"Haru Fashion" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
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
