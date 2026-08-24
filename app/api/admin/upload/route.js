import cloudinary from "@/lib/cloudinary";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";

export const maxDuration = 120; // Allow 2 minutes execution on Vercel/Next.js

function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function POST(request) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    const contentType = request.headers.get("content-type") || "";
    let buffer = null;
    let base64String = null;
    let folder = "categories";
    let originalName = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      folder = formData.get("folder") || folder;

      if (file && typeof file === "object") {
        if (file.name) {
          originalName = file.name.replace(/\.[^/.]+$/, "");
        }
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }
    } else {
      const body = await request.json();
      base64String = body.image;
      if (body.folder) folder = body.folder;
    }

    if (!buffer && !base64String) {
      return response(false, 400, "Image file is required");
    }

    const uploadOptions = {
      folder: `stoneza/${folder}`,
      resource_type: "auto",
      timeout: 120000,
    };

    if (originalName) {
      const sanitizedSlug = originalName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (sanitizedSlug) {
        uploadOptions.public_id = `${sanitizedSlug}-${Date.now().toString(36)}`;
      }
    }

    let uploadedImage;
    if (buffer) {
      uploadedImage = await uploadBufferToCloudinary(buffer, uploadOptions);
    } else {
      uploadedImage = await cloudinary.uploader.upload(base64String, uploadOptions);
    }

    return response(true, 200, "Image uploaded successfully", {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return response(false, 500, error?.message || "Failed to upload image");
  }
}