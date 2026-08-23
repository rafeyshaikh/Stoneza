import { connectDB } from "@/lib/databaseConnection";
import Collection from "@/models/Collection.model";
import Product from "@/models/Product.model";
import Pages from "@/models/Pages.model";
import { unstable_cache } from "next/cache";

/**
 * Server-side helper to fetch and organize complete collections overview data
 * including CMS settings, master families (level 1), sub-collections (level 2),
 * and aggregate product counts.
 */
async function fetchCollectionsOverviewRaw() {
  await connectDB();

  // 1. Fetch CMS Collections Overview Config from Pages
  const pagesDoc = await Pages.findOne().select("collectionsOverview").lean();
  const cmsOverview = pagesDoc?.collectionsOverview || null;

  // 2. Fetch all active collections
  const rawCollections = await Collection.find({ isActive: { $ne: false } })
    .populate("parentCollection", "_id name slug")
    .sort({
      collectionLevel: 1,
      sortOrder: 1,
      createdAt: 1,
    })
    .lean();

  if (!rawCollections || rawCollections.length === 0) {
    return {
      cmsOverview: {
        title: "Collections",
        description: "Twelve named collections. Each one is a way of working with stone, not a group of colours.",
        bannerImage: {
          square: { url: "" },
          wide: [{ url: "/assets/hero/All-Products-Banner.png" }],
        },
      },
      masterFamilies: [],
      allCollections: [],
      stats: {
        totalCollections: 0,
        totalFamilies: 0,
        totalSubCollections: 0,
        totalProducts: 0,
      },
    };
  }

  // 3. Aggregate product counts per collection
  let collectionCountMap = {};
  let totalPublishedProducts = 0;

  try {
    const counts = await Product.aggregate([
      { $match: { status: "published", collection: { $ne: null } } },
      { $group: { _id: "$collection", count: { $sum: 1 } } },
    ]);

    counts.forEach((item) => {
      if (item._id) {
        const count = item.count || 0;
        collectionCountMap[item._id.toString()] = count;
        totalPublishedProducts += count;
      }
    });
  } catch (err) {
    console.error("Error aggregating collection product counts:", err);
  }

  // 4. Map collection data
  const map = {};
  const allList = [];

  rawCollections.forEach((col) => {
    const colId = col._id.toString();
    const count = collectionCountMap[colId] || 0;
    const mapped = {
      _id: colId,
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      collectionLevel: col.collectionLevel || 1,
      sortOrder: col.sortOrder || 0,
      bannerImage: {
        square: col.bannerImage?.square || { url: "", publicId: "" },
        wide: col.bannerImage?.wide || [],
      },
      parentCollection: col.parentCollection
        ? {
            _id: col.parentCollection._id?.toString(),
            name: col.parentCollection.name,
            slug: col.parentCollection.slug,
          }
        : null,
      productCount: count,
      children: [],
    };

    map[colId] = mapped;
    allList.push(mapped);
  });

  // 5. Build hierarchical tree (Master Families -> Sub-collections)
  const masterFamilies = [];

  allList.forEach((item) => {
    if (item.parentCollection && item.parentCollection._id) {
      const parent = map[item.parentCollection._id];
      if (parent) {
        parent.children.push(item);
      }
    } else if (item.collectionLevel === 1) {
      masterFamilies.push(item);
    }
  });

  // 6. Calculate total products per family including children
  masterFamilies.forEach((family) => {
    const childrenCount = family.children.reduce((acc, c) => acc + (c.productCount || 0), 0);
    family.totalFamilyProducts = (family.productCount || 0) + childrenCount;
  });

  // 7. Format CMS Overview fallback
  const overviewData = {
    title: cmsOverview?.title || "Collections",
    description:
      cmsOverview?.description ||
      "Twelve named collections. Each one is a way of working with stone, not a group of colours.",
    bannerImage: {
      square: cmsOverview?.bannerImage?.square?.url
        ? cmsOverview.bannerImage.square
        : {
            url: "https://res.cloudinary.com/chlmognp/image/upload/v1787074919/stoneza/pages/collections/square/collections-square-banner-msyy91vo.webp",
          },
      wide: Array.isArray(cmsOverview?.bannerImage?.wide) && cmsOverview.bannerImage.wide.length > 0 && cmsOverview.bannerImage.wide[0].url
        ? cmsOverview.bannerImage.wide
        : [
            {
              url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
            },
          ],
    },
    megamenu: cmsOverview?.megamenu || null,
  };

  const level2Count = allList.filter((c) => c.collectionLevel === 2).length;

  return {
    cmsOverview: overviewData,
    masterFamilies,
    allCollections: allList,
    stats: {
      totalCollections: allList.length,
      totalFamilies: masterFamilies.length,
      totalSubCollections: level2Count,
      totalProducts: totalPublishedProducts,
    },
  };
}

export const getCollectionsOverviewData = async () => {
  try {
    return await fetchCollectionsOverviewRaw();
  } catch (error) {
    console.error("getCollectionsOverviewData error:", error);
    return null;
  }
};
