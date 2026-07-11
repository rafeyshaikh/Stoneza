import { connectDB } from "@/lib/databaseConnection";
import Seo from "@/models/Seo.model";
import Product from "@/models/Product.model";
import Blog from "@/models/Blog.model";
import Category from "@/models/Category.model";

export async function GET() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();

    // Sitemap disabled check
    if (seo && seo.sitemapEnabled === false) {
      return new Response("Sitemap is disabled", { status: 404 });
    }

    const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://stoneza.com";

    const urls = [
      { loc: `${domain}/`, lastmod: new Date().toISOString() },
      { loc: `${domain}/products`, lastmod: new Date().toISOString() },
      { loc: `${domain}/pages/about-us`, lastmod: new Date().toISOString() },
      { loc: `${domain}/pages/contact`, lastmod: new Date().toISOString() },
      { loc: `${domain}/pages/disclaimer`, lastmod: new Date().toISOString() },
      { loc: `${domain}/pages/privacy-policy`, lastmod: new Date().toISOString() },
      { loc: `${domain}/pages/return-policy`, lastmod: new Date().toISOString() },
      { loc: `${domain}/pages/terms-and-conditions`, lastmod: new Date().toISOString() },
    ];

    // Fetch dynamic products
    const products = await Product.find({ status: "published" }).select("slug updatedAt").lean();
    products.forEach((p) => {
      urls.push({
        loc: `${domain}/products/${p.slug}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
      });
    });

    // Fetch dynamic categories
    const categories = await Category.find().select("slug updatedAt").lean();
    categories.forEach((c) => {
      urls.push({
        loc: `${domain}/collections/${c.slug}`,
        lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
      });
    });

    // Fetch dynamic blogs
    const blogs = await Blog.find({ status: "published" }).select("slug updatedAt").lean();
    blogs.forEach((b) => {
      urls.push({
        loc: `${domain}/blogs/${b.slug}`,
        lastmod: b.updatedAt ? new Date(b.updatedAt).toISOString() : new Date().toISOString(),
      });
    });

    // Filter sitemap exclusion patterns
    const excludePatterns = seo?.sitemapExcludePaths
      ? seo.sitemapExcludePaths.split(",").map((p) => p.trim()).filter(Boolean)
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
