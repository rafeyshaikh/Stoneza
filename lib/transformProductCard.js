export function transformProductCard(product) {
  return {
    _id: product._id,

    name: product.name,

    slug: product.slug,

    images: product.images || [],

    thumbnail: product.images?.length
      ? product.images[0]
      : null,

    hoverImage: product.hoverImage || (product.images?.length > 1 ? product.images[1] : null),

    category: product.category,
    collection: product.collection,
    collectionName: product.collection?.name || product.collectionName || "",

    price: product.price || null,

    badges: [
      ...(product.isFeatured ? ["Featured"] : []),
      ...(product.isBestSeller ? ["Best Seller"] : []),
      ...(product.isNewArrival ? ["New Arrival"] : []),
    ],
  };
}