import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AdminApiRequest extends NextApiRequest {
  adminUser?: {
    id: number;
    email: string;
    fullname: string;
    isAdmin: boolean;
  };
}

/**
 * Middleware to verify admin authentication
 * Expects userId in request body or query params
 */
export async function verifyAdmin(
  req: AdminApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    // Get user ID from body or query
    const userId = req.body?.userId || req.query?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Authentication required",
        },
      });
      return false;
    }

    // Verify user exists and is admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId as string) },
      select: {
        id: true,
        email: true,
        fullname: true,
        isAdmin: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "User not found",
        },
      });
      await prisma.$disconnect();
      return false;
    }

    if (!user.isAdmin) {
      res.status(403).json({
        success: false,
        error: {
          message: "Admin access required",
        },
      });
      await prisma.$disconnect();
      return false;
    }

    // Attach admin user to request
    req.adminUser = user;
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
    await prisma.$disconnect();
    return false;
  }
}
