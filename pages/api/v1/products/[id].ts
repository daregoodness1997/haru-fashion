import type { NextApiRequest, NextApiResponse } from "next";
import { mockProducts } from "../../../../data/mockProducts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const productId = parseInt(id as string);

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: { message: "Product not found" },
    });
  }

  // Format the response to match what the frontend expects
  const formattedProduct = {
    ...product,
    detail: product.description, // Use description as detail
    category: {
      name: product.category,
    },
  };

  res.status(200).json({
    success: true,
    data: formattedProduct,
  });
}
