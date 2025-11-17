import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const requests = await prisma.serviceRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({ requests });
    } catch (error) {
      console.error("Error fetching service requests:", error);
      return res.status(500).json({ message: "Failed to fetch requests" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
