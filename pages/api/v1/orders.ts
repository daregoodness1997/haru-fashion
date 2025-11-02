import type { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory store for demo purposes
let orders: any[] = [];
let orderCounter = 1000;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        customerId,
        shippingAddress,
        totalPrice,
        deliveryDate,
        paymentType,
        deliveryType,
        products,
        sendEmail,
      } = req.body;

      // Validate required fields
      if (!customerId || !shippingAddress || !totalPrice || !products) {
        return res.status(400).json({
          success: false,
          error: { message: "Missing required fields" },
        });
      }

      // Create new order
      const newOrder = {
        orderNumber: orderCounter++,
        customerId,
        shippingAddress,
        township: null,
        city: null,
        state: null,
        zipCode: null,
        orderDate: new Date().toISOString(),
        paymentType: paymentType || "CASH_ON_DELIVERY",
        deliveryType: deliveryType || "STORE_PICKUP",
        totalPrice,
        deliveryDate:
          deliveryDate || new Date().setDate(new Date().getDate() + 7),
        products,
        sendEmail: sendEmail || false,
      };

      orders.push(newOrder);

      return res.status(201).json({
        success: true,
        data: newOrder,
        message: "Order created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to create order" },
      });
    }
  } else if (req.method === "GET") {
    // Get all orders or filter by customerId
    const { customerId } = req.query;

    let filteredOrders = orders;
    if (customerId) {
      filteredOrders = orders.filter(
        (order) => order.customerId === parseInt(customerId as string)
      );
    }

    return res.status(200).json({
      success: true,
      data: filteredOrders,
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
