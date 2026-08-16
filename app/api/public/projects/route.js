import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Project from "@/models/Project.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const segment = searchParams.get("segment");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const query = { status: "published" };

    if (segment) {
      query.segment = segment;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return response(true, 200, "Published projects fetched successfully", projects);
  } catch (error) {
    console.error("Get public projects error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
