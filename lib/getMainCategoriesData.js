import { connectDB } from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import Collection from "@/models/Collection.model";
import Pages from "@/models/Pages.model";

export async function getMainCategoriesData() {
  try {
    await connectDB();

    const topCats = await Category.find({ categoryLevel: 1, isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const pagesDoc = await Pages.findOne().select("collectionsOverview").lean();
    const cmsCollections = pagesDoc?.collectionsOverview || null;

    const result = [];

    // Helper for natural description fallbacks matching design
    const getDescription = (name, customDesc) => {
      if (customDesc && !customDesc.includes("category")) return customDesc;
      if (name.includes("Paving") || name.includes("Flooring")) {
        return "Cobblestone, crazy paving, patio packs, Kota and Kadappa flooring, pool tiles and copings, steps.";
      }
      if (name.includes("Wall") || name.includes("Cladding")) {
        return "Facade slabs in 21 stones, EarthSkin panels, rockface, fieldstone, ledge stone and carved work.";
      }
      if (name.includes("Landscape") || name.includes("Garden")) {
        return "Sculptural boulders, pebbles, gravels, stone furniture and the Stone Glow lighting collection.";
      }
      return "Explore premium natural stone surfaces crafted for lasting strength and architectural elegance.";
    };

    // Ordering priority to align with Paving & Flooring, Wall Cladding, Landscape & Garden
    const orderedTopCats = [...topCats].sort((a, b) => {
      const order = ["paving-flooring", "wall-cladding", "landscape-garden"];
      const aIdx = order.indexOf(a.slug);
      const bIdx = order.indexOf(b.slug);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });

    for (const cat of orderedTopCats) {
      const level2 = await Category.find({ parentCategory: cat._id, isActive: true }).select("_id").lean();
      const level2Ids = level2.map((c) => c._id);
      const level3Count = await Category.countDocuments({ parentCategory: { $in: level2Ids }, isActive: true });
      const totalCount = level2.length + level3Count;

      result.push({
        id: cat._id.toString(),
        title: cat.name,
        slug: cat.slug,
        description: getDescription(cat.name, cat.description),
        image: cat.bannerImage?.square?.url || cat.bannerImage?.wide?.[0]?.url || "",
        countLabel: `${totalCount || 12} CATEGORIES`,
        href: `/product-category/${cat.slug}`,
      });
    }

    // 4th Card: Collections (using Pages.collectionsOverview if populated, or fallback)
    const totalCollectionsCount = await Collection.countDocuments({ isActive: { $ne: false } });
    const topCollection = await Collection.findOne({ collectionLevel: 1, isActive: { $ne: false } }).lean();

    const collectionsImage =
      cmsCollections?.bannerImage?.square?.url ||
      cmsCollections?.bannerImage?.wide?.[0]?.url ||
      topCollection?.bannerImage?.square?.url ||
      topCollection?.bannerImage?.wide?.[0]?.url ||
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

    const collectionsDesc =
      cmsCollections?.description ||
      "Twelve named collections. Each one is a way of working with stone, not a group of colours.";

    result.push({
      id: "collections-overview",
      title: cmsCollections?.title || "Collections",
      slug: "collections",
      description: collectionsDesc,
      image: collectionsImage,
      countLabel: `${totalCollectionsCount || 22} COLLECTIONS`,
      href: "/collections",
    });

    return result;
  } catch (error) {
    console.error("getMainCategoriesData error:", error.message);
    return [];
  }
}
