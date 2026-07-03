import cloudinary from "@/lib/cloudinary";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    const { image, folder = "categories" } = await request.json();

    if (!image) {
      return response(false, 400, "Image is required");
    }

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: `stoneza/${folder}`,
    });

    return response(true, 200, "Image uploaded successfully", {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return response(false, 500, "Failed to upload image");
  }
}