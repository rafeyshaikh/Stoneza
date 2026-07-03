import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Review from "@/models/Review.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(100).lean();

    return response(true, 200, "Reviews fetched", reviews);
  } catch (error) {
    console.error("Admin reviews error", error);
    return response(false, 500, "Internal Server Error");
  }
}
