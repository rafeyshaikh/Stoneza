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
      stoneDetails,
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

    if (price !== undefined && price !== null && price !== "" && Number(price) <= 0) {
      return response(false, 400, "Valid price is required");
    }

    if (!stoneDetails || !stoneDetails.stoneType?.trim()) {
      return response(false, 400, "Stone Type is required");
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

    product.price = price ? Number(price) : undefined;

    product.stock = Number(stock) || 0;

    product.category = category;

    const oldImageIds = (product.images || []).map(img => img.publicId).filter(Boolean);
    product.images = images;

    const oldHoverPublicId = product.hoverImage?.publicId;

    product.hoverImage = hoverImage;

    product.tags = tags || [];

    product.isFeatured = isFeatured;
    product.isBestSeller = isBestSeller;
    product.isNewArrival = isNewArrival;

    product.status = status;

    product.seo = seo;

    product.dimensions = dimensions;

    product.weight = Number(weight) || 0;

    product.stoneDetails = {
      stoneType: stoneDetails.stoneType.trim(),
      productForm: stoneDetails.productForm?.trim() || "",
      calibratedThickness: stoneDetails.calibratedThickness?.trim() || "",
      faceTexture: stoneDetails.faceTexture?.trim() || "",
      cornerPieces: stoneDetails.cornerPieces?.trim() || "",
      coveragePerUnit: stoneDetails.coveragePerUnit?.trim() || "",
      waterAbsorption: stoneDetails.waterAbsorption?.trim() || "",
      density: stoneDetails.density ? Number(stoneDetails.density) : null,
      weatherResistance: stoneDetails.weatherResistance?.trim() || "",
      application: Array.isArray(stoneDetails.application)
        ? stoneDetails.application.map((app) => app.trim()).filter(Boolean)
        : (stoneDetails.application?.split(",")?.map((app) => app.trim())?.filter(Boolean) || []),
      installationMethod: stoneDetails.installationMethod?.trim() || "",
      moq: stoneDetails.moq?.trim() || "Project-based — ask us",
      weightPerSqM: stoneDetails.weightPerSqM?.trim() || "",
      groutRecommendation: stoneDetails.groutRecommendation?.trim() || "",
      sealerRequirement: stoneDetails.sealerRequirement?.trim() || "",
      leadTime: stoneDetails.leadTime?.trim() || "",
      sampleAvailable: typeof stoneDetails.sampleAvailable === "boolean" ? stoneDetails.sampleAvailable : true,
    };

    await product.save();

    if (oldHoverPublicId && oldHoverPublicId !== hoverImage?.publicId) {
      try {
        await cloudinary.uploader.destroy(oldHoverPublicId);
      } catch (err) {
        console.error("Failed to delete old hover image:", err);
      }
    }

    // Compare and delete removed images from Cloudinary
    const newImageIds = new Set((images || []).map(img => img.publicId).filter(Boolean));
    for (const oldId of oldImageIds) {
      if (!newImageIds.has(oldId)) {
        try {
          await cloudinary.uploader.destroy(oldId);
        } catch (err) {
          console.error(`Failed to delete old product image ${oldId} from Cloudinary:`, err);
        }
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
