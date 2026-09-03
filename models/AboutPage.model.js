import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const eraSchema = new mongoose.Schema(
  {
    year: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    number: { type: String, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false }
);

const founderPersonSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    quotes: [{ type: String, trim: true }],
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    number: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const aboutPageSchema = new mongoose.Schema(
  {
    hero: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      image: imageSchema,
    },

    story: {
      eyebrow: { type: String, trim: true },
      lead: { type: String, trim: true },
      paragraphs: [{ type: String, trim: true }],
      eras: [eraSchema],
      image: imageSchema,
    },

    stats: [statSchema],

    founders: {
      eyebrow: { type: String, trim: true },
      image: imageSchema,
      people: [founderPersonSchema],
    },

    howWeWork: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      steps: [stepSchema],
    },

    showroom: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      buttonText: { type: String, trim: true },
      buttonLink: { type: String, trim: true },
    },

    manifesto: {
      quote: { type: String, trim: true },
      sub: { type: String, trim: true },
    },

    cta: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      buttonText: { type: String, trim: true },
      buttonLink: { type: String, trim: true },
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
  { timestamps: true }
);

const AboutPage = mongoose.models.AboutPage || mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;
