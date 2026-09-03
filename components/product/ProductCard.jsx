"use client";

import { useRouter } from "next/navigation";
import ImageWithLoader from "@/components/common/Loader";
import ProductWatermark from "@/components/common/ProductWatermark";
import { redirectToWhatsApp } from "@/lib/whatsapp";
import { isValidImageUrl, optimizeImageUrl } from "@/lib/utils";

export default function ProductCard({
  item,
  product,
  setHoveredId,
  hoveredId,
  slug,
  button = true,
}) {
  const router = useRouter();

  const prod = item || product || {};
  const name = prod?.name || "";
  const productSlug = prod?.slug || slug || "";
  const productId = (prod?.id || prod?._id)?.toString();
  const collectionName =
    prod?.collection?.name ||
    prod?.collectionName ||
    (typeof prod?.collection === "object" ? prod?.collection?.name : "") ||
    "";

  // Primary main image
  const rawImage =
    prod?.image ||
    prod?.thumbnail?.url ||
    (prod?.images?.length ? prod.images[0]?.url : "") ||
    "";
  const image = isValidImageUrl(rawImage) ? optimizeImageUrl(rawImage) : "";

  // Hover alternate image (fallback to hoverImage, then 2nd gallery image)
  const rawHover =
    prod?.imageHover ||
    prod?.hoverImage?.url ||
    (prod?.images?.length > 1 ? prod.images[1]?.url : "") ||
    "";
  const imageHover = isValidImageUrl(rawHover) ? optimizeImageUrl(rawHover) : "";

  const hasHover = Boolean(imageHover && imageHover !== image);
  const targetUrl = productSlug ? `/product/${productSlug}` : "#";

  return (
    <div
      className="w-full h-auto cursor-pointer"
      onClick={() => {
        if (targetUrl !== "#") router.push(targetUrl);
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="group relative mb-5 w-full aspect-square bg-[#F4F1EB] overflow-hidden"
          onMouseEnter={() => {
            if (setHoveredId) setHoveredId(productId);
          }}
          onMouseLeave={() => {
            if (setHoveredId) setHoveredId(null);
          }}
        >
          {/* Main Primary Image */}
          <div
            className={`w-full h-full relative transition-opacity duration-300 ${
              hasHover ? "group-hover:opacity-0" : ""
            }`}
          >
            <ImageWithLoader
              src={image}
              alt={name}
              fill
              className="h-full w-full object-cover"
              placeholderTitle={name}
            />
          </div>

          {/* Hover Alternate Image (Preloaded & Faded in seamlessly on hover) */}
          {hasHover && (
            <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <ImageWithLoader
                src={imageHover}
                alt={`${name} - alternate view`}
                fill
                className="h-full w-full object-cover"
                placeholderTitle={name}
                seedIndex={100}
              />
            </div>
          )}

          {/* Product Watermark */}
          <ProductWatermark />

          {/* Action buttons (View Product / Enquiry Now) */}
          {button && (
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center bg-white py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (targetUrl !== "#") router.push(targetUrl);
                }}
                className="w-full border-r border-[#cbc9c4] py-2 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                View Product
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  redirectToWhatsApp(prod);
                }}
                className="w-full py-2 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                Enquiry Now
              </button>
            </div>
          )}
        </div>

        {collectionName ? (
          <h4 className="mr-auto font-heading text-[12px] text-[#9A4A2E] uppercase tracking-wider mb-1">
            {collectionName}
          </h4>
        ) : null}
        <h3 className="mr-auto text-left font-display text-base text-[#393938] capitalize">
          {name}
        </h3>
      </div>
    </div>
  );
}