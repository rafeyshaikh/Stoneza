import { connectDB } from "@/lib/databaseConnection";
import Collection from "@/models/Collection.model";
import Product from "@/models/Product.model";

/**
 * Server-side helper to fetch collection details, sub-collections,
 * and associated products directly from the database.
 */
export async function getCollectionDetails(slug) {
  try {
    await connectDB();

    const collection = await Collection.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!collection) {
      return null;
    }

    const subCollections = (
      await Collection.find({
        parentCollection: collection._id,
        isActive: true,
      })
        .select(`
          name
          slug
          bannerImage
          sortOrder
        `)
        .sort({
          sortOrder: 1,
          createdAt: 1,
        })
        .lean()
    ).map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      squareBanner: item.bannerImage?.square || null,
    }));

    let collectionIds = [collection._id];
    if (subCollections.length > 0) {
      const subIds = subCollections.map((s) => s._id);
      collectionIds = [...collectionIds, ...subIds];
    }

    const filter = {
      status: "published",
      collection: {
        $in: collectionIds,
      },
    };

    const products = await Product.find(filter)
      .select(`
        name
        slug
        images
        hoverImage
        isFeatured
        isBestSeller
        isNewArrival
        collection
        category
        price
        stoneDetails
      `)
      .populate("collection", "_id name slug collectionLevel")
      .sort({ createdAt: -1 })
      .lean();

    const items = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      images: product.images || [],
      thumbnail: product.images?.length ? product.images[0] : null,
      hoverImage: product.hoverImage || (product.images?.length > 1 ? product.images[1] : null),
      collection: {
        _id: product.collection?._id?.toString(),
        name: product.collection?.name,
        slug: product.collection?.slug,
        collectionLevel: product.collection?.collectionLevel,
      },
      price: product.price || null,
      stoneDetails: product.stoneDetails || {},
      badges: [
        ...(product.isFeatured ? ["Featured"] : []),
        ...(product.isBestSeller ? ["Best Seller"] : []),
        ...(product.isNewArrival ? ["New Arrival"] : []),
      ],
    }));

    let parentCollection = null;
    let siblingCollections = [];

    if (collection.collectionLevel === 2 && collection.parentCollection) {
      const parentDoc = await Collection.findById(collection.parentCollection)
        .select("name slug description bannerImage")
        .lean();

      if (parentDoc) {
        parentCollection = {
          _id: parentDoc._id.toString(),
          name: parentDoc.name,
          slug: parentDoc.slug,
          description: parentDoc.description,
        };
      }

      const siblingDocs = await Collection.find({
        parentCollection: collection.parentCollection,
        _id: { $ne: collection._id },
        isActive: true,
      })
        .select("name slug description bannerImage sortOrder createdAt")
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean();

      if (siblingDocs.length > 0) {
        const siblingIds = siblingDocs.map((s) => s._id);

        const siblingProductCounts = await Product.aggregate([
          { $match: { collection: { $in: siblingIds }, status: "published" } },
          { $group: { _id: "$collection", count: { $sum: 1 } } },
        ]);

        const countMap = {};
        siblingProductCounts.forEach((c) => {
          if (c._id) countMap[c._id.toString()] = c.count;
        });

        // Fetch first product image as fallback thumbnail
        const siblingProducts = await Product.find({
          collection: { $in: siblingIds },
          status: "published",
          "images.0.url": { $exists: true },
        })
          .select("collection images")
          .lean();

        const firstProdImageMap = {};
        siblingProducts.forEach((p) => {
          if (p.collection && !firstProdImageMap[p.collection.toString()]) {
            firstProdImageMap[p.collection.toString()] = p.images[0]?.url;
          }
        });

        siblingCollections = siblingDocs.map((s) => ({
          _id: s._id.toString(),
          name: s.name,
          slug: s.slug,
          description: s.description || "",
          image:
            s.bannerImage?.square?.url ||
            s.bannerImage?.wide?.[0]?.url ||
            (Array.isArray(s.bannerImage?.wide) ? s.bannerImage?.wide[0]?.url : "") ||
            firstProdImageMap[s._id.toString()] ||
            "",
          productCount: countMap[s._id.toString()] || 0,
          href: `/collections/${s.slug}`,
        }));
      }
    }

    return {
      collection: {
        _id: collection._id.toString(),
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        bannerImage: collection.bannerImage,
        collectionLevel: collection.collectionLevel,
        parentCollection: parentCollection || null,
        seo: collection.seo,
      },
      parentCollection,
      siblingCollections,
      siblingCategories: siblingCollections,
      subCollections,
      products: items,
    };
  } catch (error) {
    console.error("getCollectionDetails error:", error);
    return null;
  }
}
