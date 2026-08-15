import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    // Ensure connection to MongoDB
    await connectDB();

    // Revalidate Next.js cache tags and paths
    try {
      revalidateTag("layout-categories");
      revalidateTag("products");
      revalidateTag("categories");
      revalidateTag("cms");
      revalidatePath("/", "layout");
    } catch (cacheErr) {
      console.warn("Revalidation warning:", cacheErr);
    }

    return response(true, 200, "Database cache successfully flushed and revalidated.", {
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin revalidate error:", error);
    return response(false, 500, "Failed to flush database cache: " + error.message);
  }
}
