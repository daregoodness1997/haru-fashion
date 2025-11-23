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
 * Expects Authorization header with token or userId in body/query as fallback
 */
export async function verifyAdmin(
  req: AdminApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    let userId: string | undefined;

    // Try to get user ID from Authorization header token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        // Decode the base64 token to get email
        const decoded = Buffer.from(token, "base64").toString("utf-8");
        const email = decoded.split(":")[0];

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });

        if (user) {
          userId = user.id.toString();
        }
      } catch (error) {
        console.error("[Admin Middleware] Token decode error:", error);
      }
    }

    // Fallback to userId in body or query for backwards compatibility
    if (!userId) {
      userId = req.body?.userId || req.query?.userId;
    }

    console.log(
      "[Admin Middleware] Resolved userId:",
      userId,
      "Method:",
      req.method
    );

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

    console.log(
      "[Admin Middleware] User lookup result:",
      user ? `Found: ${user.email} (isAdmin: ${user.isAdmin})` : "Not found"
    );

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: `User not found with ID: ${userId}. Please log out and log in again.`,
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
