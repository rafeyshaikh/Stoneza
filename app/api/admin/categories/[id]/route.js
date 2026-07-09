import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import cloudinary from "@/lib/cloudinary";
import { revalidateTag } from "next/cache";

import Category from "@/models/Category.model";

async function updateChildrenLevels(parentId, level) {
  const children = await Category.find({
    parentCategory: parentId,
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
    });

    if (duplicate) {
      return response(false, 409, "Category already exists");
    }

    const slug = generateSlug(normalizedName);

    const duplicateSlug = await Category.findOne({
      _id: { $ne: id },
      slug,
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

    // Cloudinary cleanup of overwritten/deleted images
    const oldSquareId = category.bannerImage?.square?.publicId;
    const newSquareId = bannerImage?.square?.publicId;
    if (oldSquareId && oldSquareId !== newSquareId) {
      try {
        await cloudinary.uploader.destroy(oldSquareId);
      } catch (err) {
        console.error("Failed to delete old square image from Cloudinary:", err);
      }
    }

    const oldWideIds = (category.bannerImage?.wide || [])
      .map(img => img?.publicId)
      .filter(Boolean);
    const newWideIds = new Set(
      (bannerImage?.wide || [])
        .map(img => img?.publicId)
        .filter(Boolean)
    );

    for (const oldId of oldWideIds) {
      if (!newWideIds.has(oldId)) {
        try {
          await cloudinary.uploader.destroy(oldId);
        } catch (err) {
          console.error(`Failed to delete old wide image ${oldId} from Cloudinary:`, err);
        }
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

    revalidateTag("layout-categories");
    revalidateTag("public-categories");

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
    });

    if (hasChildren) {
      return response(false, 400, "Delete child categories first");
    }

    if (category.bannerImage?.square?.publicId) {
      try {
        await cloudinary.uploader.destroy(category.bannerImage.square.publicId);
      } catch (err) {
        console.error("Failed to delete square image on delete:", err);
      }
    }

    if (Array.isArray(category.bannerImage?.wide)) {
      for (const image of category.bannerImage.wide) {
        if (image?.publicId) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (err) {
            console.error(`Failed to delete wide image ${image.publicId} on delete:`, err);
          }
        }
      }
    }

    await Category.findByIdAndDelete(id);

    revalidateTag("layout-categories");
    revalidateTag("public-categories");

    return response(true, 200, "Category deleted successfully");
  } catch (error) {
    console.error(error);

    return response(false, 500, "Internal Server Error");
  }
}
