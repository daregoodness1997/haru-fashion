import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin, AdminApiRequest } from "../../../../lib/adminMiddleware";

const prisma = new PrismaClient();

export default async function handler(
  req: AdminApiRequest,
  res: NextApiResponse
) {
  // POST - Create new product (admin only)
  if (req.method === "POST") {
    // Verify admin access
    const isAdmin = await verifyAdmin(req, res);
    if (!isAdmin) return;

    try {
      const { name, price, category, image1, image2, description } = req.body;

      // Validate required fields
      if (!name || !price || !category || !image1 || !image2 || !description) {
        return res.status(400).json({
          success: false,
          error: {
            message: "All product fields are required",
          },
        });
      }

      // Create product
      const product = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          category,
          image1,
          image2,
          description,
        },
      });

      return res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  // PUT - Update product (admin only)
  if (req.method === "PUT") {
    // Verify admin access
    const isAdmin = await verifyAdmin(req, res);
    if (!isAdmin) return;

    try {
      const { id, name, price, category, image1, image2, description } =
        req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Product ID is required",
          },
        });
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Product not found",
          },
        });
      }

      // Update product
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(price && { price: parseFloat(price) }),
          ...(category && { category }),
          ...(image1 && { image1 }),
          ...(image2 && { image2 }),
          ...(description && { description }),
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  // DELETE - Delete product (admin only)
  if (req.method === "DELETE") {
    // Verify admin access
    const isAdmin = await verifyAdmin(req, res);
    if (!isAdmin) return;

    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Product ID is required",
          },
        });
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id as string) },
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Product not found",
          },
        });
      }

      // Delete product
      await prisma.product.delete({
        where: { id: parseInt(id as string) },
      });

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: {
      message: "Method not allowed",
    },
  });
}
