import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase().trim();
  if (lower.includes("placeholder")) return false;
  return lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("/") || lower.startsWith("data:");
}
