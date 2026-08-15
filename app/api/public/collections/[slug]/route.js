import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { getCollectionDetails } from "@/lib/getCollectionDetails";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const data = await getCollectionDetails(slug);

    if (!data) {
      return response(false, 404, "Collection not found");
    }

    return response(true, 200, "Collection details fetched successfully", data);
  } catch (error) {
    console.error("Public collection slug GET error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
