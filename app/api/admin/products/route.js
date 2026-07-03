import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";

import { generateSlug } from "@/lib/generateSlug";
import { generateSku } from "@/lib/generateSku";

export async function POST(req) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const body = await req.json();

    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      stock,
      category,

      images,
      hoverImage,

      tags,

      isFeatured,
      isBestSeller,
      isNewArrival,

      status,

      seo,

      dimensions,
      weight,
    } = body;

    if (!name?.trim()) {
      return response(false, 400, "Product name is required");
    }

    if (!description?.trim()) {
      return response(false, 400, "Description is required");
    }

    if (!price || Number(price) <= 0) {
      return response(false, 400, "Valid price is required");
    }

    if (!category) {
      return response(false, 400, "Final category is required");
    }

    if (!images?.length) {
      return response(false, 400, "At least one image is required");
    }

    const slug = generateSlug(name);

    const existingProduct = await Product.findOne({
      slug,
      deletedAt: null,
    });

    if (existingProduct) {
      return response(false, 409, "Product already exists");
    }

    const categoryExists = await Category.findOne({
      _id: category,
      deletedAt: null,
    });

    if (!categoryExists) {
      return response(false, 404, "Category not found");
    }

    // Must be a leaf category
    const hasChildren = await Category.exists({
      parentCategory: category,
      deletedAt: null,
    });

    if (hasChildren) {
      return response(
        false,
        400,
        "Please select a final category"
      );
    }

    const product = await Product.create({
      name: name.trim(),

      slug,

      sku: generateSku(name),

      description: description.trim(),

      shortDescription,

      price: Number(price),

      discountPrice: discountPrice || null,

      stock: Number(stock) || 0,

      category,

      images,

      hoverImage,

      isFeatured,

      isBestSeller,

      isNewArrival,

      status,

      seo,

      dimensions,

      weight: Number(weight) || 0,
    });

    return response(
      true,
      201,
      "Product created successfully",
      product
    );
  } catch (error) {
    console.error("Admin product create error:", error);

    return response(false, 500, "Internal Server Error");
  }
}

export async function GET(req) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";

    const filter = {
      deletedAt: null,
      $or: [{ name: { $regex: query, $options: "i" } }, { slug: { $regex: query, $options: "i" } }],
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return response(true, 200, "Products fetched", {
      items: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin products error", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function DELETE(req) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const body = await req.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];

    if (!ids.length) {
      return response(false, 400, "No product IDs provided");
    }

    await Product.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date() } });

    return response(true, 200, "Products deleted");
  } catch (error) {
    console.error("Admin products delete error", error);
    return response(false, 500, "Internal Server Error");
  }
}
