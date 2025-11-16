import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, newPassword } = req.body;

  // Validate required fields
  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Token and new password are required",
      },
    });
  }

  // Validate password strength
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Password must be at least 6 characters long",
      },
    });
  }

  try {
    // Hash the token to match database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: {
          gt: new Date(), // Token hasn't expired
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid or expired reset token",
        },
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    console.log(
      `✅ Password reset successfully for user: ${resetToken.user.email}`
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in reset password:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "An error occurred while resetting your password",
      },
    });
  }
}
