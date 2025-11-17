import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin, AdminApiRequest } from "../../../../lib/adminMiddleware";
import { emailTemplates, sendEmail } from "../../../../lib/emailService";

const prisma = new PrismaClient();

export default async function handler(
  req: AdminApiRequest,
  res: NextApiResponse
) {
  // GET - Get all orders (admin only)
  if (req.method === "GET") {
    // Verify admin access
    const isAdmin = await verifyAdmin(req, res);
    if (!isAdmin) return;

    try {
      const { status, page = "1", limit = "20" } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      const where: any = {};
      if (status && status !== "all") {
        where.status = status;
      }

      // Get orders with customer and items
      const orders = await prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              fullname: true,
              phone: true,
            },
          },
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limitNum,
      });

      // Get total count
      const totalCount = await prisma.order.count({ where });

      return res.status(200).json({
        success: true,
        data: orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum),
        },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  // PUT - Update order status (admin only)
  if (req.method === "PUT") {
    // Verify admin access
    const isAdmin = await verifyAdmin(req, res);
    if (!isAdmin) return;

    try {
      const { orderId, status, trackingNumber } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Order ID is required",
          },
        });
      }

      // Validate status
      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid order status",
          },
        });
      }

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Order not found",
          },
        });
      }

      console.log("📝 Admin updating order:", {
        orderId,
        currentStatus: existingOrder.status,
        newStatus: status,
        trackingNumber,
      });

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          ...(status && { status }),
          ...(trackingNumber !== undefined && { trackingNumber }),
        },
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              fullname: true,
              phone: true,
            },
          },
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      console.log("✅ Order updated successfully by admin");

      // Send email notification if status changed
      // For guest orders, use customerEmail; for user orders, use customer.email
      const customerEmail =
        existingOrder.customer?.email || existingOrder.customerEmail;
      const customerName =
        existingOrder.customer?.fullname || existingOrder.customerName;

      if (status && status !== existingOrder.status && customerEmail) {
        console.log(
          "📧 Status changed, sending email notification to customer..."
        );

        const statusEmailTemplate = emailTemplates.orderStatusUpdate(
          customerName || "Customer",
          existingOrder.orderNumber,
          status,
          trackingNumber || existingOrder.trackingNumber,
          existingOrder.shippingAddress
        );

        sendEmail(
          customerEmail,
          statusEmailTemplate.subject,
          statusEmailTemplate.html
        )
          .then((result: any) => {
            if (result.success) {
              console.log(
                `✅ Order status update email sent to: ${existingOrder.customer.email}`
              );
            } else {
              console.error(
                "❌ Failed to send status update email:",
                result.error
              );
            }
          })
          .catch((err: any) => {
            console.error("❌ Status update email error:", err);
          });
      } else {
        console.log("ℹ️ Email notification skipped:", {
          statusProvided: !!status,
          statusChanged: status && status !== existingOrder.status,
          emailAvailable: !!existingOrder.customer.email,
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedOrder,
        message: "Order updated successfully",
      });
    } catch (error) {
      console.error("Error updating order:", error);
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
