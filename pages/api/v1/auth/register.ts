import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { emailTemplates, sendEmail } from "../../../../lib/emailService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, fullname, password, shippingAddress, phone } = req.body;

    // Validate required fields
    if (!email || !fullname || !password) {
      return res.status(400).json({
        success: false,
        error: {
          detail: {
            message: "Email, fullname, and password are required",
          },
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          type: "alreadyExists",
          message: "User with this email already exists",
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        fullname,
        password: hashedPassword,
        shippingAddress: shippingAddress || "",
        phone: phone || "",
      },
    });

    // Generate a mock token
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    // Send welcome email to user (non-blocking)
    const welcomeTemplate = emailTemplates.welcomeEmail(fullname, email);
    sendEmail(email, welcomeTemplate.subject, welcomeTemplate.html)
      .then((result) => {
        if (result.success) {
          console.log("✅ Welcome email sent to:", email);
        } else {
          console.error("❌ Failed to send welcome email:", result.error);
        }
      })
      .catch((err) => {
        console.error("❌ Welcome email error:", err);
      });

    // Send notification to admin (non-blocking)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminTemplate = emailTemplates.newUserAdminNotification(
        fullname,
        email
      );
      sendEmail(adminEmail, adminTemplate.subject, adminTemplate.html)
        .then((result) => {
          if (result.success) {
            console.log("✅ Admin notification sent to:", adminEmail);
          } else {
            console.error(
              "❌ Failed to send admin notification:",
              result.error
            );
          }
        })
        .catch((err) => {
          console.error("❌ Admin notification error:", err);
        });
    }

    res.status(201).json({
      success: true,
      token,
      data: {
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
        shippingAddress: newUser.shippingAddress,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to register user" },
    });
  }
}
