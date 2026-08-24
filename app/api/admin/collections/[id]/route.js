import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath, revalidateTag } from "next/cache";
import Collection from "@/models/Collection.model";

async function updateChildrenLevels(parentId, level) {
  const children = await Collection.find({
    parentCollection: parentId,
  });

  for (const child of children) {
    child.collectionLevel = level + 1;
    await child.save();
    await updateChildrenLevels(child._id, child.collectionLevel);
  }
}

async function isDescendant(parentId, childId) {
  let current = await Collection.findById(parentId).select("parentCollection");

  while (current?.parentCollection) {
    if (current.parentCollection.toString() === childId.toString()) {
      return true;
    }
    current = await Collection.findById(current.parentCollection).select("parentCollection");
  }

  return false;
}

export async function GET(request, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) return admin.response;

    await connectDB();
    const { id } = await params;

    const collection = await Collection.findById(id).populate("parentCollection", "name").lean();
    if (!collection) {
      return response(false, 404, "Collection not found");
    }

    return response(true, 200, "Collection details", collection);
  } catch (error) {
    console.error("GET collection detail error:", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) return admin.response;

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      bannerImage,
      description = "",
      parentCollection = null,
      sortOrder = 0,
      isActive = true,
      seo = {},
    } = body;

    const collection = await Collection.findById(id);
    if (!collection) {
      return response(false, 404, "Collection not found");
    }

    if (!name?.trim()) {
      return response(false, 400, "Collection name is required");
    }

    const normalizedName = name.trim();

    const duplicate = await Collection.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i",
      },
    });

    if (duplicate) {
      return response(false, 409, "Collection already exists");
    }

    const slug = generateSlug(body.slug || normalizedName);
    if (!slug) {
      return response(false, 400, "Valid slug is required");
    }

    const duplicateSlug = await Collection.findOne({
      _id: { $ne: id },
      slug,
    });

    if (duplicateSlug) {
      return response(
        false,
        409,
        `Slug "${slug}" already exists. Please choose a unique slug.`
      );
    }

    let collectionLevel = 1;

    if (parentCollection) {
      if (parentCollection === id) {
        return response(false, 400, "Collection cannot be its own parent");
      }
      if (await isDescendant(parentCollection, id)) {
        return response(false, 400, "Cannot move a collection inside one of its own children");
      }

      const parent = await Collection.findById(parentCollection);
      if (!parent) {
        return response(false, 404, "Parent collection not found");
      }

      if (parent.collectionLevel >= 2) {
        return response(false, 400, "Level 2 collections cannot have children");
      }

      collectionLevel = parent.collectionLevel + 1;

      if (collectionLevel > 2) {
        return response(false, 400, "Maximum collection depth is 2 levels");
      }
    }

    // Cloudinary image cleanup
    const oldSquareId = collection.bannerImage?.square?.publicId;
    const newSquareId = bannerImage?.square?.publicId;
    if (oldSquareId && oldSquareId !== newSquareId) {
      try {
        await cloudinary.uploader.destroy(oldSquareId);
      } catch (err) {
        console.error("Failed to delete old square image from Cloudinary:", err);
      }
    }

    const oldWideIds = (collection.bannerImage?.wide || []).map((img) => img?.publicId).filter(Boolean);
    const newWideIds = new Set((bannerImage?.wide || []).map((img) => img?.publicId).filter(Boolean));

    for (const oldId of oldWideIds) {
      if (!newWideIds.has(oldId)) {
        try {
          await cloudinary.uploader.destroy(oldId);
        } catch (err) {
          console.error(`Failed to delete old wide image ${oldId}:`, err);
        }
      }
    }

    collection.name = normalizedName;
    collection.slug = slug;
    collection.bannerImage = bannerImage;
    collection.description = description;
    collection.parentCollection = parentCollection || null;
    collection.collectionLevel = collectionLevel;
    collection.sortOrder = sortOrder;
    collection.isActive = isActive;
    collection.seo = seo;

    await collection.save();
    await updateChildrenLevels(collection._id, collectionLevel);

    revalidateTag("layout-collections");
    revalidateTag("public-collections");
    revalidatePath("/", "layout");

    return response(true, 200, "Collection updated successfully", collection);
  } catch (error) {
    console.error("Patch collection error:", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) return admin.response;

    await connectDB();
    const { id } = await params;

    const collection = await Collection.findById(id);
    if (!collection) {
      return response(false, 404, "Collection not found");
    }

    const hasChildren = await Collection.exists({ parentCollection: id });
    if (hasChildren) {
      return response(false, 400, "Delete child collections first");
    }

    if (collection.bannerImage?.square?.publicId) {
      try {
        await cloudinary.uploader.destroy(collection.bannerImage.square.publicId);
      } catch (err) {
        console.error("Failed to delete square image on delete:", err);
      }
    }

    if (Array.isArray(collection.bannerImage?.wide)) {
      for (const image of collection.bannerImage.wide) {
        if (image?.publicId) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (err) {
            console.error(`Failed to delete wide image ${image.publicId} on delete:`, err);
          }
        }
      }
    }

    await Collection.findByIdAndDelete(id);

    revalidateTag("layout-collections");
    revalidateTag("public-collections");
    revalidatePath("/", "layout");

    return response(true, 200, "Collection deleted successfully");
  } catch (error) {
    console.error("Delete collection error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
