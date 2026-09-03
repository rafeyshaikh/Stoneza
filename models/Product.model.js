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

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },

    images: [
      {
        url: String,
        publicId: String,
        caption: String,
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
      tradeName: {
        type: String,
        trim: true,
        default: "",
      },
      productForm: {
        type: String,
        trim: true,
        default: "",
      },
      pieceSize: {
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
      edges: {
        type: String,
        trim: true,
        default: "",
      },
      cornerPieces: {
        type: String,
        trim: true,
        default: "",
      },
      blend: {
        type: String,
        trim: true,
        default: "",
      },
      joint: {
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
      application: [
        {
          type: String,
          trim: true,
        },
      ],
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

    overview: {
      specifyFor: {
        type: String,
        default: "",
      },
      steerElsewhereFor: {
        type: String,
        default: "",
      },
      howItReads: {
        atDistance: { type: String, default: "" },
        closeUp: { type: String, default: "" },
        throughDay: { type: String, default: "" },
        whenWet: { type: String, default: "" },
      },
    },

    faqs: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
      },
    ],

    variants: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        options: [
          {
            type: String,
            required: true,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  },
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

