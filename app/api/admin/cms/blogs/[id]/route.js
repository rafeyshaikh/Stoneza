import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";

import Blog from "@/models/Blog.model";

export async function GET(_, { params }) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const blog = await Blog.findById(params.id).lean();

    if (!blog) {
      return response(false, 404, "Blog not found");
    }

    return response(true, 200, "Blog fetched successfully", blog);
  } catch (error) {
    console.error("Get blog error:", error);

    return response(false, 500, "Internal Server Error");
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return response(false, 404, "Blog not found");
    }

    const body = await request.json();

    const {
      title,
      excerpt = "",
      content,
      bannerImage,
      tags = [],
      status = "draft",
      seo = {},
    } = body;

    if (!title?.trim()) {
      return response(false, 400, "Blog title is required");
    }

    if (!content?.trim()) {
      return response(false, 400, "Blog content is required");
    }

    if (!bannerImage?.url) {
      return response(false, 400, "Blog banner is required");
    }

    const normalizedTitle = title.trim();

    const slug = generateSlug(normalizedTitle);

    const duplicateBlog = await Blog.findOne({
      _id: {
        $ne: id,
      },
      slug,
    });

    if (duplicateBlog) {
      return response(false, 409, "Another blog already uses this title");
    }

    existingBlog.title = normalizedTitle;
    existingBlog.slug = slug;
    existingBlog.excerpt = excerpt;
    existingBlog.content = content;
    existingBlog.bannerImage = bannerImage;
    existingBlog.tags = tags;
    existingBlog.status = status;
    existingBlog.seo = seo;

    if (
      status === "published" &&
      !existingBlog.publishedAt
    ) {
      existingBlog.publishedAt = new Date();
    }

    if (status === "draft") {
      existingBlog.publishedAt = null;
    }

    await existingBlog.save();

    return response(
      true,
      200,
      "Blog updated successfully",
      existingBlog
    );
  } catch (error) {
    console.error("Update blog error:", error);

    return response(false, 500, "Internal Server Error");
  }
}

export async function DELETE(_, { params }) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const deletedBlog = await Blog.findByIdAndDelete(
      params.id
    );

    if (!deletedBlog) {
      return response(false, 404, "Blog not found");
    }

    return response(
      true,
      200,
      "Blog deleted successfully"
    );
  } catch (error) {
    console.error("Delete blog error:", error);

    return response(false, 500, "Internal Server Error");
  }
}