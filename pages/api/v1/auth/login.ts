import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Email and password are required",
        },
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: "incorrect",
        },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          message: "incorrect",
        },
      });
    }

    // Generate a mock token
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        shippingAddress: user.shippingAddress,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });

    console.log("User logged in:", user);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to login" },
    });
  }
}
