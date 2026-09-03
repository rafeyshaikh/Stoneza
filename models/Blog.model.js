import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    keywords: { type: mongoose.Schema.Types.Mixed, default: [] },
    canonicalUrl: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogUrl: { type: String, trim: true, default: "" },
    ogType: { type: String, trim: true, default: "article" },
    twitterCard: { type: String, trim: true, default: "summary_large_image" },
    twitterTitle: { type: String, trim: true, default: "" },
    twitterDescription: { type: String, trim: true, default: "" },
    twitterImage: { type: String, trim: true, default: "" },
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
    enableCustomJsonLd: { type: Boolean, default: false },
    customJsonLd: { type: String, default: "" },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      trim: true,
      default: "",
    },

    content: {
      type: String,
      required: true,
    },

    bannerImage: {
      type: imageSchema,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    author: {
      type: String,
      default: "Stoneza",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },

    seo: {
      type: seoSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog ||
  mongoose.model("Blog", blogSchema);