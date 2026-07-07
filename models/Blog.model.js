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
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String,
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