import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const collectionSchema = new mongoose.Schema(
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
      square: imageSchema,

      wide: {
        type: [imageSchema],
        validate: {
          validator: (value) => value.length <= 2,
          message: "Maximum 2 wide banners are allowed",
        },
        default: [],
      },
    },

    collectionLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
      default: 1,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    parentCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
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
  },
  {
    timestamps: true,
  }
);

const Collection =
  mongoose.models.Collection ||
  mongoose.model("Collection", collectionSchema);

export default Collection;
