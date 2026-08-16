import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import Project from "@/models/Project.model";

export async function GET(request, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id).lean();

    if (!project) {
      return response(false, 404, "Project not found");
    }

    return response(true, 200, "Project fetched successfully", project);
  } catch (error) {
    console.error("Get single project error:", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      return response(false, 404, "Project not found");
    }

    const {
      title,
      slug: customSlug,
      description,
      segment,
      location,
      application,
      stone,
      products,
      supply,
      bannerImage,
      images,
      isFeatured,
      status,
      seo,
    } = body;

    let updatedFields = {};

    if (title !== undefined) {
      const normalizedTitle = title.trim();
      if (!normalizedTitle) {
        return response(false, 400, "Project title cannot be empty");
      }
      updatedFields.title = normalizedTitle;

      if (customSlug?.trim()) {
        const slug = generateSlug(customSlug.trim());
        const slugCheck = await Project.findOne({ slug, _id: { $ne: id } });
        if (slugCheck) {
          return response(false, 409, "Slug is already in use by another project");
        }
        updatedFields.slug = slug;
      }
    }

    if (description !== undefined) updatedFields.description = description.trim();
    if (segment !== undefined) {
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
      updatedFields.segment = segment;
    }

    if (location !== undefined) updatedFields.location = location;
    if (application !== undefined) updatedFields.application = Array.isArray(application) ? application : [];
    if (stone !== undefined) updatedFields.stone = stone?.trim() || "";
    if (products !== undefined) updatedFields.products = Array.isArray(products) ? products : [];
    if (supply !== undefined) updatedFields.supply = supply?.trim() || "";
    if (bannerImage !== undefined) updatedFields.bannerImage = bannerImage;
    if (images !== undefined) updatedFields.images = Array.isArray(images) ? images : [];
    if (isFeatured !== undefined) updatedFields.isFeatured = Boolean(isFeatured);
    if (status !== undefined) updatedFields.status = status;
    if (seo !== undefined) updatedFields.seo = seo;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    return response(true, 200, "Project updated successfully", updatedProject);
  } catch (error) {
    console.error("Update project error:", error);
    return response(false, 500, error.message || "Internal Server Error");
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    const { id } = await params;
    await connectDB();

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return response(false, 404, "Project not found");
    }

    return response(true, 200, "Project deleted successfully");
  } catch (error) {
    console.error("Delete single project error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
