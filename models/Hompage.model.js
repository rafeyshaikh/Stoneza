// models/Homepage.model.js

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
    title: String,
    subtitle: String,
    paragraph: String,
    buttonText: String,
    buttonLink: String,
    image: imageSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: Number,
  },
  { _id: false }
);


const testimonialSchema = new mongoose.Schema(
  {
    name: String,
    review: String,
    location: String,
  },
  { _id: false }
);

const instagramPostSchema = new mongoose.Schema(
  {
    images: [imageSchema],
    link: String,
    caption: String,
  },
  { _id: false }
);

const homepageSchema = new mongoose.Schema(
  {
    heroSlides: [heroSlideSchema],

    newArrivalsTitle: String,

    testimonials: [testimonialSchema],

    instagramPosts: [instagramPostSchema],

  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Homepage ||
  mongoose.model("Homepage", homepageSchema);