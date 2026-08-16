import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import Project from "@/models/Project.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .lean();

    return response(true, 200, "Projects fetched successfully", projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function POST(request) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const body = await request.json();

    const {
      title,
      slug: customSlug,
      description = "",
      segment,
      location = {},
      application = [],
      stone = "",
      products = [],
      supply = "",
      bannerImage = null,
      images = [],
      isFeatured = false,
      status = "published",
      seo = {},
    } = body;

    if (!title?.trim()) {
      return response(false, 400, "Project title is required");
    }

    if (!description?.trim()) {
      return response(false, 400, "Project description is required");
    }

    if (!segment) {
      return response(false, 400, "Project segment is required");
    }

    const validSegments = [
      "Hospitality",
      "Residential",
      "Landscape",
      "Commercial",
      "Export",
      "other",
      "Other",
    ];

    if (!validSegments.includes(segment)) {
      return response(false, 400, "Invalid project segment");
    }

    const normalizedTitle = title.trim();
    const slug = customSlug?.trim()
      ? generateSlug(customSlug.trim())
      : generateSlug(normalizedTitle);

    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return response(false, 409, "A project with this title or slug already exists");
    }

    const project = await Project.create({
      title: normalizedTitle,
      slug,
      description: description.trim(),
      segment,
      location,
      application: Array.isArray(application) ? application : [],
      stone: stone?.trim() || "",
      products: Array.isArray(products) ? products : [],
      supply: supply?.trim() || "",
      bannerImage,
      images: Array.isArray(images) ? images : [],
      isFeatured: Boolean(isFeatured),
      status: status || "published",
      seo,
    });

    return response(true, 201, "Project created successfully", project);
  } catch (error) {
    console.error("Create project error:", error);
    return response(false, 500, error.message || "Internal Server Error");
  }
}

export async function DELETE(request) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];

    if (!ids.length) {
      return response(false, 400, "No project IDs provided");
    }

    await Project.deleteMany({
      _id: { $in: ids },
    });

    return response(true, 200, "Projects deleted successfully");
  } catch (error) {
    console.error("Delete projects error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
