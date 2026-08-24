import { COMPANY_INFO } from "./constants.js";

/**
 * Builds the WhatsApp direct enquiry URL with full product details and selected variant options.
 * @param {Object} product - The product object containing details.
 * @param {Object} selectedVariants - The currently selected variants/dropdown specs.
 * @returns {string} Fully formatted WhatsApp URL.
 */
export const getWhatsAppUrl = (product, selectedVariants = {}) => {
  const rawNumber = (process.env.NEXT_PUBLIC_PHONE || COMPANY_INFO.phoneRaw || "917877108154").replace(/\D/g, "");
  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://stoneza.in/product/${product?.slug || ""}`;

  const variantEntries = Object.entries(selectedVariants || {})
    .filter(([_, opt]) => Boolean(opt) && String(opt).trim() !== "" && String(opt).trim() !== "—" && String(opt).trim() !== "N/A")
    .map(([name, opt]) => {
      const formattedName = name
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      return `• *${formattedName}:* ${opt}`;
    });

  const variantMsg = variantEntries.join("\n");

  const messageLines = [
    "Hello Stoneza,",
    "",
    "I would like to enquire about the following architectural natural stone:",
    "",
    `*Product:* ${product?.name || "Natural Stone"}`,
  ];

  if (product?.sku || product?.skuCode) {
    messageLines.push(`*SKU:* ${product.sku || product.skuCode}`);
  }

  if (product?.stoneDetails?.stoneType) {
    messageLines.push(`*Stone Type:* ${product.stoneDetails.stoneType}`);
  }

  if (product?.stoneDetails?.productForm) {
    messageLines.push(`*Format:* ${product.stoneDetails.productForm}`);
  }

  if (product?.stoneDetails?.faceTexture) {
    messageLines.push(`*Texture / Finish:* ${product.stoneDetails.faceTexture}`);
  }

  if (product?.stoneDetails?.application) {
    const apps = Array.isArray(product.stoneDetails.application)
      ? product.stoneDetails.application.join(", ")
      : product.stoneDetails.application;
    if (apps) messageLines.push(`*Application:* ${apps}`);
  }

  if (variantMsg) {
    messageLines.push("");
    messageLines.push("*Selected Specifications:*");
    messageLines.push(variantMsg);
  }

  messageLines.push("");
  messageLines.push(`*Page Reference:* ${currentUrl}`);
  messageLines.push("");
  messageLines.push("Please share quarry-direct pricing, availability, and physical sample box dispatch details.");

  const message = messageLines.join("\n");
  return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Redirects the user to WhatsApp with pre-populated message.
 * @param {Object} product - The product object.
 * @param {Object} selectedVariants - The selected variants map.
 */
export const redirectToWhatsApp = (product, selectedVariants = {}) => {
  const url = getWhatsAppUrl(product, selectedVariants);
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
};

