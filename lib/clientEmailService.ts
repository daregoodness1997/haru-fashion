/**
 * Client-side email service
 * 
 * This service provides utilities for sending emails from the client side
 * by calling the /api/send-email endpoint.
 * 
 * Usage examples:
 * 
 * 1. Simple email:
 *    await sendClientEmail({
 *      to: "customer@example.com",
 *      subject: "Hello",
 *      text: "This is a test email"
 *    });
 * 
 * 2. HTML email:
 *    await sendClientEmail({
 *      to: "customer@example.com",
 *      subject: "Welcome!",
 *      html: "<h1>Welcome to our store!</h1>"
 *    });
 * 
 * 3. Template-based email (Welcome):
 *    await sendWelcomeEmail("customer@example.com", "John Doe");
 * 
 * 4. Template-based email (Order Confirmation):
 *    await sendOrderConfirmationEmail({
 *      to: "customer@example.com",
 *      customerName: "John Doe",
 *      orderNumber: 12345,
 *      totalPrice: 99.99,
 *      items: [...],
 *      shippingAddress: "123 Main St",
 *      currency: "NGN"
 *    });
 */

export type EmailResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type OrderItem = {
  product: {
    name: string;
  };
  quantity: number;
  price: number;
};

export type EmailRequest = {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  template?:
    | "welcome"
    | "orderConfirmation"
    | "orderStatusUpdate"
    | "newUserAdmin"
    | "newOrderAdmin";
  templateData?: {
    fullname?: string;
    email?: string;
    customerName?: string;
    orderNumber?: number;
    totalPrice?: number;
    items?: OrderItem[];
    shippingAddress?: string;
    currency?: string;
    status?: string;
    trackingNumber?: string;
    customerEmail?: string;
  };
};

/**
 * Generic function to send email from client side
 */
export async function sendClientEmail(
  emailData: EmailRequest
): Promise<EmailResponse> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to send email",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("❌ Client email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  to: string,
  fullname: string
): Promise<EmailResponse> {
  return sendClientEmail({
    to,
    template: "welcome",
    templateData: {
      fullname,
      email: to,
    },
  });
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: number;
  totalPrice: number;
  items: OrderItem[];
  shippingAddress: string;
  currency?: string;
}): Promise<EmailResponse> {
  return sendClientEmail({
    to: params.to,
    template: "orderConfirmation",
    templateData: {
      customerName: params.customerName,
      orderNumber: params.orderNumber,
      totalPrice: params.totalPrice,
      items: params.items,
      shippingAddress: params.shippingAddress,
      currency: params.currency || "USD",
    },
  });
}

/**
 * Send order status update email to customer
 */
export async function sendOrderStatusUpdateEmail(params: {
  to: string;
  customerName: string;
  orderNumber: number;
  status: string;
  trackingNumber?: string;
  shippingAddress?: string;
}): Promise<EmailResponse> {
  return sendClientEmail({
    to: params.to,
    template: "orderStatusUpdate",
    templateData: {
      customerName: params.customerName,
      orderNumber: params.orderNumber,
      status: params.status,
      trackingNumber: params.trackingNumber,
      shippingAddress: params.shippingAddress,
    },
  });
}

/**
 * Send new user notification to admin
 */
export async function sendNewUserAdminNotification(
  adminEmail: string,
  fullname: string,
  userEmail: string
): Promise<EmailResponse> {
  return sendClientEmail({
    to: adminEmail,
    template: "newUserAdmin",
    templateData: {
      fullname,
      email: userEmail,
    },
  });
}

/**
 * Send new order notification to admin
 */
export async function sendNewOrderAdminNotification(params: {
  adminEmail: string;
  customerName: string;
  customerEmail: string;
  orderNumber: number;
  totalPrice: number;
  items: OrderItem[];
  currency?: string;
}): Promise<EmailResponse> {
  return sendClientEmail({
    to: params.adminEmail,
    template: "newOrderAdmin",
    templateData: {
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      orderNumber: params.orderNumber,
      totalPrice: params.totalPrice,
      items: params.items,
      currency: params.currency || "USD",
    },
  });
}
