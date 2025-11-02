import type { NextApiRequest, NextApiResponse } from "next";
import { mockProducts } from "../../../../data/mockProducts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category } = req.query;

  let filteredProducts = [...mockProducts];

  // Filter by category if provided
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // Return count in the format expected by the frontend
  res.status(200).json({
    success: true,
    count: filteredProducts.length,
  });
}
