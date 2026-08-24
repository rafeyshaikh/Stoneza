import mongoose from "mongoose";

const personContactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    whatsapp: String,
    email: String,
    linkedIn: String,
  },
  { _id: false }
);

const contactUsSchema = new mongoose.Schema(
  {

    hero: {
      bgImage: {
        type: String,
        default:
          "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
      },
    },


    cards: {
      whatsappPhone: { type: String, default: "+91 78771 08154" },
      whatsappHref: { type: String, default: "https://wa.me/917877108154" },
      emailAddress: { type: String, default: "sales@stoneza.in" },
      officeLocation: {
        type: String,
        default:
          "F-124, RIICO Growth Centre, Hamirgarh, Bhilwara, Rajasthan — 311025, India",
      },
      workingHours: { type: String, default: "Mon–Sat, 9:30–18:30 IST" },
      gstin: { type: String, default: "08AAWCA2095G1Z9" },
      cin: { type: String, default: "U14100RJ2021PTC076892" },
    },

    legal: {
      legalEntity: { type: String, default: "Anantay Exports Pvt. Ltd." },
      tradeName: { type: String, default: "trading as Stoneza" },
      cin: { type: String, default: "U14100RJ2021PTC076892" },
      gstin: { type: String, default: "08AAWCA2095G1Z9" },
      registeredAddress: {
        type: String,
        default:
          "F-124, RIICO Growth Centre, Hamirgarh, Bhilwara, Rajasthan — 311025, India",
      },
      displayAddress: {
        type: String,
        default: "Bhilwara, Rajasthan — 311025",
      },
    },

    socials: {
      instagram: {
        type: String,
        default: "https://www.instagram.com/thestoneza",
      },
      facebook: {
        type: String,
        default: "https://www.facebook.com/thestoneza",
      },
      youtube: {
        type: String,
        default: "https://www.youtube.com/@thestoneza",
      },
      linkedin: {
        type: String,
        default: "https://www.linkedin.com/company/thestoneza",
      },
    },

    peopleSection: {
      people: [personContactSchema],
    },
    location: {
      mapEmbedUrl: {
        type: String,
        default:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115682.49392576307!2d74.57076418854448!3d25.348612140417937!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c237a505b38d%3A0xb3cf51d8b72445b2!2sBhilwara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      },
    },

    // Legacy / Flat Fallback Fields
    address: String,
    phone: String,
    whatsapp: String,
    youtube: String,
    instagram: String,
    facebook: String,
    linkedIn: String,
    email: String,
    gstin: String,
    cin: String,
    registeredAddress: String,
    mapEmbedCode: String,

    seo: {
      metaTitle: { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
      keywords: { type: String, trim: true, default: "" },
      canonicalUrl: { type: String, trim: true, default: "" },
      ogImage: { type: String, trim: true, default: "" },
    },
  },
  { _id: false },
);

const policySchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    seo: {
      metaTitle: { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
      keywords: { type: String, trim: true, default: "" },
      canonicalUrl: { type: String, trim: true, default: "" },
      ogImage: { type: String, trim: true, default: "" },
    },
  },
  { _id: false },
);

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
    eyebrow: { type: String, trim: true, default: "Featured Collection" },
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

const collectionsOverviewSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Collections" },
    description: {
      type: String,
      default:
        "Twelve named collections. Each one is a way of working with stone, not a group of colours.",
    },
    bannerImage: {
      square: imageSchema,
      wide: {
        type: [imageSchema],
        default: [],
      },
    },
    megamenu: megamenuSchema,
    seo: {
      metaTitle: { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
      keywords: { type: String, trim: true, default: "" },
      canonicalUrl: { type: String, trim: true, default: "" },
      ogImage: { type: String, trim: true, default: "" },
    },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    contactUs: contactUsSchema,

    collectionsOverview: collectionsOverviewSchema,

    privacyPolicy: policySchema,

    termsAndConditions: policySchema,

    disclaimer: policySchema,

    returnPolicy: policySchema,
  },
  {
    timestamps: true,
  },
);

const Pages = mongoose.models.Pages || mongoose.model("Pages", pageSchema);

export default Pages;
