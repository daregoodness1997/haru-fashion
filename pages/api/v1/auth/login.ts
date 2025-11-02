import type { NextApiRequest, NextApiResponse } from "next";

// Mock users for demo (in production, use a real database)
const mockUsers = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
    fullname: "Demo User",
    shippingAddress: "123 Main St, City, Country",
    phone: "+1234567890",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
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
    },
  });
}
