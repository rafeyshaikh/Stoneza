import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    eyebrow: {
      type: String,
      trim: true,
    },
    paragraph: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
    },
    buttonLink: {
      type: String,
      trim: true,
    },
    image: imageSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: Number,
  },
  { _id: false }
);

const featuredProductsSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  bannerImage: imageSchema,
  caption: { type: String, trim: true },
  buttonText: { type: String, trim: true },
}, { _id: false });

const middleBannerSchema = new mongoose.Schema({
  image: imageSchema,
  caption: { type: String, trim: true },
  buttonText: { type: String, trim: true },
  buttonLink: { type: String, trim: true },
}, { _id: false });

const threeBannerSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  image: imageSchema,
  buttonText: { type: String, trim: true },
  buttonLink: { type: String, trim: true },
}, { _id: false });

const twoBannerSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  image: imageSchema,
  caption: { type: String, trim: true },
  buttonText: { type: String, trim: true },
  buttonLink: { type: String, trim: true },
}, { _id: false });

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    review: {
      type: String,
      trim: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
    },
    sortOrder: Number,
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema({
  caption: { type: String, trim: true },
  copyright: { type: String, trim: true },
}, { _id: false });

const homepageSchema = new mongoose.Schema(
  {
    heroSlides: [heroSlideSchema],

    featuredProducts: featuredProductsSchema,

    middleBanner: middleBannerSchema,

    newArrivalsTitle: String,

    threeBanners: [threeBannerSchema],

    brandPromos: [twoBannerSchema],

    testimonials: [testimonialSchema],

    footer: footerSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Homepage ||
  mongoose.model("Homepage", homepageSchema);
