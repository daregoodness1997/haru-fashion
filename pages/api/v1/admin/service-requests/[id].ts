import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const request = await prisma.serviceRequest.update({
        where: { id: Number(id) },
        data: { status },
      });

      return res.status(200).json({ success: true, request });
    } catch (error) {
      console.error("Error updating service request:", error);
      return res.status(500).json({ message: "Failed to update request" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
