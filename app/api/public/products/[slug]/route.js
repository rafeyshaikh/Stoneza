import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";

import Product from "@/models/Product.model";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({
      slug,
      deletedAt: null,
      status: "published",
    })
      .populate({
        path: "category",
        select: "_id name slug",
      })
      .lean();

    if (!product) {
      return response(false, 404, "Product not found");
    }

    const data = {
      ...product,

      badges: [
        ...(product.isFeatured ? ["Featured"] : []),
        ...(product.isBestSeller ? ["Best Seller"] : []),
        ...(product.isNewArrival ? ["New Arrival"] : []),
      ],
    };

    return response(
      true,
      200,
      "Product fetched successfully",
      data
    );
  } catch (error) {
    console.error("Public product error:", error);

    return response(false, 500, "Internal Server Error");
  }
}