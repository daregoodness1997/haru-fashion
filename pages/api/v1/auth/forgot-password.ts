import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "../../../../lib/prisma";
import { sendEmail, emailTemplates } from "../../../../lib/emailService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we return success
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send password reset email
    const emailTemplate = emailTemplates.passwordResetEmail(
      user.fullname,
      resetToken
    );

    try {
      await sendEmail(email, emailTemplate.subject, emailTemplate.html);
      console.log(`✅ Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error("❌ Failed to send password reset email:", emailError);
      // Don't reveal email sending failure to user
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "An error occurred while processing your request",
      },
    });
  }
}
