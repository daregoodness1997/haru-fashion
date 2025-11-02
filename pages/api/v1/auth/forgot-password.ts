import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Email is required",
      },
    });
  }

  // Mock response - in production, send actual email
  res.status(200).json({
    success: true,
    message: "Password reset email sent (mock)",
  });
}
