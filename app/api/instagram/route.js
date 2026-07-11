import { fetchInstagramMedia } from "@/lib/instagram";

export async function GET() {
  try {
    const posts = await fetchInstagramMedia();
    return Response.json({
      success: true,
      posts,
    });
  } catch (error) {
    // Graceful error fallback response (no token or url leakage)
    return Response.json(
      {
        success: false,
        error: "Failed to fetch Instagram posts",
      },
      { status: 500 }
    );
  }
}
