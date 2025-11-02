import type { NextApiRequest, NextApiResponse } from "next";
import { mockProducts } from "../../../data/mockProducts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, order_by, limit, offset } = req.query;

  let filteredProducts = [...mockProducts];

  // Filter by category
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // Sort by order_by parameter (e.g., "createdAt.desc")
  if (order_by) {
    const [field, order] = (order_by as string).split(".");
    filteredProducts.sort((a, b) => {
      const aValue = a[field as keyof typeof a];
      const bValue = b[field as keyof typeof b];
      
      if (order === "desc") {
        return aValue > bValue ? -1 : 1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }

  // Apply pagination
  const limitNum = limit ? parseInt(limit as string) : filteredProducts.length;
  const offsetNum = offset ? parseInt(offset as string) : 0;
  
  const paginatedProducts = filteredProducts.slice(
    offsetNum,
    offsetNum + limitNum
  );

  // Return in the format expected by the frontend
  res.status(200).json({
    success: true,
    data: paginatedProducts,
    total: filteredProducts.length,
  });
}
