/**
 * Service helper to fetch latest Instagram media using Meta Graph API.
 * This helper is server-only and handles validation, fetching, caching, and error safety.
 */

export async function fetchInstagramMedia() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  // Validate env variables silently without throwing to keep application running
  if (!token || !accountId) {
    console.error("Instagram integration error: Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID env variables.");
    return [];
  }

  try {
    // Construct request URL securely using standard URL classes
    const baseUrl = `https://graph.facebook.com/v25.0/${accountId}/media`;
    const url = new URL(baseUrl);

    url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}");
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    // Fetch from Meta Graph API using Next.js ISR (caching for 1 hour)
    const response = await fetch(url.toString(), {
      next: {
        revalidate: 3600, // 1 hour
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText || "Unknown API Error";
      // Log generic safe message (DO NOT include url.toString() as it contains the access token)
      console.error(`Instagram Graph API responded with status ${response.status}: ${errorMsg}`);
      return [];
    }

    const json = await response.json();
    if (!json || !Array.isArray(json.data)) {
      console.error("Instagram Graph API returned invalid data format");
      return [];
    }

    // Normalize post shape
    return json.data.map((post) => ({
      id: post.id || "",
      caption: post.caption || "",
      media_type: post.media_type || "IMAGE",
      media_url: post.media_url || "",
      thumbnail_url: post.thumbnail_url || "",
      permalink: post.permalink || "",
      timestamp: post.timestamp || "",
      children: post.children?.data
        ? post.children.data.map((child) => ({
            id: child.id || "",
            media_type: child.media_type || "IMAGE",
            media_url: child.media_url || "",
            thumbnail_url: child.thumbnail_url || "",
          }))
        : null,
    }));
  } catch (error) {
    // Log safe server-side error message
    console.error("Failed to fetch Instagram media due to a network or connection error:", error.message);
    return [];
  }
}
