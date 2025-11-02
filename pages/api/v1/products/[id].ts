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
    const { id } = req.query;
    const productId = parseInt(id as string);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: "Product not found" },
      });
    }

    // Format the response to match what the frontend expects
    const formattedProduct = {
      ...product,
      image1: product.image1,
      image2: product.image2,
      detail: product.description, // Use description as detail
      category: {
        name: product.category,
      },
    };

    res.status(200).json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch product" },
    });
  }
}
