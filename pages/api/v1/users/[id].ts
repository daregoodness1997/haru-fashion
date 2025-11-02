import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Only allow PUT (update) requests
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      error: {
        message: "Method not allowed",
      },
    });
  }

  try {
    const userId = parseInt(id as string);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid user ID",
        },
      });
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: "User not found",
        },
      });
    }

    const { fullname, phone, shippingAddress, currentPassword, newPassword } =
      req.body;

    // Validate required fields
    if (!fullname) {
      return res.status(400).json({
        success: false,
        error: {
          message: "fullname_required",
        },
      });
    }

    // Prepare update data
    const updateData: any = {
      fullname,
      phone: phone || null,
      shippingAddress: shippingAddress || null,
    };

    // If user wants to change password, validate current password and hash new one
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: "incorrect_current_password",
          },
        });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: {
            message: "password_too_short",
          },
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullname: true,
        phone: true,
        shippingAddress: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
