import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";
import Collection from "../models/Collection.model.js";
import Category from "../models/Category.model.js";

dotenv.config();

const masterCsvPath = path.join(process.cwd(), "public", "Stoneza_MASTER_Product_Sheet.csv");
const variantsCsvPath = path.join(process.cwd(), "public", "variantsFormat_Data_FILLED.csv");

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (text) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        result.push(cur);
        cur = "";
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length === 1 && vals[0] === "") continue;
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = vals[idx] ? vals[idx].trim() : "";
    });
    rows.push(rowObj);
  }
  return { headers, rows };
}

async function fixSectionDData() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected successfully.\n");

    // 1. Read Master CSV
    const masterContent = fs.readFileSync(masterCsvPath, "utf-8");
    const { rows: masterRows } = parseCSV(masterContent);
    console.log(`Master CSV rows: ${masterRows.length}`);

    // Map Master rows by SKU and by (Product Name + Category)
    const masterBySku = new Map();
    const masterBySlug = new Map();

    masterRows.forEach((row) => {
      const sku = row["HERO — spec code"] || row["TDS L2 Spec code"];
      const slug = row["SLUG"];
      if (sku) masterBySku.set(sku.trim(), row);
      if (slug) masterBySlug.set(slug.trim().toLowerCase(), row);
    });

    // 2. Read Variants CSV
    const variantsContent = fs.readFileSync(variantsCsvPath, "utf-8");
    const { rows: variantRows } = parseCSV(variantsContent);
    console.log(`Variants CSV rows: ${variantRows.length}`);

    // Build variants map: prefer exact (slug + category/collection context) or row index
    // Group variant rows by slug and product name
    const variantRowList = [];
    variantRows.forEach((row) => {
      const pName = row["PRODUCT NAME"];
      const slug = row["SLUG"] ? row["SLUG"].trim().toLowerCase() : "";
      const variants = [];

      for (let k = 1; k <= 10; k++) {
        const vName = row[`variant${k}_name`];
        const vOptsRaw = row[`variant${k}_options`];
        if (vName && vOptsRaw) {
          const opts = vOptsRaw.includes("|")
            ? vOptsRaw.split("|").map((s) => s.trim()).filter(Boolean)
            : [vOptsRaw.trim()];
          if (opts.length > 0) {
            variants.push({ name: vName.trim(), options: opts });
          }
        }
      }

      variantRowList.push({ pName, slug, variants });
    });

    // Fetch all Collections from DB to ensure collection references are correct
    const allCollections = await Collection.find({}).lean();
    const collectionMap = new Map();
    allCollections.forEach((c) => {
      collectionMap.set(c.name.toLowerCase().trim(), c._id);
      collectionMap.set(c.slug.toLowerCase().trim(), c._id);
    });

    // 3. Process all DB Products
    const products = await Product.find({}).populate("category collection");
    console.log(`\nProcessing ${products.length} products in DB...`);

    let weightFixedCount = 0;
    let malformedSlugFixedCount = 0;
    let collectionFixedCount = 0;
    let variantsFixedCount = 0;
    let specifyForFixedCount = 0;
    let faqFixedCount = 0;

    for (const prod of products) {
      let modified = false;

      // --- D-12: Fix Malformed Slugs ---
      if (prod.slug === "midnight-black-natural-midnight-black-kadappa") {
        prod.slug = "midnight-black-natural-kadappa";
        if (prod.seo) {
          prod.seo.canonicalUrl = "https://stoneza.in/product/midnight-black-natural-kadappa";
        }
        malformedSlugFixedCount++;
        modified = true;
      }

      // Match master row
      const masterRow = masterBySku.get(prod.sku) || masterBySlug.get(prod.slug);

      // --- D-05: Collection Alignment ---
      if (masterRow) {
        const masterColName = masterRow["COLLECTIONS menu — collection"];
        if (masterColName) {
          const targetColId = collectionMap.get(masterColName.toLowerCase().trim());
          if (targetColId && (!prod.collection || prod.collection._id.toString() !== targetColId.toString())) {
            prod.collection = targetColId;
            collectionFixedCount++;
            modified = true;
          }
        }
      }

      // If collection is still missing or wrong, derive from SKU prefix
      if (prod.sku && (!prod.collection || prod.collection?.name === "Stonefield" && !prod.sku.startsWith("STZ-ST-"))) {
        let expectedColName = "";
        if (prod.sku.startsWith("STZ-NM-")) expectedColName = "Nature Mosaic";
        else if (prod.sku.startsWith("STZ-CO-")) expectedColName = "CobbleCraft";
        else if (prod.sku.startsWith("STZ-FA-")) expectedColName = "Facets & Finishes";
        else if (prod.sku.startsWith("STZ-SW-")) expectedColName = "StoneWeave";
        else if (prod.sku.startsWith("STZ-FO-") || prod.sku.startsWith("STZ-FD-")) expectedColName = "Foundations";
        else if (prod.sku.startsWith("STZ-ST-")) expectedColName = "Stonefield";

        if (expectedColName) {
          const colId = collectionMap.get(expectedColName.toLowerCase());
          if (colId && (!prod.collection || prod.collection._id.toString() !== colId.toString())) {
            prod.collection = colId;
            collectionFixedCount++;
            modified = true;
          }
        }
      }

      // --- D-03: Fix Corrupted Weight & Ensure Units ---
      if (prod.stoneDetails) {
        let w = prod.stoneDetails.weightPerSqM || "";
        if (w) {
          // Fix corrupted 85110 kg/sqft -> 85–110 kg/m²
          if (/^85110/i.test(w) || w.includes("85110")) {
            prod.stoneDetails.weightPerSqM = "85–110 kg/m²";
            weightFixedCount++;
            modified = true;
          } else if (/^\d{4,}\s*kg/i.test(w)) {
            // Regex match generic corrupted ranges e.g. 2025 kg -> 20–25 kg/m²
            const match = w.match(/^(\d{2})(\d{2,3})\s*(.*)$/);
            if (match) {
              prod.stoneDetails.weightPerSqM = `${match[1]}–${match[2]} kg/m²`;
              weightFixedCount++;
              modified = true;
            }
          }
        } else if (masterRow && masterRow["TDS R1 Weight"]) {
          let mw = masterRow["TDS R1 Weight"].trim();
          if (mw === "85110 kg/sqft" || mw.includes("85110")) {
            mw = "85–110 kg/m²";
          }
          prod.stoneDetails.weightPerSqM = mw;
          weightFixedCount++;
          modified = true;
        }

        // --- D-09: Ensure Density has units if numeric ---
        if (prod.stoneDetails.density && typeof prod.stoneDetails.density === "number") {
          // density is numeric in schema, ProductTechnicalAccordion will format as kg/m³
        }
      }

      // --- D-03 & D-04 & D-07: Fix FAQs ---
      if (prod.faqs && prod.faqs.length > 0) {
        prod.faqs.forEach((faq) => {
          if (faq.answer) {
            // Fix corrupted weight in FAQ
            if (faq.answer.includes("85110")) {
              faq.answer = faq.answer.replace(/85110\s*kg\s*per\s*sq\s*ft/gi, "85–110 kg/m²")
                                     .replace(/85110\s*kg\/sqft/gi, "85–110 kg/m²")
                                     .replace(/85110/g, "85–110");
              faqFixedCount++;
              modified = true;
            }
            // Fix empty placeholder in FAQ (e.g. "approximately — kg per sq ft")
            if (faq.answer.includes("approximately —") || faq.answer.includes("approximately N/A")) {
              faq.answer = faq.answer.replace(/at approximately — kg per sq ft\.?/gi, "per project requirement.")
                                     .replace(/at approximately N\/A kg per sq ft\.?/gi, "per project requirement.")
                                     .replace(/approximately —/gi, "standard packaging");
              faqFixedCount++;
              modified = true;
            }
            // D-04: Ensure sealing FAQ aligns with stone absorption
            if (faq.question && faq.question.toLowerCase().includes("sealing")) {
              const absorption = prod.stoneDetails?.waterAbsorption || "";
              const sealerReq = prod.stoneDetails?.sealerRequirement || "";
              if (sealerReq.toLowerCase().includes("impregnating") || sealerReq.toLowerCase().includes("recommended")) {
                if (faq.answer.toLowerCase().includes("no sealing required")) {
                  faq.answer = `For ${prod.name}, we recommend applying a breathable impregnating sealer after installation to preserve color depth and provide long-term protection against stains and moisture.`;
                  faqFixedCount++;
                  modified = true;
                }
              } else if (sealerReq.toLowerCase().includes("not required") || absorption.includes("0.5") || absorption.includes("<1")) {
                if (faq.answer.toLowerCase().includes("impregnating sealer required")) {
                  faq.answer = `${prod.name} has low water absorption (${absorption || "under 1%"}), making sealing optional. For high-traffic or food-service areas, a light breathable sealer can be applied.`;
                  faqFixedCount++;
                  modified = true;
                }
              }
            }
          }
        });
      }

      // --- D-11: Fix "Specify it for" when finish text was wrongly placed ---
      if (prod.overview) {
        const curSpecify = prod.overview.specifyFor || "";
        const finishText = prod.stoneDetails?.installationMethod || "";
        if (
          curSpecify.startsWith("Grip when wet") ||
          curSpecify.startsWith("Hand-laid character with the laying speed") ||
          curSpecify === finishText
        ) {
          if (masterRow && masterRow["OVERVIEW Specify it for"] && !masterRow["OVERVIEW Specify it for"].startsWith("Grip when wet")) {
            prod.overview.specifyFor = masterRow["OVERVIEW Specify it for"];
          } else if (prod.stoneDetails?.application && prod.stoneDetails.application.length > 0) {
            prod.overview.specifyFor = prod.stoneDetails.application.join(", ");
          }
          specifyForFixedCount++;
          modified = true;
        }
      }

      // --- D-01 & D-02: Fix Variants Binding to exact product type ---
      // Find matching variant row based on category / collection context
      let matchingVariantRow = null;

      // 1. Try finding by matching product name AND category / sku
      const candidates = variantRowList.filter(
        (v) => v.slug === prod.slug || (v.pName && v.pName.toLowerCase().trim() === prod.name.toLowerCase().trim())
      );

      if (candidates.length === 1) {
        matchingVariantRow = candidates[0];
      } else if (candidates.length > 1) {
        // Disambiguate by category/collection
        const prodCatName = prod.category?.name?.toLowerCase() || "";
        const prodSku = prod.sku || "";

        for (const cand of candidates) {
          if (prodSku.startsWith("STZ-CO-") && cand.variants.some((v) => v.name.toLowerCase().includes("size") && v.options.some((o) => o.includes("100 × 100") || o.includes("100x100")))) {
            matchingVariantRow = cand;
            break;
          } else if (prodSku.startsWith("STZ-NM-") && cand.variants.some((v) => v.options.some((o) => o.toLowerCase().includes("random")))) {
            matchingVariantRow = cand;
            break;
          } else if (prodSku.startsWith("STZ-ST-") && cand.variants.some((v) => v.name.toLowerCase().includes("thickness") && v.options.some((o) => o.includes("20–22") || o.includes("20-22")))) {
            matchingVariantRow = cand;
            break;
          }
        }
        if (!matchingVariantRow) {
          matchingVariantRow = candidates[0];
        }
      }

      if (matchingVariantRow && matchingVariantRow.variants.length > 0) {
        prod.variants = matchingVariantRow.variants;
        variantsFixedCount++;
        modified = true;
      } else {
        // Fallback: create accurate variants from stoneDetails
        const fallbackVariants = [];
        if (prod.stoneDetails?.calibratedThickness) {
          const opts = prod.stoneDetails.calibratedThickness.split("|").map((s) => s.trim()).filter(Boolean);
          if (opts.length > 0) fallbackVariants.push({ name: "Thickness", options: opts });
        }
        if (prod.stoneDetails?.pieceSize) {
          const opts = prod.stoneDetails.pieceSize.split("|").map((s) => s.trim()).filter(Boolean);
          if (opts.length > 0) fallbackVariants.push({ name: "Size", options: opts });
        }
        if (prod.stoneDetails?.faceTexture) {
          const opts = prod.stoneDetails.faceTexture.split("|").map((s) => s.trim()).filter(Boolean);
          if (opts.length > 0) fallbackVariants.push({ name: "Finish", options: opts });
        }
        if (prod.stoneDetails?.edges) {
          const opts = prod.stoneDetails.edges.split("|").map((s) => s.trim()).filter(Boolean);
          if (opts.length > 0) fallbackVariants.push({ name: "Edges", options: opts });
        }
        if (fallbackVariants.length > 0) {
          prod.variants = fallbackVariants;
          variantsFixedCount++;
          modified = true;
        }
      }

      if (modified) {
        await prod.save();
      }
    }

    console.log("\n=========================================");
    console.log("       SECTION D FIX SUMMARY             ");
    console.log("=========================================");
    console.log(`- Malformed Slugs Fixed:     ${malformedSlugFixedCount}`);
    console.log(`- Collections Realignment:   ${collectionFixedCount}`);
    console.log(`- Corrupted Weights Fixed:   ${weightFixedCount}`);
    console.log(`- FAQs Cleaned / Aligned:    ${faqFixedCount}`);
    console.log(`- "Specify It For" Fixed:    ${specifyForFixedCount}`);
    console.log(`- Variants Resynced / Fixed: ${variantsFixedCount}`);
    console.log("=========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error running fixSectionDData:", error);
    process.exit(1);
  }
}

fixSectionDData();
