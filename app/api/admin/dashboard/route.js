import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import Enquiry from "@/models/Enquiry.model";
import Blog from "@/models/Blog.model";

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
      newEnquiries,
      activeEnquiries,
      totalBlogs,
    ] = await Promise.all([
      Product.countDocuments({ deletedAt: null }),
      Category.countDocuments({ deletedAt: null }),
      Enquiry.countDocuments({}),
      Enquiry.countDocuments({ status: "new" }),
      Enquiry.countDocuments({ status: { $in: ["contacted", "in-progress"] } }),
      Blog.countDocuments({}),
    ]);

    // Graph data for previous 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const enquiriesTimeline = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const enquiriesGraphData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

      const match = enquiriesTimeline.find(item => item._id === dateStr);
      enquiriesGraphData.push({
        date: label,
        count: match ? match.count : 0
      });
    }

    return response(true, 200, "Dashboard data fetched", {
      totalProducts,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      activeEnquiries,
      totalBlogs,
      enquiriesGraphData,
    });
  } catch (error) {
    console.error("Admin dashboard error", error);
    return response(false, 500, "Internal Server Error");
  }
}
