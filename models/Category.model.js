import mongoose from "mongoose";

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

    image: {
      url: String,
      publicId: String,
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

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
      canonicalUrl: String,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
