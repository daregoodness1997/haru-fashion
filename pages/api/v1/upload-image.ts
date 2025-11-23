import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { verifyAdmin } from "../../../lib/adminMiddleware";

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Helper to run multer middleware
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: { message: "Method not allowed" },
    });
  }

  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(req as any, res);
    if (!isAdmin) return;

    // Run multer middleware
    await runMiddleware(req, res, upload.single("image"));

    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: { message: "No image file provided" },
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      file.buffer,
      "Shunapee Fashion House-fashion/products"
    );

    return res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || "Failed to upload image",
      },
    });
  }
}
