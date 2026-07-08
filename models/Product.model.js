import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
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

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    hoverImage: {
      url: String,
      publicId: String,
    },
    tags: [
      {
        type: String,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
      canonicalUrl: String,
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    weight: {
      type: Number,
      default: 0,
    },
    stoneDetails: {
      stoneType: {
        type: String,
        required: true,
        trim: true,
      },
      productForm: {
        type: String,
        trim: true,
        default: "",
      },
      calibratedThickness: {
        type: String,
        trim: true,
        default: "",
      },
      faceTexture: {
        type: String,
        trim: true,
        default: "",
      },
      cornerPieces: {
        type: String,
        trim: true,
        default: "",
      },
      coveragePerUnit: {
        type: String,
        trim: true,
        default: "",
      },
      waterAbsorption: {
        type: String,
        trim: true,
        default: "",
      },
      density: {
        type: Number,
        default: null,
      },
      weatherResistance: {
        type: String,
        trim: true,
        default: "",
      },
      application: {
        type: String,
        trim: true,
        default: "",
      },
      installationMethod: {
        type: String,
        trim: true,
        default: "",
      },
      moq: {
        type: String,
        trim: true,
        default: "Project-based — ask us",
      },
      weightPerSqM: {
        type: String,
        trim: true,
        default: "",
      },
      groutRecommendation: {
        type: String,
        trim: true,
        default: "",
      },
      sealerRequirement: {
        type: String,
        trim: true,
        default: "",
      },
      leadTime: {
        type: String,
        trim: true,
        default: "",
      },
      sampleAvailable: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
