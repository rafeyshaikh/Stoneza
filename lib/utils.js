import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase().trim();
  if (lower.includes("placeholder") && !lower.startsWith("data:image/svg+xml")) return false;
  // Exclude mock / non-existent local product asset directories
  if (lower.startsWith("/assets/products/") || lower.startsWith("/assets/gifting/")) return false;
  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("/") ||
    lower.startsWith("data:")
  );
}

export function optimizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  let cleanUrl = url.trim();
  if (cleanUrl.includes("res.cloudinary.com") && cleanUrl.includes("/image/upload/")) {
    cleanUrl = cleanUrl.replace(/\.heic$/i, ".jpg");
    if (!cleanUrl.includes("/f_auto") && !cleanUrl.includes("/q_auto")) {
      cleanUrl = cleanUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }
  }
  return cleanUrl;
}
