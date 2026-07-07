import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import User from "@/models/User.model";
import Enquiry from "@/models/Enquiry.model";

export async function GET() {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const [
      totalProducts,
      totalCategories,
      totalEnquiries,
      totalCustomers,
      revenueAggregation,
      recentEnquiries,
      recentCustomers,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ deletedAt: null }),
      Category.countDocuments({ deletedAt: null }),
      Enquiry.countDocuments({}),
      User.countDocuments({ role: { $in: ["user", "customer"] }, deletedAt: null }),
      Enquiry.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      User.find({ role: { $in: ["user", "customer"] }, deletedAt: null }).sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({ deletedAt: null, stock: { $gt: 0, $lte: 10 } }).select("name sku stock").sort({ stock: 1 }).limit(8).lean(),
      Product.find({ deletedAt: null, stock: 0 }).select("name sku stock").sort({ updatedAt: -1 }).limit(8).lean(),
    ]);

    return response(true, 200, "Dashboard data fetched", {
      totalProducts,
      totalCategories,
      totalEnquiries,
      totalRevenue: revenueAggregation[0]?.totalRevenue || 0,
      totalCustomers,
      recentEnquiries,
      recentCustomers,
      lowStockProducts,
      outOfStockProducts,
    });
  } catch (error) {
    console.error("Admin dashboard error", error);
    return response(false, 500, "Internal Server Error");
  }
}
