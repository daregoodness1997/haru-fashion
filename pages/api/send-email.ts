import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail, emailTemplates } from "../../lib/emailService";

type EmailRequestBody = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  // Template-based emails
  template?:
    | "welcome"
    | "orderConfirmation"
    | "orderStatusUpdate"
    | "newUserAdmin"
    | "newOrderAdmin";
  templateData?: {
    // Welcome email
    fullname?: string;
    email?: string;
    // Order confirmation
    customerName?: string;
    orderNumber?: number;
    totalPrice?: number;
    items?: any[];
    shippingAddress?: string;
    currency?: string;
    // Order status update
    status?: string;
    trackingNumber?: string;
    // Admin notification
    customerEmail?: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body as EmailRequestBody;

    // Validate required fields
    if (!body.to) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    let subject = body.subject;
    let html = body.html;

    // Handle template-based emails
    if (body.template && body.templateData) {
      switch (body.template) {
        case "welcome":
          if (!body.templateData.fullname || !body.templateData.email) {
            return res
              .status(400)
              .json({ error: "fullname and email are required for welcome template" });
          }
          const welcomeEmail = emailTemplates.welcomeEmail(
            body.templateData.fullname,
            body.templateData.email
          );
          subject = welcomeEmail.subject;
          html = welcomeEmail.html;
          break;

        case "orderConfirmation":
          if (
            !body.templateData.customerName ||
            !body.templateData.orderNumber ||
            body.templateData.totalPrice === undefined ||
            !body.templateData.items ||
            !body.templateData.shippingAddress
          ) {
            return res.status(400).json({
              error:
                "customerName, orderNumber, totalPrice, items, and shippingAddress are required",
            });
          }
          const orderEmail = emailTemplates.orderConfirmation(
            body.templateData.customerName,
            body.templateData.orderNumber,
            body.templateData.totalPrice,
            body.templateData.items,
            body.templateData.shippingAddress,
            body.templateData.currency
          );
          subject = orderEmail.subject;
          html = orderEmail.html;
          break;

        case "orderStatusUpdate":
          if (
            !body.templateData.customerName ||
            !body.templateData.orderNumber ||
            !body.templateData.status
          ) {
            return res.status(400).json({
              error: "customerName, orderNumber, and status are required",
            });
          }
          const statusEmail = emailTemplates.orderStatusUpdate(
            body.templateData.customerName,
            body.templateData.orderNumber,
            body.templateData.status,
            body.templateData.trackingNumber,
            body.templateData.shippingAddress
          );
          subject = statusEmail.subject;
          html = statusEmail.html;
          break;

        case "newUserAdmin":
          if (!body.templateData.fullname || !body.templateData.email) {
            return res
              .status(400)
              .json({ error: "fullname and email are required" });
          }
          const adminUserEmail = emailTemplates.newUserAdminNotification(
            body.templateData.fullname,
            body.templateData.email
          );
          subject = adminUserEmail.subject;
          html = adminUserEmail.html;
          break;

        case "newOrderAdmin":
          if (
            !body.templateData.customerName ||
            !body.templateData.customerEmail ||
            !body.templateData.orderNumber ||
            body.templateData.totalPrice === undefined ||
            !body.templateData.items
          ) {
            return res.status(400).json({
              error:
                "customerName, customerEmail, orderNumber, totalPrice, and items are required",
            });
          }
          const adminOrderEmail = emailTemplates.newOrderAdminNotification(
            body.templateData.customerName,
            body.templateData.customerEmail,
            body.templateData.orderNumber,
            body.templateData.totalPrice,
            body.templateData.items,
            body.templateData.currency
          );
          subject = adminOrderEmail.subject;
          html = adminOrderEmail.html;
          break;

        default:
          return res.status(400).json({ error: "Invalid template name" });
      }
    } else if (!subject || (!html && !body.text)) {
      // If no template, require subject and content
      return res.status(400).json({
        error: "Subject and html/text content are required when not using a template",
      });
    }

    // If text is provided but no html, use text as basic html
    if (body.text && !html) {
      html = `<p>${body.text.replace(/\n/g, "<br>")}</p>`;
    }

    console.log("📧 Client-side email request received");
    console.log(`📧 To: ${body.to}`);
    console.log(`📧 Subject: ${subject}`);

    // Send the email
    const result = await sendEmail(body.to, subject, html!);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Email sent successfully!",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || "Failed to send email",
      });
    }
  } catch (error) {
    console.error("❌ Error in send-email API:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
