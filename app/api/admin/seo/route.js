import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidatePath } from "next/cache";
import Seo from "@/models/Seo.model";

async function getOrCreateSeoDocument() {
  let seo = await Seo.findOne();

  if (!seo) {
    seo = await Seo.create({
      metaTitle: "Stoneza - Natural Stone Showcase & Enquiry",
      metaDescription: "Elevate interiors and outdoor spaces with natural stone crafted for lasting strength, refined beauty, and enduring performance.",
      keywords: "natural stone, stoneza, marble, granite, flooring, wall cladding",
      ogImage: "",
      googleAnalyticsId: "",
      searchConsoleVerification: "",
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://stoneza.com/sitemap.xml",
      sitemapEnabled: true,
      sitemapExcludePaths: "/admin, /api",
      sitemapChangeFrequency: "weekly",
      sitemapPriority: 0.8,
    });
  }

  return seo;
}

export async function GET() {
  try {
    await connectDB();
    const seo = await getOrCreateSeoDocument();
    return response(true, 200, "SEO data fetched successfully", seo);
  } catch (error) {
    console.error("GET SEO error:", error);
    return response(false, 500, "Failed to fetch SEO data");
  }
}

export async function PATCH(request) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const body = await request.json();
    let seo = await getOrCreateSeoDocument();

    // Update all properties
    if (body.metaTitle !== undefined) seo.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) seo.metaDescription = body.metaDescription;
    if (body.keywords !== undefined) seo.keywords = body.keywords;
    if (body.ogImage !== undefined) seo.ogImage = body.ogImage;
    if (body.googleAnalyticsId !== undefined) seo.googleAnalyticsId = body.googleAnalyticsId;
    if (body.searchConsoleVerification !== undefined) seo.searchConsoleVerification = body.searchConsoleVerification;
    if (body.robotsTxt !== undefined) seo.robotsTxt = body.robotsTxt;
    if (body.sitemapEnabled !== undefined) seo.sitemapEnabled = body.sitemapEnabled;
    if (body.sitemapExcludePaths !== undefined) seo.sitemapExcludePaths = body.sitemapExcludePaths;
    if (body.sitemapChangeFrequency !== undefined) seo.sitemapChangeFrequency = body.sitemapChangeFrequency;
    if (body.sitemapPriority !== undefined) seo.sitemapPriority = body.sitemapPriority;

    await seo.save();

    // Revalidate paths that depend on SEO parameters
    revalidatePath("/");
    revalidatePath("/robots.txt");
    revalidatePath("/sitemap.xml");

    return response(true, 200, "SEO settings updated successfully", seo);
  } catch (error) {
    console.error("PATCH SEO error:", error);
    return response(false, 500, "Failed to update SEO settings");
  }
}
