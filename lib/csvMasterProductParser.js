import { readFile, utils } from "xlsx";

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
 * Parses the master CSV product sheet and returns category tree and product payloads for Mongoose Product model.
 * @param {string} filePath - Absolute path to CSV file
 */
export function parseMasterProductCSV(filePath) {
  const workbook = readFile(filePath, { type: "file" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = utils.sheet_to_json(sheet, { defval: "" });

  const products = [];
  const categoryTree = new Map(); // Top -> Sec -> Fin

  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const name = (r["PRODUCT NAME (page)"] || "").toString().trim();
    const slug = (r["SLUG"] || slugify(name)).toString().trim();
    const sku =
      (r["HERO — spec code"] || "").toString().trim() ||
      (r["TDS L2 Spec code"] || "").toString().trim() ||
      `STZ-PROD-${idx + 1}`;

    if (!name || !slug) continue;

    const topCatName = (r["MENU L1"] || "Wall Cladding").toString().trim();
    const secCatName = (r["MENU L2"] || "Textured Cladding").toString().trim();
    const finCatName = (r["MENU L3 (category)"] || "Fieldstone Cladding").toString().trim();

    // Category tree building
    if (!categoryTree.has(topCatName)) {
      categoryTree.set(topCatName, new Map());
    }
    const topNode = categoryTree.get(topCatName);
    if (!topNode.has(secCatName)) {
      topNode.set(secCatName, new Set());
    }
    topNode.get(secCatName).add(finCatName);

    // Description
    const p1 = (r["OVERVIEW p1"] || "").toString().trim();
    const p2 = (r["OVERVIEW p2 (finish)"] || "").toString().trim();
    const description = p2 ? `${p1}\n\n${p2}` : p1 || name;

    // Images & Captions
    const images = [];
    for (let i = 1; i <= 5; i++) {
      const fn = (r[`IMAGE ${i} filename`] || "").toString().trim();
      const cap = (r[`IMAGE ${i} caption`] || "").toString().trim();
      if (fn) {
        images.push({
          url: fn.startsWith("http") || fn.startsWith("/") ? fn : `/assets/products/${fn}`,
          publicId: fn.split(".")[0],
          caption: cap,
        });
      }
    }

    // Density number
    const densityRaw = (r["TDS R3 Density"] || "").toString().trim();
    const densityMatch = densityRaw.match(/\d+/);
    const density = densityMatch ? parseInt(densityMatch[0], 10) : null;

    // FAQs
    const faqs = [];
    for (let i = 1; i <= 14; i++) {
      const q = (r[`FAQ ${i} question`] || "").toString().trim();
      const a = (r[`FAQ ${i} answer`] || "").toString().trim();
      if (q && a) {
        faqs.push({ question: q, answer: a });
      }
    }

    // Spec variants
    const variants = [];
    const specMappings = [
      ["Size", (r["KEY SPEC 1 Size"] || "").toString().trim()],
      ["Thickness", (r["KEY SPEC 2 Thickness"] || "").toString().trim()],
      ["Surface finish", (r["KEY SPEC 3 Surface finish"] || "").toString().trim()],
      ["Edges", (r["KEY SPEC 4 Edges"] || "").toString().trim()],
      ["Packaging", (r["KEY SPEC 5 Packaging"] || "").toString().trim()],
    ];
    for (const [specName, specVal] of specMappings) {
      if (specVal) {
        variants.push({
          name: specName,
          options: [specVal],
        });
      }
    }

    products.push({
      name,
      slug,
      sku,
      shortDescription: (r["HERO — tagline"] || "").toString().trim(),
      description,
      status: "published",
      isFeatured: idx < 10,
      images,
      categoryHierarchy: {
        topCategory: topCatName,
        secondCategory: secCatName,
        finalCategory: finCatName,
      },
      stoneDetails: {
        stoneType: (r["HERO — stone type"] || "").toString().trim() || (r["TDS L4 Stone type"] || "").toString().trim() || "Natural Sandstone",
        tradeName: (r["Mine / trade name"] || "").toString().trim() || (r["TDS L3 Trade name"] || "").toString().trim(),
        productForm: (r["TDS L9 Packaging"] || "").toString().trim() || (r["KEY SPEC 5 Packaging"] || "").toString().trim(),
        pieceSize: (r["TDS L5 Size"] || "").toString().trim() || (r["KEY SPEC 1 Size"] || "").toString().trim(),
        calibratedThickness: (r["TDS L6 Thickness"] || "").toString().trim() || (r["KEY SPEC 2 Thickness"] || "").toString().trim(),
        faceTexture: (r["TDS L7 Surface finish"] || "").toString().trim() || (r["KEY SPEC 3 Surface finish"] || "").toString().trim(),
        edges: (r["TDS L8 Edges"] || "").toString().trim() || (r["KEY SPEC 4 Edges"] || "").toString().trim(),
        cornerPieces: (r["TDS R7 Corner pieces"] || "").toString().trim(),
        blend: "Pre-blended, fixed ratio",
        joint: (r["TDS R6 Joint"] || "").toString().trim(),
        coveragePerUnit: (r["TDS R5 Coverage"] || "").toString().trim(),
        waterAbsorption: (r["TDS R2 Water absorption"] || "").toString().trim(),
        density,
        weatherResistance: (r["TDS R4 Weather resistance"] || "").toString().trim(),
        weightPerSqM: (r["TDS R1 Weight"] || "").toString().trim() || (r["KEY SPEC 6 Weight"] || "").toString().trim(),
        sealerRequirement: (r["TDS R8 Sealing"] || "").toString().trim(),
        leadTime: (r["TDS R9 Lead time"] || "").toString().trim(),
        sampleAvailable: true,
      },
      overview: {
        specifyFor: (r["OVERVIEW Specify it for"] || "").toString().trim(),
        steerElsewhereFor: (r["OVERVIEW Steer elsewhere"] || "").toString().trim(),
        howItReads: {
          atDistance: (r["READS At a distance"] || "").toString().trim(),
          closeUp: (r["READS Close up"] || "").toString().trim(),
          throughDay: (r["READS Through the day"] || "").toString().trim(),
          whenWet: (r["READS When wet"] || "").toString().trim(),
        },
      },
      faqs,
      variants,
      seo: {
        metaTitle: (r["SEO title"] || "").toString().trim() || name,
        metaDescription: (r["SEO description"] || "").toString().trim() || (r["HERO — tagline"] || "").toString().trim(),
        canonicalUrl: (r["SEO canonical"] || "").toString().trim(),
      },
    });
  }

  return { categoryTree, products };
}
