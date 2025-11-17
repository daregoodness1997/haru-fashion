import type { NextApiRequest, NextApiResponse } from "next";
import { sendServiceRequestEmail } from "../../../lib/emailService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, phone, message, service, category } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message || !service) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Send email notification
    await sendServiceRequestEmail({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message,
      serviceType: service,
      category: category || "general",
    });

    return res.status(200).json({
      success: true,
      message: "Service request sent successfully",
    });
  } catch (error) {
    console.error("Error processing service request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send service request",
    });
  }
}
