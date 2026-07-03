import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const customers = await User.find({ role: { $in: ["user", "customer"] }, deletedAt: null })
      .select("name email createdAt address")
      .sort({ createdAt: -1 })
      .lean();

    return response(true, 200, "Customers fetched", customers);
  } catch (error) {
    console.error("Admin customers error", error);
    return response(false, 500, "Internal Server Error");
  }
}
