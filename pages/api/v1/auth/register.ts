import type { NextApiRequest, NextApiResponse } from "next";

// Mock user storage (in production, use a real database)
const users: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: {
        type: "alreadyExists",
        message: "User with this email already exists",
      },
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    fullname,
    shippingAddress: shippingAddress || "",
    phone: phone || "",
    password, // In production, hash this!
  };

  users.push(newUser);

  // Generate a mock token
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

  res.status(201).json({
    success: true,
    id: newUser.id,
    token,
  });
}
