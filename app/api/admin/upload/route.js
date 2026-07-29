import cloudinary from "@/lib/cloudinary";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";

export const maxDuration = 120; // Allow 2 minutes execution on Vercel/Next.js

export async function POST(request) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    let fileOrBase64 = null;
    let folder = "categories";

    const contentType = request.headers.get("content-type") || "";

    let originalName = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      folder = formData.get("folder") || folder;

      if (file) {
        if (typeof file === "object" && file.name) {
          originalName = file.name.replace(/\.[^/.]+$/, "");
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fileOrBase64 = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
      }
    } else {
      const body = await request.json();
      fileOrBase64 = body.image;
      if (body.folder) folder = body.folder;
    }

    if (!fileOrBase64) {
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

    const uploadedImage = await cloudinary.uploader.upload(fileOrBase64, uploadOptions);

    return response(true, 200, "Image uploaded successfully", {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return response(false, 500, error?.message || "Failed to upload image");
  }
}