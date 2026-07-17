/**
 * Redirects the user to WhatsApp with a pre-populated message carrying product details.
 * @param {Object} product - The product object containing details.
 */
export const redirectToWhatsApp = (product, selectedVariants = {}) => {

  const number = process.env.NEXT_PUBLIC_PHONE;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const variantMsg = Object.entries(selectedVariants || {})
    .map(([name, opt]) => `*${name}:* ${opt}`)
    .join("\n");

  const message = product?`Hello Stoneza,

I am interested in the following product:

*Product:* ${product.name}
${product.stoneDetails?.stoneType ? `*Stone Type:* ${product.stoneDetails.stoneType}` : ""}
${product.stoneDetails?.productForm ? `*Format:* ${product.stoneDetails.productForm}` : ""}
${product.stoneDetails?.application ? `*Application:* ${Array.isArray(product.stoneDetails.application) ? product.stoneDetails.application.join(", ") : product.stoneDetails.application}` : ""}
${variantMsg ? `\n*Selected Options:*\n${variantMsg}\n` : ""}
*Link:* ${currentUrl}

Please share more details and pricing.`:`Hello Stoneza,

I am interested in your products.
`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${number}?text=${encodedMessage}`, "_blank");
};
