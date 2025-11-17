import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { emailTemplates, sendEmail } from "../../../../lib/emailService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const orderId = parseInt(id as string);

  if (req.method === "GET") {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          customer: {
            select: {
              id: true,
              fullname: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: { message: "Order not found" },
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch order" },
      });
    }
  } else if (req.method === "PATCH" || req.method === "PUT") {
    try {
      const { status, trackingNumber } = req.body;

      console.log("📝 Updating order:", {
        orderId,
        newStatus: status,
        trackingNumber,
      });

      // Get current order to check previous status
      const currentOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!currentOrder) {
        console.error("❌ Order not found:", orderId);
        return res.status(404).json({
          success: false,
          error: { message: "Order not found" },
        });
      }

      console.log("📦 Current order status:", currentOrder.status);

      // Update order
      const updateData: any = {};
      if (status) updateData.status = status;
      if (trackingNumber !== undefined)
        updateData.trackingNumber = trackingNumber;

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      console.log(
        "✅ Order updated successfully. New status:",
        updatedOrder.status
      );

      // Send email notification if status changed
      // Use the customer's email if available
      const customerEmail = currentOrder.customer?.email;
      const customerName = currentOrder.customer?.fullname;

      if (status && status !== currentOrder.status && customerEmail) {
        console.log("📧 Status changed, sending email notification...");
        const statusEmailTemplate = emailTemplates.orderStatusUpdate(
          customerName || "Customer",
          currentOrder.orderNumber,
          status,
          trackingNumber,
          currentOrder.shippingAddress
        );

        sendEmail(
          customerEmail,
          statusEmailTemplate.subject,
          statusEmailTemplate.html
        )
          .then((result: any) => {
            if (result.success) {
              console.log(
                `✅ Order status update email sent to: ${
                  currentOrder?.customer?.email || ""
                }`
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
          statusChanged: status !== currentOrder.status,
          emailAvailable: !!customerEmail,
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
        error: { message: "Failed to update order" },
      });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
