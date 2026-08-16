import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Collection from "@/models/Collection.model";
import Product from "@/models/Product.model";
import { unstable_cache } from "next/cache";

const getCachedPublicCollections = unstable_cache(
  async () => {
    await connectDB();

    const collections = await Collection.find({ isActive: true })
      .populate("parentCollection", "name slug")
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    let collectionCountMap = {};
    try {
      const counts = await Product.aggregate([
        { $match: { status: "published", collection: { $ne: null } } },
        { $group: { _id: "$collection", count: { $sum: 1 } } },
      ]);
      counts.forEach((item) => {
        if (item._id) {
          collectionCountMap[item._id.toString()] = item.count;
        }
      });
    } catch (err) {
      console.error("Error aggregating collection product counts in API:", err);
    }

    const collectionsWithCounts = collections.map((col) => ({
      ...col,
      _id: col._id.toString(),
      productCount: collectionCountMap[col._id.toString()] || 0,
    }));

    return collectionsWithCounts;
  },
  ["public-collections-cache"],
  {
    revalidate: 86400,
    tags: ["public-collections"],
  }
);

export async function GET() {
  try {
    const collections = await getCachedPublicCollections();
    return response(true, 200, "Collections fetched successfully", collections);
  } catch (error) {
    console.error("Public collections GET error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
