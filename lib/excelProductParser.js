import * as xlsx from "xlsx";
const { read, readFile, utils } = xlsx;

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
 * Parses an Excel / CSV file buffer or file path and returns structured category trees,
 * collection trees, and product objects.
 * @param {Buffer | string} input - File buffer or file path
 * @returns {{ categoryTree: Map, collectionTree: Map, products: Array }}
 */
export function parseProductExcel(input) {
  let workbook;
  if (typeof input === "string") {
    workbook = readFile(input, { raw: false });
  } else {
    workbook = read(input, { type: "buffer", raw: false });
  }

  const sheetName = workbook.SheetNames.includes("Product Details")
    ? "Product Details"
    : workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];
  const jsonRows = utils.sheet_to_json(sheet, { defval: "" });

  if (!jsonRows || jsonRows.length === 0) {
    throw new Error("The file contains no product data rows.");
  }

  const products = [];
  const categoryTree = new Map(); // Top -> Sec -> Fin
  const collectionTree = new Map(); // Top -> Sub
  const seenSlugs = new Set();
  const seenSkus = new Set();

  const getValue = (row, ...keyNames) => {
    for (const key of keyNames) {
      if (row[key] !== undefined && row[key] !== null && row[key].toString().trim() !== "") {
        return row[key].toString().trim();
      }
    }
    const rowKeys = Object.keys(row);
    for (const targetKey of keyNames) {
      const matchedKey = rowKeys.find(
        (k) => k.toLowerCase().trim() === targetKey.toLowerCase().trim()
      );
      if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
        const val = row[matchedKey].toString().trim();
        if (val) return val;
      }
    }
    return "";
  };

  for (let i = 0; i < jsonRows.length; i++) {
    const row = jsonRows[i];

    // Extract product name
    const name = getValue(row, "PRODUCT NAME (page)", "Product Name", "Name", "Title");
    if (!name) continue;

    // Categories
    const topCatName = getValue(row, "MENU L1", "Top Category", "Category Level 1") || "Uncategorized";
    const secCatName = getValue(row, "MENU L2", "Second Category", "Category Level 2") || "General";
    const finCatName = getValue(row, "MENU L3 (category)", "Final Category", "Category Level 3") || "All Products";

    // Collections
    const topColGroup = getValue(row, "COLLECTIONS menu — group", "Top Collection", "Collection Group");
    const subColName = getValue(row, "COLLECTIONS menu — collection", "Sub Collection", "Collection Name");

    // Slug & SKU deduplication
    let rawSlug = getValue(row, "SLUG", "Slug") || slugify(name);
    let slug = rawSlug;
    if (seenSlugs.has(slug)) {
      slug = `${rawSlug}-${slugify(finCatName)}`;
      if (seenSlugs.has(slug)) {
        slug = `${slug}-${i}`;
      }
    }
    seenSlugs.add(slug);

    let rawSku = getValue(row, "HERO — spec code", "TDS L2 Spec code", "SKU", "Spec Code");
    if (!rawSku) rawSku = `STZ-${slug.toUpperCase().slice(0, 15)}`;

    let sku = rawSku;
    if (seenSkus.has(sku)) {
      sku = `${rawSku}-${slug.toUpperCase().slice(0, 15)}`;
      if (seenSkus.has(sku)) {
        sku = `${sku}-${i}`;
      }
    }
    seenSkus.add(sku);

    // Descriptions
    const heroTagline = getValue(row, "HERO — tagline", "Tagline");
    const overviewP1 = getValue(row, "OVERVIEW p1", "Description");
    const overviewP2 = getValue(row, "OVERVIEW p2 (finish)");
    const description = [overviewP1, overviewP2].filter(Boolean).join("\n\n") || name;
    const shortDescription = heroTagline || getValue(row, "Short Description") || overviewP1.slice(0, 160);

    // Tags
    const rawTags = getValue(row, "Tags");
    const tags = rawTags
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [topCatName, secCatName, finCatName].filter(Boolean);

    // Stone Details
    const stoneType = getValue(row, "TDS L4 Stone type", "HERO — stone type", "Stone Type") || "Natural Stone";
    const tradeName = getValue(row, "TDS L3 Trade name", "HERO — trade name", "Mine / trade name", "Trade Name");
    const productForm = getValue(row, "TDS L7 Surface finish", "KEY SPEC 3 Surface finish", "Finish", "Product Form");
    const pieceSize = getValue(row, "TDS L5 Size", "KEY SPEC 1 Size", "Size");
    const calibratedThickness = getValue(row, "TDS L6 Thickness", "KEY SPEC 2 Thickness", "Thickness");
    const faceTexture = getValue(row, "KEY SPEC 3 Surface finish", "Surface finish", "Face Texture") || productForm;
    const edges = getValue(row, "TDS L8 Edges", "KEY SPEC 4 Edges", "Edges");
    const cornerPieces = getValue(row, "TDS R7 Corner pieces", "Corner Pieces");
    const coveragePerUnit = getValue(row, "TDS R5 Coverage", "KEY SPEC 5 Packaging", "Coverage");
    const waterAbsorption = getValue(row, "TDS R2 Water absorption", "Water Absorption");
    const densityStr = getValue(row, "TDS R3 Density", "Density");
    const density = parseFloat(densityStr) || null;
    const weatherResistance = getValue(row, "TDS R4 Weather resistance", "Weather Resistance");

    const app1 = getValue(row, "APPLICATION 1 heading");
    const app2 = getValue(row, "APPLICATION 2 heading");
    const app3 = getValue(row, "APPLICATION 3 heading");
    const application = [app1, app2, app3].filter(Boolean);
    if (application.length === 0) {
      const rawApp = getValue(row, "Application");
      if (rawApp) {
        application.push(...rawApp.split(",").map((a) => a.trim()).filter(Boolean));
      }
    }

    const installationMethod = getValue(row, "APPLICATION 1 text", "Installation Method");
    const moq = getValue(row, "TDS R9 Lead time", "MOQ") || "Project-based — ask us";
    const weightPerSqM = getValue(row, "TDS R1 Weight", "KEY SPEC 6 Weight", "Weight Per SqM");
    const groutRecommendation = getValue(row, "TDS R6 Joint", "Grout Recommendation");
    const sealerRequirement = getValue(row, "TDS R8 Sealing", "FINISH maintenance", "Sealer Requirement");
    const leadTime = getValue(row, "TDS R9 Lead time", "Lead Time");
    const sampleAvailable = true;

    // Overview Section
    const specifyFor = getValue(row, "OVERVIEW Specify it for", "Specify For");
    const steerElsewhereFor = getValue(row, "OVERVIEW Steer elsewhere", "Steer Elsewhere");
    const atDistance = getValue(row, "READS At a distance");
    const closeUp = getValue(row, "READS Close up");
    const throughDay = getValue(row, "READS Through the day");
    const whenWet = getValue(row, "READS When wet");

    // Images & Captions
    const images = [];
    for (let imgIdx = 1; imgIdx <= 5; imgIdx++) {
      const filename = getValue(row, `IMAGE ${imgIdx} filename`);
      const caption = getValue(row, `IMAGE ${imgIdx} caption`);
      if (filename) {
        const url = filename.startsWith("http") || filename.startsWith("/")
          ? filename
          : `/assets/products/${filename}`;
        images.push({ url, publicId: "", caption });
      }
    }

    let hoverImage = { url: "", publicId: "" };
    if (images.length > 1) {
      hoverImage = { url: images[1].url, publicId: "" };
    }

    // FAQs
    const faqs = [];
    for (let faqIdx = 1; faqIdx <= 14; faqIdx++) {
      const question = getValue(row, `FAQ ${faqIdx} question`);
      const answer = getValue(row, `FAQ ${faqIdx} answer`);
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }

    // SEO
    const seoTitle = getValue(row, "SEO title") || `${name} — Manufacturer, Supplier & Exporter | Stoneza`;
    const seoDescription = getValue(row, "SEO description") || shortDescription || description.slice(0, 155);
    const canonicalUrl = getValue(row, "SEO canonical", "URL path")
      ? (getValue(row, "SEO canonical", "URL path").startsWith("http")
          ? getValue(row, "SEO canonical", "URL path")
          : `https://stoneza.in${getValue(row, "SEO canonical", "URL path")}`)
      : "";

    // Build Category Tree
    if (!categoryTree.has(topCatName)) {
      categoryTree.set(topCatName, new Map());
    }
    const topCatNode = categoryTree.get(topCatName);
    if (!topCatNode.has(secCatName)) {
      topCatNode.set(secCatName, new Set());
    }
    topCatNode.get(secCatName).add(finCatName);

    // Build Collection Tree
    if (topColGroup && subColName) {
      if (!collectionTree.has(topColGroup)) {
        collectionTree.set(topColGroup, new Set());
      }
      collectionTree.get(topColGroup).add(subColName);
    }

    products.push({
      name,
      slug,
      sku,
      description,
      shortDescription,
      weight: parseFloat(getValue(row, "Weight")) || 0,
      dimensions: {
        length: parseFloat(getValue(row, "Length")) || null,
        width: parseFloat(getValue(row, "Width")) || null,
        height: parseFloat(getValue(row, "Height")) || null,
      },
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
      collectionHierarchy: {
        topCollection: topColGroup,
        subCollection: subColName,
      },
      overview: {
        specifyFor,
        steerElsewhereFor,
        howItReads: {
          atDistance,
          closeUp,
          throughDay,
          whenWet,
        },
      },
      stoneDetails: {
        stoneType,
        tradeName,
        productForm,
        pieceSize,
        calibratedThickness,
        faceTexture,
        edges,
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
      faqs,
      seo: {
        metaTitle: seoTitle,
        metaDescription: seoDescription,
        keywords: tags,
        canonicalUrl,
      },
    });
  }

  return { categoryTree, collectionTree, products };
}
