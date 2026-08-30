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

    return {
      collection: {
        _id: collection._id.toString(),
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        bannerImage: collection.bannerImage,
        collectionLevel: collection.collectionLevel,
        seo: collection.seo,
      },
      subCollections,
      products: items,
    };
  } catch (error) {
    console.error("getCollectionDetails error:", error);
    return null;
  }
}
