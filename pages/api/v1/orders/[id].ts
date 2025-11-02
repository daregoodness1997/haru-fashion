import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const orderId = parseInt(id as string);

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
}
