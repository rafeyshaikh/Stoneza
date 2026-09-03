import mongoose from "mongoose";
import { seoSubSchemaDefinition } from "@/lib/seo/seoSchema";

const seoSchema = new mongoose.Schema(
  {
    // Full Standard & Enterprise SEO fields (metaTitle, metaDescription, keywords, canonicalUrl, ogImage, ogTitle, ogDescription, ogUrl, ogType, twitterCard, twitterTitle, twitterDescription, twitterImage, robotsIndex, robotsFollow, enableCustomJsonLd, customJsonLd)
    ...seoSubSchemaDefinition,

    // Global Tracking, Analytics & Verification
    googleAnalyticsId: { type: String, trim: true, default: "" },
    googleTagManagerId: { type: String, trim: true, default: "" },
    searchConsoleVerification: { type: String, trim: true, default: "" },
    facebookPixelId: { type: String, trim: true, default: "" },

    // Dynamic Robots.txt Configuration
    robotsTxt: {
      type: String,
      default: "User-agent: *\nAllow: /\n\nSitemap: https://stoneza.in/sitemap.xml",
    },

    // Dynamic XML Sitemap parameters
    sitemapEnabled: { type: Boolean, default: true },
    sitemapExcludePaths: { type: String, default: "/admin, /api" },
    sitemapChangeFrequency: { type: String, default: "weekly" },
    sitemapPriority: { type: Number, default: 0.8 },

    // Global Organization Schema / Knowledge Graph structured data
    organizationName: { type: String, trim: true, default: "Stoneza" },
    organizationLegalName: { type: String, trim: true, default: "Stoneza Surfaces LLP" },
    organizationLogo: { type: String, trim: true, default: "" },
    organizationUrl: { type: String, trim: true, default: "https://stoneza.in" },
    organizationPhone: { type: String, trim: true, default: "+91 78771 08154" },
    organizationEmail: { type: String, trim: true, default: "sales@stoneza.in" },
    socialProfiles: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Seo || mongoose.model("Seo", seoSchema);

