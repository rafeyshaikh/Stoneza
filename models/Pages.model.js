import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
  {
    address: String,
    phone: String,
    whatsapp: String,
    youtube: String,
    instagram: String,
    facebook: String,
    email: String,
    mapEmbedCode: String,
  },
  { _id: false },
);

const policySchema = new mongoose.Schema(
  { title: String, content: String },
  { _id: false },
);

const pageSchema = new mongoose.Schema(
  {
    contactUs: contactUsSchema,

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
