import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Enquiry from "@/models/Enquiry.model";

export async function GET(req, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const { id } = await params;

    const enquiry = await Enquiry.findById(id).lean();

    if (!enquiry) {
      return response(false, 404, "Enquiry not found");
    }

    return response(true, 200, "Enquiry fetched successfully", enquiry);
  } catch (error) {
    console.error("Admin single enquiry fetch error:", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const updateFields = {};
    if (status !== undefined) {
      const ALLOWED_STATUSES = ["new", "contacted", "in-progress", "converted", "closed"];
      if (!ALLOWED_STATUSES.includes(status)) {
        return response(false, 400, "Invalid status value");
      }
      updateFields.status = status;
    }
    if (notes !== undefined) {
      updateFields.notes = notes;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) {
      return response(false, 404, "Enquiry not found");
    }

    return response(true, 200, "Enquiry updated successfully", enquiry);
  } catch (error) {
    console.error("Admin single enquiry update error:", error);
    return response(false, 500, "Internal Server Error");
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const { id } = await params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return response(false, 404, "Enquiry not found");
    }

    return response(true, 200, "Enquiry deleted successfully");
  } catch (error) {
    console.error("Admin delete enquiry error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
