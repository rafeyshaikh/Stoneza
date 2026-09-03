import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidatePath } from "next/cache";
import Seo from "@/models/Seo.model";

async function getOrCreateSeoDocument() {
  let seo = await Seo.findOne();

  if (!seo) {
    seo = await Seo.create({
      metaTitle: "Stoneza | Natural Stone Manufacturer & Exporter",
      metaDescription: "Quarry-direct natural stone manufacturer and exporter in India since 1992. Precision-calibrated sandstone, limestone, granite, cobblestones, and wall cladding.",
      keywords: ["natural stone", "stoneza", "marble", "granite", "flooring", "wall cladding"],
      canonicalUrl: "https://stoneza.in",
      ogImage: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
      ogTitle: "Stoneza | Natural Stone Manufacturer & Exporter",
      ogDescription: "Quarry-direct natural stone manufacturer and exporter in India since 1992.",
      ogUrl: "https://stoneza.in",
      ogType: "website",
      twitterCard: "summary_large_image",
      twitterTitle: "Stoneza | Natural Stone Manufacturer & Exporter",
      twitterDescription: "Quarry-direct natural stone manufacturer and exporter in India since 1992.",
      twitterImage: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
      robotsIndex: true,
      robotsFollow: true,
      enableCustomJsonLd: false,
      customJsonLd: "",
      googleAnalyticsId: "",
      googleTagManagerId: "",
      searchConsoleVerification: "",
      facebookPixelId: "",
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://stoneza.in/sitemap.xml",
      sitemapEnabled: true,
      sitemapExcludePaths: "/admin, /api",
      sitemapChangeFrequency: "weekly",
      sitemapPriority: 0.8,
      organizationName: "Stoneza",
      organizationLegalName: "Stoneza Surfaces LLP",
      organizationLogo: "",
      organizationUrl: "https://stoneza.in",
      organizationPhone: "+91 78771 08154",
      organizationEmail: "sales@stoneza.in",
      socialProfiles: [],
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

    // Standard SEO fields
    if (body.metaTitle !== undefined) seo.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) seo.metaDescription = body.metaDescription;
    if (body.keywords !== undefined) seo.keywords = body.keywords;
    if (body.canonicalUrl !== undefined) seo.canonicalUrl = body.canonicalUrl;
    if (body.ogImage !== undefined) seo.ogImage = body.ogImage;

    // Open Graph fields
    if (body.ogTitle !== undefined) seo.ogTitle = body.ogTitle;
    if (body.ogDescription !== undefined) seo.ogDescription = body.ogDescription;
    if (body.ogUrl !== undefined) seo.ogUrl = body.ogUrl;
    if (body.ogType !== undefined) seo.ogType = body.ogType;

    // Twitter fields
    if (body.twitterCard !== undefined) seo.twitterCard = body.twitterCard;
    if (body.twitterTitle !== undefined) seo.twitterTitle = body.twitterTitle;
    if (body.twitterDescription !== undefined) seo.twitterDescription = body.twitterDescription;
    if (body.twitterImage !== undefined) seo.twitterImage = body.twitterImage;

    // Robots controls
    if (body.robotsIndex !== undefined) seo.robotsIndex = Boolean(body.robotsIndex);
    if (body.robotsFollow !== undefined) seo.robotsFollow = Boolean(body.robotsFollow);

    // Custom JSON-LD
    if (body.enableCustomJsonLd !== undefined) seo.enableCustomJsonLd = Boolean(body.enableCustomJsonLd);
    if (body.customJsonLd !== undefined) seo.customJsonLd = body.customJsonLd;

    // Tracking & Verification
    if (body.googleAnalyticsId !== undefined) seo.googleAnalyticsId = body.googleAnalyticsId;
    if (body.googleTagManagerId !== undefined) seo.googleTagManagerId = body.googleTagManagerId;
    if (body.searchConsoleVerification !== undefined) seo.searchConsoleVerification = body.searchConsoleVerification;
    if (body.facebookPixelId !== undefined) seo.facebookPixelId = body.facebookPixelId;

    // Robots & Sitemap
    if (body.robotsTxt !== undefined) seo.robotsTxt = body.robotsTxt;
    if (body.sitemapEnabled !== undefined) seo.sitemapEnabled = body.sitemapEnabled;
    if (body.sitemapExcludePaths !== undefined) seo.sitemapExcludePaths = body.sitemapExcludePaths;
    if (body.sitemapChangeFrequency !== undefined) seo.sitemapChangeFrequency = body.sitemapChangeFrequency;
    if (body.sitemapPriority !== undefined) seo.sitemapPriority = body.sitemapPriority;

    // Organization Structured Data
    if (body.organizationName !== undefined) seo.organizationName = body.organizationName;
    if (body.organizationLegalName !== undefined) seo.organizationLegalName = body.organizationLegalName;
    if (body.organizationLogo !== undefined) seo.organizationLogo = body.organizationLogo;
    if (body.organizationUrl !== undefined) seo.organizationUrl = body.organizationUrl;
    if (body.organizationPhone !== undefined) seo.organizationPhone = body.organizationPhone;
    if (body.organizationEmail !== undefined) seo.organizationEmail = body.organizationEmail;
    if (body.socialProfiles !== undefined) seo.socialProfiles = body.socialProfiles;

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
