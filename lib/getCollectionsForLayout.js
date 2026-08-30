import { connectDB } from "@/lib/databaseConnection";
import Collection from "@/models/Collection.model";
import Product from "@/models/Product.model";
import { unstable_cache } from "next/cache";

/**
 * Internal cached helper to fetch and normalize collections and product counts from database for header megamenu.
 */
const fetchCollectionsCached = unstable_cache(
  async () => {
    await connectDB();

    const collections = await Collection.find({ isActive: true })
      .sort({
        collectionLevel: 1,
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    if (!collections || collections.length === 0) {
      return null;
    }

    // Aggregate product counts per collection strictly for published products
    const directPublishedCounts = {};
    try {
      const counts = await Product.aggregate([
        { $match: { status: "published", collection: { $ne: null } } },
        { $group: { _id: "$collection", count: { $sum: 1 } } },
      ]);
      counts.forEach((item) => {
        if (item._id) {
          directPublishedCounts[item._id.toString()] = item.count;
        }
      });
    } catch (err) {
      console.error("Error aggregating collection product counts:", err);
    }

    const map = {};

    collections.forEach((col) => {
      const idStr = col._id.toString();
      map[idStr] = {
        _id: idStr,
        name: col.name,
        slug: col.slug,
        description: col.description || "",
        collectionLevel: col.collectionLevel,
        sortOrder: col.sortOrder,
        createdAt: col.createdAt,
        squareBanner: col.bannerImage?.square || { url: "", publicId: "" },
        wideBanners: col.bannerImage?.wide || [],
        parentCollection: col.parentCollection?.toString() || null,
        children: [],
      };
    });

    const tree = [];

    collections.forEach((col) => {
      const current = map[col._id.toString()];
      if (current.parentCollection && map[current.parentCollection]) {
        map[current.parentCollection].children.push(current);
      } else {
        tree.push(current);
      }
    });

    const getPublishedCountForCol = (colId) => {
      const col = map[colId];
      if (!col) return 0;
      let total = directPublishedCounts[colId] || 0;
      for (const child of col.children) {
        total += getPublishedCountForCol(child._id);
      }
      return total;
    };

    const collectionCountMap = {};
    Object.keys(map).forEach((idStr) => {
      collectionCountMap[idStr] = getPublishedCountForCol(idStr);
    });

    const bannerImages = [];
    tree.forEach((group) => {
      if (group.wideBanners && group.wideBanners.length > 0) {
        group.wideBanners.forEach((img) => {
          if (img.url) {
            bannerImages.push({
              title: group.name,
              image: img.url,
              href: `/collections/${group.slug}`,
              description: group.description || "Each one is a way of working with stone.",
            });
          }
        });
      } else if (group.squareBanner?.url) {
        bannerImages.push({
          title: group.name,
          image: group.squareBanner.url,
          href: `/collections/${group.slug}`,
          description: group.description || "Each one is a way of working with stone.",
        });
      }
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const collectionsNavItem = {
      title: "Collections",
      slug: "collections",
      href: "/collections",
      isCollection: true,
      categories: tree.map((group) => ({
        title: group.name,
        slug: group.slug,
        subtitle: group.description || "Surface and slab collections",
        href: `/collections/${group.slug}`,
        isDbCategory: true,
        isCmsColumn: false,
        squareImage: group.squareBanner?.url || "",
        links: group.children.map((sub) => {
          const cnt = collectionCountMap[sub._id];
          const isRecent = new Date(sub.createdAt) > thirtyDaysAgo;
          return {
            name: sub.name,
            title: sub.name,
            slug: sub.slug,
            count: cnt !== undefined && cnt > 0 ? String(cnt) : "–",
            badge: isRecent ? "NEW" : "",
            href: `/collections/${sub.slug}`,
          };
        }),
      })),
      images:
        bannerImages.length > 0
          ? bannerImages.slice(0, 2)
          : [
              {
                title: "Ten named collections",
                image:
                  "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
                href: "/collections",
                description: "Each one is a way of working with stone, not a group of colours.",
              },
            ],
    };

    return collectionsNavItem;
  },
  ["layout-collections-cache"],
  {
    revalidate: 86400,
    tags: ["layout-collections"],
  }
);

export const getCollectionsForLayout = async () => {
  try {
    return await fetchCollectionsCached();
  } catch (error) {
    console.error("getCollectionsForLayout error:", error);
    return null;
  }
};
