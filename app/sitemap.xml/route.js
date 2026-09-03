import { connectDB } from "@/lib/databaseConnection";
import Seo from "@/models/Seo.model";
import Product from "@/models/Product.model";
import Blog from "@/models/Blog.model";
import Category from "@/models/Category.model";
import Collection from "@/models/Collection.model";
import Pages from "@/models/Pages.model";

export async function GET() {
  try {
    await connectDB();
    const [seo, pagesDoc] = await Promise.all([
      Seo.findOne().lean(),
      Pages.findOne().lean(),
    ]);

    // Sitemap disabled check
    if (seo && seo.sitemapEnabled === false) {
      return new Response("Sitemap is disabled", { status: 404 });
    }

    const domain =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://stoneza.in";

    const urls = [
      { loc: `${domain}/`, lastmod: new Date().toISOString() },
      { loc: `${domain}/product`, lastmod: new Date().toISOString() },
      { loc: `${domain}/about-us`, lastmod: new Date().toISOString() },
    ];

    // Static pages respecting robotsIndex
    if (pagesDoc?.contactUs?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/contact`, lastmod: new Date().toISOString() });
    }
    if (pagesDoc?.collectionsOverview?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/collections`, lastmod: new Date().toISOString() });
    }
    if (pagesDoc?.privacyPolicy?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/privacy-policy`, lastmod: new Date().toISOString() });
    }
    if (pagesDoc?.termsAndConditions?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/terms-and-conditions`, lastmod: new Date().toISOString() });
    }
    if (pagesDoc?.termsOfSupply?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/terms-of-supply`, lastmod: new Date().toISOString() });
    }
    if (pagesDoc?.disclaimer?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/disclaimer`, lastmod: new Date().toISOString() });
    }
    if (pagesDoc?.returnPolicy?.seo?.robotsIndex !== false) {
      urls.push({ loc: `${domain}/return-policy`, lastmod: new Date().toISOString() });
    }

    // Fetch dynamic products (exclude robotsIndex === false)
    const products = await Product.find({
      status: "published",
      "seo.robotsIndex": { $ne: false },
    })
      .select("slug updatedAt")
      .lean();

    products.forEach((p) => {
      if (p.slug) {
        urls.push({
          loc: `${domain}/product/${p.slug}`,
          lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
        });
      }
    });

    // Fetch dynamic categories (exclude robotsIndex === false)
    const categories = await Category.find({
      "seo.robotsIndex": { $ne: false },
    })
      .select("slug updatedAt")
      .lean();

    categories.forEach((c) => {
      if (c.slug) {
        urls.push({
          loc: `${domain}/product-category/${c.slug}`,
          lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
        });
      }
    });

    // Fetch dynamic collections (exclude robotsIndex === false and isActive === false)
    const collections = await Collection.find({
      isActive: { $ne: false },
      "seo.robotsIndex": { $ne: false },
    })
      .select("slug updatedAt")
      .lean();

    collections.forEach((col) => {
      if (col.slug) {
        urls.push({
          loc: `${domain}/collections/${col.slug}`,
          lastmod: col.updatedAt ? new Date(col.updatedAt).toISOString() : new Date().toISOString(),
        });
      }
    });

    // Fetch dynamic blogs (exclude robotsIndex === false)
    const blogs = await Blog.find({
      status: "published",
      "seo.robotsIndex": { $ne: false },
    })
      .select("slug updatedAt")
      .lean();

    blogs.forEach((b) => {
      if (b.slug) {
        urls.push({
          loc: `${domain}/blogs/${b.slug}`,
          lastmod: b.updatedAt ? new Date(b.updatedAt).toISOString() : new Date().toISOString(),
        });
      }
    });

    // Filter sitemap exclusion patterns configured in global SEO
    const excludePatterns = seo?.sitemapExcludePaths
      ? seo.sitemapExcludePaths
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const filteredUrls = urls.filter((item) => {
      return !excludePatterns.some((pat) => item.loc.includes(pat));
    });

    const changefreq = seo?.sitemapChangeFrequency || "weekly";
    const priority = seo?.sitemapPriority || 0.8;

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${filteredUrls
    .map(
      (item) => `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    return new Response(sitemapXml.trim(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("sitemap.xml error:", error);
    return new Response("Failed to generate sitemap", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
