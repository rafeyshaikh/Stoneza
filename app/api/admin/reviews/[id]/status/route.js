import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Review from "@/models/Review.model";
import Order from "@/models/Order.model";

const ALLOWED_STATUSES = ["pending", "approved", "rejected"];

export async function PATCH(req, { params }) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const body = await req.json();
    const nextStatus = body.status;

    if (!ALLOWED_STATUSES.includes(nextStatus)) {
      return response(false, 400, "Invalid review status");
    }

    const review = await Review.findById(params.id);

    if (!review) {
      return response(false, 404, "Review not found");
    }

    const order = await Order.findById(review.order).lean();

    if (!order || order.status !== "Delivered") {
      return response(false, 400, "Review can be approved only for delivered orders");
    }

    review.status = nextStatus;
    if (nextStatus !== "approved") {
      review.isFeaturedTestimonial = false;
    }

    await review.save();

    return response(true, 200, "Review status updated", review);
  } catch (error) {
    console.error("Admin review status update error", error);
    return response(false, 500, "Internal Server Error");
  }
}
