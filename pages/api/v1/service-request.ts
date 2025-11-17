import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { sendServiceRequestEmail } from "../../../lib/emailService";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import prisma from "../../../lib/prisma";

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse form data
    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Extract fields
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const message = Array.isArray(fields.message)
      ? fields.message[0]
      : fields.message;
    const service = Array.isArray(fields.service)
      ? fields.service[0]
      : fields.service;
    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;
    const measurementsStr = Array.isArray(fields.measurements)
      ? fields.measurements[0]
      : fields.measurements;

    // Validate required fields
    if (!name || !email || !phone || !message || !service) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse measurements if provided
    let measurements = null;
    if (measurementsStr) {
      try {
        measurements = JSON.parse(measurementsStr);
      } catch (e) {
        console.error("Error parsing measurements:", e);
      }
    }

    // Handle image uploads if present
    const imageUrls: string[] = [];
    if (files.images) {
      const imageFiles = Array.isArray(files.images)
        ? files.images
        : [files.images];

      for (const file of imageFiles) {
        try {
          const fileBuffer = fs.readFileSync(file.filepath);
          const uploadResult = await uploadToCloudinary(
            fileBuffer,
            "service-requests"
          );
          imageUrls.push(uploadResult.secure_url);
          // Clean up temp file
          fs.unlinkSync(file.filepath);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }

    // Save to database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        serviceType: service,
        name,
        email,
        phone,
        message,
        images: imageUrls,
        measurements: measurements || undefined,
        status: "pending",
      },
    });

    // Send email notification
    await sendServiceRequestEmail({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message,
      serviceType: service,
      category: category || "general",
      images: imageUrls,
      measurements,
    });

    return res.status(200).json({
      success: true,
      message: "Service request sent successfully",
      data: serviceRequest,
    });
  } catch (error) {
    console.error("Error processing service request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send service request",
    });
  }
}
