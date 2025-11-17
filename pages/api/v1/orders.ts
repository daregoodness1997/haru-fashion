import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { emailTemplates, sendEmail } from "../../../lib/emailService";
import { Prisma } from "@prisma/client";

// Type for order with relations
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
    customer: true;
  };
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalPrice,
        deliveryDate,
        paymentType,
        deliveryType,
        products,
        sendEmail: shouldSendEmail,
        currency,
        status,
      } = req.body;

      // Debug logging
      console.log("📦 Creating order with data:", {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalPrice,
        deliveryDate,
        paymentType,
        deliveryType,
        productsCount: products?.length,
        shouldSendEmail,
      });

      // Validate required fields
      if (
        !shippingAddress ||
        totalPrice === undefined ||
        totalPrice === null ||
        !products ||
        !Array.isArray(products) ||
        products.length === 0 ||
        !customerEmail ||
        !customerName
      ) {
        console.error("❌ Missing required fields:", {
          customerId: !!customerId,
          customerName: !!customerName,
          customerEmail: !!customerEmail,
          shippingAddress: !!shippingAddress,
          totalPrice: totalPrice,
          products: products,
          productsLength: products?.length,
        });
        return res.status(400).json({
          success: false,
          error: {
            message:
              "Missing required fields. Email, name, and products are required.",
          },
        });
      }

      // Convert totalPrice to number if it's a string
      const totalPriceNumber =
        typeof totalPrice === "string" ? parseFloat(totalPrice) : totalPrice;

      // Create order with order items
      const orderData: any = {
        shippingAddress,
        paymentType: paymentType || "CASH_ON_DELIVERY",
        deliveryType: deliveryType || "STORE_PICKUP",
        totalPrice: totalPriceNumber,
        currency: currency || "USD",
        status: status || "pending", // Allow custom status (e.g., pending_payment for Paystack)
        deliveryDate: deliveryDate
          ? new Date(deliveryDate)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sendEmail: shouldSendEmail || false,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone || null,
        orderItems: {
          create: await Promise.all(
            products.map(
              async (item: { id: number; quantity: number; size?: string }) => {
                const product = await prisma.product.findUnique({
                  where: { id: item.id },
                });
                return {
                  productId: item.id,
                  quantity: item.quantity,
                  price: product?.price || 0,
                  size: item.size || "M",
                };
              }
            )
          ),
        },
      };

      // Only add customerId if it exists (logged in user)
      if (customerId) {
        orderData.customerId = customerId;
      }

      const newOrder: OrderWithRelations = (await prisma.order.create({
        data: orderData,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      })) as OrderWithRelations;

      // Determine customer details (from user or from request)
      const customerFullname = newOrder.customer?.fullname || customerName;
      const customerEmailAddress = newOrder.customer?.email || customerEmail;

      // Send order confirmation email to customer (non-blocking)
      if (customerEmailAddress && shouldSendEmail) {
        const customerEmailTemplate = emailTemplates.orderConfirmation(
          customerFullname,
          newOrder.orderNumber,
          newOrder.totalPrice,
          newOrder.orderItems,
          newOrder.shippingAddress,
          currency || "USD"
        );
        sendEmail(
          customerEmailAddress,
          customerEmailTemplate.subject,
          customerEmailTemplate.html
        )
          .then((result: any) => {
            if (result.success) {
              console.log(
                "✅ Order confirmation sent to:",
                customerEmailAddress
              );
            } else {
              console.error(
                "❌ Failed to send order confirmation:",
                result.error
              );
            }
          })
          .catch((err: any) => {
            console.error("❌ Order confirmation error:", err);
          });
      }

      // Send order notification to admin (non-blocking)
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const adminEmailTemplate = emailTemplates.newOrderAdminNotification(
          customerFullname,
          customerEmailAddress,
          newOrder.orderNumber,
          newOrder.totalPrice,
          newOrder.orderItems,
          currency || "USD"
        );
        sendEmail(
          adminEmail,
          adminEmailTemplate.subject,
          adminEmailTemplate.html
        )
          .then((result: any) => {
            if (result.success) {
              console.log("✅ Admin order notification sent to:", adminEmail);
            } else {
              console.error(
                "❌ Failed to send admin order notification:",
                result.error
              );
            }
          })
          .catch((err: any) => {
            console.error("❌ Admin order notification error:", err);
          });
      }

      return res.status(201).json({
        success: true,
        data: newOrder,
        message: "Order created successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        error: {
          message: "Failed to create order",
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  } else if (req.method === "GET") {
    try {
      const { customerId } = req.query;

      const where: any = {};
      if (customerId) {
        where.customerId = parseInt(customerId as string);
      }

      const orders = await prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          orderDate: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch orders" },
      });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
