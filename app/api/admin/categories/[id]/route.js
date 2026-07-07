import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import cloudinary from "@/lib/cloudinary";

import Category from "@/models/Category.model";

async function updateChildrenLevels(parentId, level) {
  const children = await Category.find({
    parentCategory: parentId,
    deletedAt: null,
  });

  for (const child of children) {
    child.categoryLevel = level + 1;

    await child.save();

    await updateChildrenLevels(child._id, child.categoryLevel);
  }
}

async function isDescendant(parentId, childId) {
  let current = await Category.findById(parentId).select("parentCategory");

  while (current?.parentCategory) {
    if (current.parentCategory.toString() === childId.toString()) {
      return true;
    }

    current = await Category.findById(current.parentCategory).select(
      "parentCategory",
    );
  }

  return false;
}

export async function PATCH(request, { params }) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const {
      name,
      bannerImage,
      description = "",
      parentCategory = null,
      sortOrder = 0,
      isActive = true,
      seo = {},
    } = body;

    const category = await Category.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!category) {
      return response(false, 404, "Category not found");
    }

    if (!name?.trim()) {
      return response(false, 400, "Category name is required");
    }

    const normalizedName = name.trim();

    // Duplicate name check
    const duplicate = await Category.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i",
      },
      deletedAt: null,
    });

    if (duplicate) {
      return response(false, 409, "Category already exists");
    }

    const slug = generateSlug(normalizedName);

    const duplicateSlug = await Category.findOne({
      _id: { $ne: id },
      slug,
      deletedAt: null,
    });

    if (duplicateSlug) {
      return response(false, 409, "Slug already exists");
    }

    let categoryLevel = 1;

    if (parentCategory) {
      if (parentCategory === id) {
        return response(false, 400, "Category cannot be its own parent");
      }
      if (await isDescendant(parentCategory, id)) {
        return response(
          false,
          400,
          "Cannot move a category inside one of its own children",
        );
      }

      const parent = await Category.findOne({
        _id: parentCategory,
        deletedAt: null,
      });

      if (!parent) {
        return response(false, 404, "Parent category not found");
      }

      if (parent.categoryLevel >= 3) {
        return response(false, 400, "Level 3 categories cannot have children");
      }

      categoryLevel = parent.categoryLevel + 1;

      if (categoryLevel > 3) {
        return response(false, 400, "Maximum category depth is 3 levels");
      }
    }

    category.name = normalizedName;
    category.slug = slug;
    category.bannerImage = bannerImage;
    category.description = description;
    category.parentCategory = parentCategory || null;
    category.categoryLevel = categoryLevel;
    category.sortOrder = sortOrder;
    category.isActive = isActive;
    category.seo = seo;

    await category.save();
    await updateChildrenLevels(category._id, categoryLevel);

    return response(true, 200, "Category updated successfully", category);
  } catch (error) {
    console.error(error);

    return response(false, 500, "Internal Server Error");
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const { id } = await params;

    const category = await Category.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!category) {
      return response(false, 404, "Category not found");
    }

    // Prevent deleting category having children
    const hasChildren = await Category.exists({
      parentCategory: id,
      deletedAt: null,
    });

    if (hasChildren) {
      return response(false, 400, "Delete child categories first");
    }

    if (Array.isArray(category.bannerImage)) {
      for (const image of category.bannerImage) {
        if (image?.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    category.deletedAt = new Date();

    await category.save();

    return response(true, 200, "Category deleted successfully");
  } catch (error) {
    console.error(error);

    return response(false, 500, "Internal Server Error");
  }
}
