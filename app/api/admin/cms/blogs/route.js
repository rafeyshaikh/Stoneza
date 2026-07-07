import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";

import Blog from "@/models/Blog.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const blogs = await Blog.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    return response(
      true,
      200,
      "Blogs fetched successfully",
      blogs,
    );
  } catch (error) {
    console.error("Get blogs error:", error);

    return response(
      false,
      500,
      "Internal Server Error",
    );
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
      excerpt = "",
      content,
      bannerImage,
      tags = [],
      status = "draft",
      seo = {},
    } = body;

    if (!title?.trim()) {
      return response(
        false,
        400,
        "Blog title is required",
      );
    }

    if (!content?.trim()) {
      return response(
        false,
        400,
        "Blog content is required",
      );
    }

    if (!bannerImage?.url) {
      return response(
        false,
        400,
        "Blog banner is required",
      );
    }

    const normalizedTitle = title.trim();

    const slug = generateSlug(normalizedTitle);

    const existingBlog = await Blog.findOne({
      slug,
    });

    if (existingBlog) {
      return response(
        false,
        409,
        "Blog already exists",
      );
    }

    const blog = await Blog.create({
      title: normalizedTitle,

      slug,

      excerpt,

      content,

      bannerImage,

      tags,

      status,

      publishedAt:
        status === "published"
          ? new Date()
          : null,

      seo,
    });

    return response(
      true,
      201,
      "Blog created successfully",
      blog,
    );
  } catch (error) {
    console.error("Create blog error:", error);

    return response(
      false,
      500,
      "Internal Server Error",
    );
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

    const ids = Array.isArray(body.ids)
      ? body.ids
      : [];

    if (!ids.length) {
      return response(
        false,
        400,
        "No blog IDs provided",
      );
    }

    await Blog.deleteMany({
      _id: {
        $in: ids,
      },
    });

    return response(
      true,
      200,
      "Blogs deleted successfully",
    );
  } catch (error) {
    console.error("Delete blogs error:", error);

    return response(
      false,
      500,
      "Internal Server Error",
    );
  }
}