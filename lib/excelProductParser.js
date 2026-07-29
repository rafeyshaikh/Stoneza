import XLSX from "xlsx";

export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parses an Excel file buffer or file path and returns structured category trees and product objects.
 * @param {Buffer | string} input - File buffer or file path
 * @returns {{ categoryTree: Map, products: Array }}
 */
export function parseProductExcel(input) {
  let workbook;
  if (typeof input === "string") {
    workbook = XLSX.readFile(input);
  } else {
    workbook = XLSX.read(input, { type: "buffer" });
  }

  const sheetName = workbook.SheetNames.includes("Product Details")
    ? "Product Details"
    : workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (rows.length < 2) {
    throw new Error("The Excel file contains no product data rows.");
  }

  const products = [];
  const categoryTree = new Map(); // Top -> Sec -> Fin

  // Skip header row (index 0)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[1] || !row[1].toString().trim()) {
      continue; // Skip empty rows
    }

    const getCol = (idx) => (row[idx] !== undefined && row[idx] !== null ? row[idx].toString().trim() : "");

    const name = getCol(1);
    const topCatName = getCol(2) || "Uncategorized";
    const secCatName = getCol(3) || "General";
    const finCatName = getCol(4) || "All Products";

    const description = getCol(5) || name;
    const shortDescription = getCol(6) || "";

    const rawTags = getCol(7);
    const tags = rawTags
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const priceStr = getCol(8);
    const stockStr = getCol(9);
    const weightStr = getCol(10);
    const lenStr = getCol(11);
    const widthStr = getCol(12);
    const heightStr = getCol(13);

    const stoneType = getCol(14) || "Natural Stone";
    const productForm = getCol(15);
    const calibratedThickness = getCol(16);
    const faceTexture = getCol(17);
    const cornerPieces = getCol(18);
    const coveragePerUnit = getCol(19);
    const waterAbsorption = getCol(20);
    const densityStr = getCol(21);
    const weatherResistance = getCol(22);

    const rawApps = getCol(23);
    const application = rawApps
      ? rawApps.split(",").map((a) => a.trim()).filter(Boolean)
      : [];

    const installationMethod = getCol(24);
    const moq = getCol(25) || priceStr || "Project-based — ask us";
    const weightPerSqM = getCol(26);
    const groutRecommendation = getCol(27);
    const sealerRequirement = getCol(28);
    const leadTime = getCol(29);

    const sampleAvailStr = getCol(30).toLowerCase();
    const sampleAvailable = ["yes", "y", "true", "1"].includes(sampleAvailStr);

    const mainImgLink = getCol(31);
    const hoverImgLink = getCol(32);

    let sku = getCol(33);
    if (!sku) {
      sku = `STZ-${slugify(name).toUpperCase().slice(0, 15)}`;
    }

    // Build Category Hierarchy Map
    if (!categoryTree.has(topCatName)) {
      categoryTree.set(topCatName, new Map());
    }
    const topNode = categoryTree.get(topCatName);
    if (!topNode.has(secCatName)) {
      topNode.set(secCatName, new Set());
    }
    topNode.get(secCatName).add(finCatName);

    // Format Images
    const images = mainImgLink
      ? [{ url: mainImgLink, publicId: "" }]
      : [];

    const hoverImage = hoverImgLink
      ? { url: hoverImgLink, publicId: "" }
      : { url: "", publicId: "" };

    // Numerical conversions
    const price = parseFloat(priceStr) || 0;
    const stock = parseInt(stockStr, 10) || 0;
    const weight = parseFloat(weightStr) || 0;
    const density = parseFloat(densityStr) || null;
    const length = parseFloat(lenStr) || null;
    const width = parseFloat(widthStr) || null;
    const height = parseFloat(heightStr) || null;

    products.push({
      name,
      slug: slugify(name),
      sku,
      description,
      shortDescription,
      price,
      stock,
      weight,
      dimensions: { length, width, height },
      tags,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      status: "published",
      images,
      hoverImage,
      categoryHierarchy: {
        topCategory: topCatName,
        secondCategory: secCatName,
        finalCategory: finCatName,
      },
      stoneDetails: {
        stoneType,
        productForm,
        calibratedThickness,
        faceTexture,
        cornerPieces,
        coveragePerUnit,
        waterAbsorption,
        density,
        weatherResistance,
        application,
        installationMethod,
        moq,
        weightPerSqM,
        groutRecommendation,
        sealerRequirement,
        leadTime,
        sampleAvailable,
      },
      seo: {
        metaTitle: name,
        metaDescription: shortDescription || description.slice(0, 155),
        keywords: tags,
      },
    });
  }

  return { categoryTree, products };
}
