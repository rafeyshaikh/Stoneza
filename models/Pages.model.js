import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false },
);

const aboutUsSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    images: [imageSchema],
  },
  { _id: false },
);

const contactUsSchema = new mongoose.Schema(
  {
    address: String,
    phone: String,
    email: String,
    mapEmbedCode: String,
  },
  { _id: false },
);

const policySchema = new mongoose.Schema(
  { title: String, content: String },
  {
    _id: false,
  },
);

const pageSchema = new mongoose.Schema(
  {
    aboutUs: aboutUsSchema,

    contactUs: contactUsSchema,

    privacyPolicy: policySchema,

    termsAndConditions: policySchema,
  },
  {
    timestamps: true,
  },
);

const Pages = mongoose.models.Pages || mongoose.model("Pages", pageSchema);

export default Pages;
