import { connectDB } from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import Product from "@/models/Product.model";
import { unstable_cache } from "next/cache";

/**
 * Internal cached helper to fetch and normalize categories and product counts from database.
 */
const fetchCategoriesCached = unstable_cache(
  async () => {
    await connectDB();

    // 1. Fetch all active categories
    const categories = await Category.find({ isActive: true })
      .sort({
        categoryLevel: 1,
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    // 2. Aggregate product counts per category
    let productCountMap = {};
    try {
      const counts = await Product.aggregate([
        { $match: { status: "published" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);
      counts.forEach((item) => {
        if (item._id) {
          productCountMap[item._id.toString()] = item.count;
        }
      });
    } catch (err) {
      console.error("Error aggregating product counts:", err);
    }

    const map = {};

    categories.forEach((category) => {
      map[category._id.toString()] = {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        categoryLevel: category.categoryLevel,
        sortOrder: category.sortOrder,
        createdAt: category.createdAt,
        squareBanner: category.bannerImage?.square || {
          url: "",
          publicId: "",
        },
        wideBanner: category.bannerImage?.wide?.url
          ? category.bannerImage.wide
          : Array.isArray(category.bannerImage?.wide) && category.bannerImage.wide[0]
          ? category.bannerImage.wide[0]
          : { url: "", publicId: "" },
        megamenu: category.megamenu || null,
        parentCategory: category.parentCategory?.toString() || null,
        children: [],
      };
    });

    const tree = [];

    categories.forEach((category) => {
      const current = map[category._id.toString()];
      if (current.parentCategory) {
        const parent = map[current.parentCategory];
        if (parent) {
          parent.children.push(current);
        }
      } else {
        tree.push(current);
      }
    });

    // Helper to calculate badge ("NEW" if created recently)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);



    const normalized = tree.map((cat) => {
      // 1. Build columns from database child categories (Level 2 & Level 3)
      const dbColumns =
        cat.children?.map((sub) => ({
          title: sub.name,
          slug: sub.slug,
          href: `/product-category/${sub.slug}`,
          isDbCategory: true,
          isCmsColumn: false,
          subtitle: sub.description || "",
          squareImage: sub.squareBanner?.url || sub.wideBanner?.url || "",
          links:
            sub.children?.map((third) => {
              const cnt = productCountMap[third._id];
              const isRecent = new Date(third.createdAt) > thirtyDaysAgo;
              return {
                name: third.name,
                slug: third.slug,
                count: cnt !== undefined ? String(cnt) : "–",
                badge: isRecent ? "NEW" : "",
                href: `/product-category/${third.slug}`,
                squareImage: third.squareBanner?.url || third.wideBanner?.url || "",
              };
            }) || [],
        })) || [];

      // 2. Merge Megamenu CMS columns & links with DB columns
      const megamenuColumns = [...dbColumns];

      if (
        cat.megamenu?.enabled &&
        Array.isArray(cat.megamenu?.columns) &&
        cat.megamenu.columns.length > 0
      ) {
        cat.megamenu.columns.forEach((cmsCol) => {
          const existingCol = megamenuColumns.find(
            (c) =>
              c.title.toLowerCase().trim() === cmsCol.title.toLowerCase().trim()
          );

          if (existingCol) {
            if (cmsCol.subtitle && !existingCol.subtitle) {
              existingCol.subtitle = cmsCol.subtitle;
            }
            (cmsCol.links || []).forEach((cmsLink) => {
              const linkExists = existingCol.links.some(
                (l) =>
                  l.name.toLowerCase().trim() === cmsLink.name.toLowerCase().trim()
              );
              if (!linkExists) {
                existingCol.links.push({
                  name: cmsLink.name,
                  slug:
                    cmsLink.slug ||
                    cmsLink.name.toLowerCase().replace(/ /g, "-"),
                  count: cmsLink.count || "–",
                  badge: cmsLink.badge || "",
                  href:
                    cmsLink.href ||
                    `/product-category/${cmsLink.slug || cmsLink.name.toLowerCase().replace(/ /g, "-")}`,
                });
              }
            });
          } else {
            megamenuColumns.push({
              title: cmsCol.title,
              slug: cmsCol.title.toLowerCase().replace(/ /g, "-"),
              subtitle: cmsCol.subtitle || "",
              isCmsColumn: true,
              isDbCategory: false,
              links: (cmsCol.links || []).map((link) => ({
                name: link.name,
                slug: link.slug || link.name.toLowerCase().replace(/ /g, "-"),
                count: link.count || "–",
                badge: link.badge || "",
                href:
                  link.href ||
                  `/product-category/${link.slug || link.name.toLowerCase().replace(/ /g, "-")}`,
              })),
            });
          }
        });
      }

      // 3. Quick Action Links (database-driven only)
      const actionLinks = Array.isArray(cat.megamenu?.actionLinks)
        ? cat.megamenu.actionLinks
            .map((al) => ({
              label: al.label || "",
              href: al.href || "",
            }))
            .filter((al) => al.label || al.href)
        : [];

      // 4. Determine spotlight / featured card
      let featuredCard = null;
      if (cat.megamenu?.featuredCard?.title) {
        featuredCard = {
          eyebrow: cat.megamenu.featuredCard.eyebrow || "Featured Product",
          title: cat.megamenu.featuredCard.title,
          description: cat.megamenu.featuredCard.description || "",
          image: cat.megamenu.featuredCard.image?.url || "",
          badge: cat.megamenu.featuredCard.badge || "",
          href: cat.megamenu.featuredCard.href || `/product-category/${cat.slug}`,
        };
      }

      const spotlightImages = featuredCard
        ? [
            {
              title: featuredCard.title,
              image: featuredCard.image,
              href: featuredCard.href,
              description: featuredCard.description,
              badge: featuredCard.badge,
              eyebrow: featuredCard.eyebrow,
            },
          ]
        : cat.wideBanner?.url
        ? [
            {
              title: cat.name,
              image: cat.wideBanner.url,
              href: `/product-category/${cat.slug}`,
              description: cat.description || "Quarry-direct natural stone.",
            },
          ]
        : cat.squareBanner?.url
        ? [
            {
              title: cat.name,
              image: cat.squareBanner.url,
              href: `/product-category/${cat.slug}`,
              description: cat.description || "Quarry-direct natural stone.",
            },
          ]
        : [];

      return {
        title: cat.name,
        slug: cat.slug,
        description: cat.description,
        squareImage: cat.squareBanner?.url || "",
        categories: megamenuColumns,
        subCategories: dbColumns,
        actionLinks,
        featuredCard,
        images: spotlightImages,
      };
    });

    return normalized;
  },
  ["layout-categories-cache"],
  {
    revalidate: 86400, // Cache for 24 hours fallback
    tags: ["layout-categories"],
  }
);

export const getCategoriesForLayout = async () => {
  try {
    return await fetchCategoriesCached();
  } catch (error) {
    console.error("getCategoriesForLayout error:", error);
    return [];
  }
};
