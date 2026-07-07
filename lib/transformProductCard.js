export function transformProductCard(product) {
  return {
    _id: product._id,

    name: product.name,

    slug: product.slug,

    thumbnail: product.images?.length
      ? product.images[0]
      : null,

    hoverImage: product.hoverImage || null,

    category: product.category,

    badges: [
      ...(product.isFeatured ? ["Featured"] : []),
      ...(product.isBestSeller ? ["Best Seller"] : []),
      ...(product.isNewArrival ? ["New Arrival"] : []),
    ],
  };
}