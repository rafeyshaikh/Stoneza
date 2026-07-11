import { connectDB } from "@/lib/databaseConnection";
import Seo from "@/models/Seo.model";

export async function GET() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();

    const fallbackRobots = "User-agent: *\nAllow: /\n\nSitemap: https://stoneza.com/sitemap.xml";
    const content = seo?.robotsTxt || fallbackRobots;

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("robots.txt error:", error);
    return new Response("User-agent: *\nAllow: /", {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
