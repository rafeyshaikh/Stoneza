import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    role: {
      type: String,
      enum: [
        "Architect / Designer",
        "PMC / Project manager",
        "Developer / Hotel group",
        "Contractor",
        "Homeowner",
        "Dealer / Distributor",
        "Export buyer",
        "Other",
      ],
      default: "Other",
    },
    projectType: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: Number, default: null },
    stoneType: {
      type: String,
      default: "Natural Stone / General Enquiry",
      trim: true,
    },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "converted", "closed"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

if (mongoose.models.Enquiry) {
  delete mongoose.models.Enquiry;
}
const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
