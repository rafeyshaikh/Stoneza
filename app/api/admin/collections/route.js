import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import { revalidatePath, revalidateTag } from "next/cache";
import Collection from "@/models/Collection.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const collections = await Collection.find({})
      .populate("parentCollection", "name")
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return response(true, 200, "Collections fetched", collections);
  } catch (error) {
    console.error("Admin collections GET error:", error);

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
      bannerImage,
      description = "",
      parentCollection = null,
      sortOrder = 0,
      isActive = true,
      seo = {},
    } = body;

    if (!name?.trim()) {
      return response(false, 400, "Collection name is required");
    }

    const normalizedName = name.trim();

    const existingCollection = await Collection.findOne({
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i",
      },
    });

    if (existingCollection) {
      return response(false, 409, "Collection already exists");
    }

    const slug = generateSlug(body.slug || normalizedName);
    if (!slug) {
      return response(false, 400, "Valid slug is required");
    }

    const existingSlug = await Collection.findOne({ slug });

    if (existingSlug) {
      return response(
        false,
        409,
        `Slug "${slug}" already exists. Please choose a unique slug.`
      );
    }

    let collectionLevel = 1;

    if (parentCollection) {
      const parent = await Collection.findOne({ _id: parentCollection });

      if (!parent) {
        return response(false, 404, "Parent collection not found");
      }

      collectionLevel = parent.collectionLevel + 1;

      if (collectionLevel > 2) {
        return response(false, 400, "Maximum collection depth is 2 levels");
      }
    }

    const collection = await Collection.create({
      name: normalizedName,
      slug,
      bannerImage,
      collectionLevel,
      description,
      parentCollection: parentCollection || null,
      sortOrder,
      isActive,
      seo,
    });

    revalidateTag("layout-collections");
    revalidateTag("public-collections");
    revalidatePath("/", "layout");

    return response(true, 201, "Collection created successfully", collection);
  } catch (error) {
    console.error("Create collection error:", error);

    return response(false, 500, "Internal Server Error");
  }
}
