/**
 * Redirects the user to WhatsApp with a pre-populated message carrying product details.
 * @param {Object} product - The product object containing details.
 */
export const redirectToWhatsApp = (product) => {
  if (!product) return;

  const number = "919950036866";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const message = `Hello Stoneza,

I am interested in the following product:

*Product:* ${product.name}
${product.price ? `*Price:* ₹${product.price.toLocaleString()}` : "*Price:* Price on Request"}
${product.stoneDetails?.stoneType ? `*Stone Type:* ${product.stoneDetails.stoneType}` : ""}
${product.stoneDetails?.productForm ? `*Format:* ${product.stoneDetails.productForm}` : ""}
${product.stoneDetails?.application ? `*Application:* ${product.stoneDetails.application}` : ""}
*Link:* ${currentUrl}

Please share more details and pricing.`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${number}?text=${encodedMessage}`, "_blank");
};
