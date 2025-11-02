import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, order_by, limit, offset } = req.query;

    // Build where clause
    const where: any = {};
    if (category && category !== "all") {
      where.category = category as string;
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" };
    if (order_by) {
      const [field, order] = (order_by as string).split(".");
      orderBy = { [field]: order || "asc" };
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : 0,
    });

    res.status(200).json({
      success: true,
      data: products,
      total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch products" },
    });
  }
}
