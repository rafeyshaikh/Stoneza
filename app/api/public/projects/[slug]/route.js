import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Project from "@/models/Project.model";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const project = await Project.findOne({ slug, status: "published" }).lean();

    if (!project) {
      return response(false, 404, "Project not found");
    }

    return response(true, 200, "Project details fetched successfully", project);
  } catch (error) {
    console.error("Get public project by slug error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
