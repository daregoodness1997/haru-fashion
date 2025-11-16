import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "../../lib/emailService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Email address required" });
    }

    console.log("🧪 Testing email configuration...");

    const result = await sendEmail(
      to,
      "Test Email from Shunapee Fashion House Fashion",
      `
        <h1>Test Email</h1>
        <p>This is a test email to verify the email configuration is working.</p>
        <p>If you received this, the email service is configured correctly!</p>
        <hr>
        <p><small>Sent from Shunapee Fashion House Fashion</small></p>
      `
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Test email sent successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("❌ Test email error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
