import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Collection from "@/models/Collection.model";

export async function GET() {
  try {
    await connectDB();

    const collections = await Collection.find({ isActive: true })
      .populate("parentCollection", "name slug")
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    return response(true, 200, "Collections fetched successfully", collections);
  } catch (error) {
    console.error("Public collections GET error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
