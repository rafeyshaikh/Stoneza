import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const megamenuLinkSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    href: { type: String, trim: true, default: "" },
    slug: { type: String, trim: true, default: "" },
    count: { type: String, trim: true, default: "" },
    badge: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const megamenuActionLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    href: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const megamenuColumnSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    subtitle: { type: String, trim: true, default: "" },
    links: [megamenuLinkSchema],
  },
  { _id: false }
);

const megamenuFeaturedCardSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true, default: "Featured Product" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    image: imageSchema,
    badge: { type: String, trim: true, default: "" },
    href: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const megamenuSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    columns: [megamenuColumnSchema],
    actionLinks: {
      type: [megamenuActionLinkSchema],
      default: [],
    },
    featuredCard: megamenuFeaturedCardSchema,
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
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

    bannerImage: {
      square: mongoose.Schema.Types.Mixed,
      wide: mongoose.Schema.Types.Mixed,
    },

    categoryLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
      default: 1,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    megamenu: {
      type: megamenuSchema,
      default: () => ({
        enabled: true,
        columns: [],
        actionLinks: [],
        featuredCard: {},
      }),
    },

    seo: {
      metaTitle: { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
      keywords: { type: mongoose.Schema.Types.Mixed, default: [] },
      canonicalUrl: { type: String, trim: true, default: "" },
      ogImage: { type: String, trim: true, default: "" },
      ogTitle: { type: String, trim: true, default: "" },
      ogDescription: { type: String, trim: true, default: "" },
      ogUrl: { type: String, trim: true, default: "" },
      ogType: { type: String, trim: true, default: "website" },
      twitterCard: { type: String, trim: true, default: "summary_large_image" },
      twitterTitle: { type: String, trim: true, default: "" },
      twitterDescription: { type: String, trim: true, default: "" },
      twitterImage: { type: String, trim: true, default: "" },
      robotsIndex: { type: Boolean, default: true },
      robotsFollow: { type: Boolean, default: true },
      enableCustomJsonLd: { type: Boolean, default: false },
      customJsonLd: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

export default Category;