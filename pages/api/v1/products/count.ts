import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category } = req.query;

    // Build where clause
    const where: any = {};
    if (category && category !== "all") {
      where.category = category as string;
    }

    // Get count from database
    const count = await prisma.product.count({ where });

    // Return count in the format expected by the frontend
    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to count products" },
    });
  }
}
