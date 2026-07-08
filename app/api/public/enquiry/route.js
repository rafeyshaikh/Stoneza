import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { enquirySchema } from "@/lib/validations/enquiry";
import Enquiry from "@/models/Enquiry.model";

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return response(false, 400, "Validation failed", {}, { errors });
    }

    const { website, ...enquiryData } = parsed.data;

    // Honeypot tripped — pretend success, don't save
    if (website && website.length > 0) {
      return response(true, 201, "Enquiry submitted");
    }

    await connectDB();
    const enquiry = await Enquiry.create(enquiryData);

    return response(true, 201, "Enquiry submitted", { id: enquiry._id });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return response(false, 500, "Something went wrong. Please try again.");
  }
}