import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";

import Category from "@/models/Category.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const categories = await Category.find({ deletedAt: null })
      .populate("parentCategory", "name")
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return response(true, 200, "Categories fetched", categories);
  } catch (error) {
    console.error("Admin categories error:", error);

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
      name,
      image,
      description = "",
      parentCategory = null,
      sortOrder = 0,
      isActive = true,
      seo = {},
    } = body;

    // Required validation
    if (!name?.trim()) {
      return response(false, 400, "Category name is required");
    }

    const normalizedName = name.trim();

    // Duplicate name check
    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i",
      },
      deletedAt: null,
    });

    if (existingCategory) {
      return response(false, 409, "Category already exists");
    }

    // Generate slug
    const slug = generateSlug(normalizedName);

    // Extra safety for duplicate slugs
    const existingSlug = await Category.findOne({
      slug,
      deletedAt: null,
    });

    if (existingSlug) {
      return response(false, 409, "Slug already exists");
    }

    // Parent category validation
    if (parentCategory) {
      const parent = await Category.findOne({
        _id: parentCategory,
        deletedAt: null,
      });

      if (!parent) {
        return response(false, 404, "Parent category not found");
      }
    }

    const category = await Category.create({
      name: normalizedName,
      slug,
      image,
      description,
      parentCategory,
      sortOrder,
      isActive,
      seo,
    });

    return response(
      true,
      201,
      "Category created successfully",
      category
    );
  } catch (error) {
    console.error("Create category error:", error);

    return response(false, 500, "Internal Server Error");
  }
}
    