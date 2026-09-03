import mongoose from "mongoose";

/**
 * Standardized SEO sub-schema definition across all Stoneza entities.
 * Fully backward-compatible with legacy fields (metaTitle, metaDescription, keywords, canonicalUrl, ogImage).
 */
export const seoSubSchemaDefinition = {
  metaTitle: { type: String, trim: true, default: "" },
  metaDescription: { type: String, trim: true, default: "" },
  keywords: { type: mongoose.Schema.Types.Mixed, default: [] },
  canonicalUrl: { type: String, trim: true, default: "" },
  ogImage: { type: String, trim: true, default: "" },

  // Enhanced Open Graph fields
  ogTitle: { type: String, trim: true, default: "" },
  ogDescription: { type: String, trim: true, default: "" },
  ogUrl: { type: String, trim: true, default: "" },
  ogType: { type: String, trim: true, default: "website" },

  // Enhanced Twitter / X fields
  twitterCard: {
    type: String,
    trim: true,
    enum: ["summary_large_image", "summary", "app", "player", ""],
    default: "summary_large_image",
  },
  twitterTitle: { type: String, trim: true, default: "" },
  twitterDescription: { type: String, trim: true, default: "" },
  twitterImage: { type: String, trim: true, default: "" },

  // Enhanced Robots controls
  robotsIndex: { type: Boolean, default: true },
  robotsFollow: { type: Boolean, default: true },

  // Custom JSON-LD structured data override
  enableCustomJsonLd: { type: Boolean, default: false },
  customJsonLd: { type: String, default: "" },
};

export const seoMongooseSchema = new mongoose.Schema(seoSubSchemaDefinition, {
  _id: false,
});
