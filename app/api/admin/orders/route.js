import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Order from "@/models/Order.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100).lean();

    return response(true, 200, "Orders fetched", orders);
  } catch (error) {
    console.error("Admin orders error", error);
    return response(false, 500, "Internal Server Error");
  }
}
