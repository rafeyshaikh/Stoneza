export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control":
    "public, s-maxage=3600, stale-while-revalidate=86400",
};

export const SHORT_PUBLIC_CACHE_HEADERS = {
  "Cache-Control":
    "public, s-maxage=300, stale-while-revalidate=3600",
};