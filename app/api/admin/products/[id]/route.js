import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { generateSlug } from "@/lib/generateSlug";
import cloudinary from "@/lib/cloudinary";

import Product from "@/models/Product.model";
import Category from "@/models/Category.model";

export async function GET(request, { params }) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const { id } = await params;

    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return response(false, 404, "Product not found");
    }

    return response(true, 200, "Product fetched successfully", product);
  } catch (error) {
    console.error(error);

    return response(false, 500, "Internal Server Error");
  }
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

    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!product) {
      return response(false, 404, "Product not found");
    }

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

    const duplicate = await Product.findOne({
      _id: { $ne: id },
      slug,
      deletedAt: null,
    });

    if (duplicate) {
      return response(false, 409, "Product already exists");
    }

    const categoryExists = await Category.findOne({
      _id: category,
      deletedAt: null,
    });

    if (!categoryExists) {
      return response(false, 404, "Category not found");
    }

    const hasChildren = await Category.exists({
      parentCategory: category,
      deletedAt: null,
    });

    if (hasChildren) {
      return response(false, 400, "Please select a final category");
    }


    product.name = name.trim();
    product.slug = slug;

    product.description = description.trim();
    product.shortDescription = shortDescription;

    product.price = Number(price);
    product.discountPrice = discountPrice || null;

    product.stock = Number(stock) || 0;

    product.category = category;

    product.images = images;

    const oldHoverPublicId = product.hoverImage?.publicId;

    product.hoverImage = hoverImage;

    await product.save();

    if (oldHoverPublicId && oldHoverPublicId !== hoverImage?.publicId) {
      await cloudinary.uploader.destroy(oldHoverPublicId);
    }
    product.tags = tags || [];

    product.isFeatured = isFeatured;
    product.isBestSeller = isBestSeller;
    product.isNewArrival = isNewArrival;

    product.status = status;

    product.seo = seo;

    product.dimensions = dimensions;

    product.weight = Number(weight) || 0;

    await product.save();

    const removedImages = product.images.filter(
      (oldImage) =>
        !images.some((newImage) => newImage.publicId === oldImage.publicId),
    );

    for (const image of removedImages) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    return response(true, 200, "Product updated successfully", product);
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

    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!product) {
      return response(false, 404, "Product not found");
    }

    for (const image of product.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    if (product.hoverImage?.publicId) {
      await cloudinary.uploader.destroy(product.hoverImage.publicId);
    }

    await Product.findByIdAndDelete(id);

    return response(true, 200, "Product deleted successfully");
  } catch (error) {
    console.error(error);

    return response(false, 500, "Internal Server Error");
  }
}
