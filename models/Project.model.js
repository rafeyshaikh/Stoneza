import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    altText: {
      type: String,
      default: "",
      trim: true,
    },
    isHero: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },

    segment: {
      type: String,
      required: [true, "Project segment is required"],
      enum: {
        values: [
          "Hospitality",
          "Residential",
          "Landscape",
          "Commercial",
          "Export",
          "other",
          "Other",
        ],
        message: "{VALUE} is not a valid segment",
      },
      trim: true,
      index: true,
    },

    location: {
      city: {
        type: String,
        trim: true,
        default: "",
      },
      state: {
        type: String,
        trim: true,
        default: "",
      },
      formatted: {
        type: String,
        trim: true,
        default: "",
      },
    },

    application: [
      {
        type: String,
        trim: true,
      },
    ],

    stone: {
      type: String,
      trim: true,
      default: "",
    },

    products: [
      {
        type: String,
        trim: true,
      },
    ],

    supply: {
      type: String,
      trim: true,
      default: "",
    },

    bannerImage: {
      type: imageSchema,
      default: null,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual("fullLocation").get(function () {
  if (this.location?.formatted) return this.location.formatted;
  const parts = [this.location?.city, this.location?.state].filter(Boolean);
  return parts.join(", ");
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
