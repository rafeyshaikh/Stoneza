import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    googleAnalyticsId: { type: String, trim: true },
    searchConsoleVerification: { type: String, trim: true },

    robotsTxt: {
      type: String,
      default: "User-agent: *\nAllow: /\n\nSitemap: https://stoneza.com/sitemap.xml",
    },

    sitemapEnabled: { type: Boolean, default: true },
    sitemapExcludePaths: { type: String, default: "/admin, /api" },
    sitemapChangeFrequency: { type: String, default: "weekly" },
    sitemapPriority: { type: Number, default: 0.8 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Seo || mongoose.model("Seo", seoSchema);
