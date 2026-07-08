import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";

import Enquiry from "@/models/Enquiry.model";

export async function GET(req) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );

    const query = searchParams.get("query")?.trim() || "";

    const projectType = searchParams.get("projectType")?.trim() || "";

    const status = searchParams.get("status")?.trim() || "";

    const sort = searchParams.get("sort") || "newest";

    const filter = {};

    if (query) {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: query,
            $options: "i",
          },
        },
        {
          city: {
            $regex: query,
            $options: "i",
          },
        },
        {
          stoneType: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    if (projectType) {
      filter.projectType = projectType;
    }

    if (status) {
      filter.status = status;
    }

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "name-a-z":
        sortOption = {
          name: 1,
        };
        break;

      case "name-z-a":
        sortOption = {
          name: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    const [items, total] = await Promise.all([
      Enquiry.find(filter)
        .select("name phone city projectType stoneType area status createdAt")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Enquiry.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return response(true, 200, "Enquiries fetched successfully", {
      items,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },

      filters: {
        query,
        projectType,
        status,
        sort,
      },
    });
  } catch (error) {
    console.error("Admin enquiries error:", error);

    return response(false, 500, "Internal Server Error");
  }
}
