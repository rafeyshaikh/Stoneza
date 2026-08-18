import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";

dotenv.config();

const csvPath = path.join(process.cwd(), "public", "variantsFormat_Data_FILLED.csv");

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

async function seedVariants() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected successfully.\n");

    console.log(`Reading variants CSV from: ${csvPath}`);
    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const { headers, rows } = parseCSV(fileContent);

    console.log(`Headers found:`, headers);
    console.log(`Total CSV rows to process: ${rows.length}\n`);

    // Fetch all existing products from DB for fast in-memory matching
    const dbProducts = await Product.find({}, { slug: 1, name: 1 });
    const slugMap = new Map();
    const nameMap = new Map();

    dbProducts.forEach((p) => {
      if (p.slug) slugMap.set(p.slug.toLowerCase().trim(), p);
      if (p.name) nameMap.set(p.name.toLowerCase().trim(), p);
    });

    let updatedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const prodName = row["PRODUCT NAME"];
      const slug = row["SLUG"];

      const cleanSlug = slug ? slug.toLowerCase().trim() : "";
      const cleanName = prodName ? prodName.toLowerCase().trim() : "";

      let matchedProduct = slugMap.get(cleanSlug);
      if (!matchedProduct && cleanName) {
        matchedProduct = nameMap.get(cleanName);
      }

      if (!matchedProduct) {
        console.warn(`[Row ${i + 2}] Warning: No product found matching slug="${slug}" or name="${prodName}"`);
        failedCount++;
        continue;
      }

      // Extract variants from CSV row (variant1_name, variant1_options, ...)
      const variants = [];
      for (let k = 1; k <= 10; k++) {
        const vName = row[`variant${k}_name`];
        const vOptsRaw = row[`variant${k}_options`];

        if (vName && vOptsRaw) {
          let opts = [];
          if (vOptsRaw.includes("|")) {
            opts = vOptsRaw
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean);
          } else {
            opts = [vOptsRaw.trim()];
          }

          if (opts.length > 0) {
            variants.push({
              name: vName.trim(),
              options: opts,
            });
          }
        }
      }

      // Update product document in MongoDB
      await Product.findByIdAndUpdate(
        matchedProduct._id,
        { variants },
        { new: true, runValidators: true }
      );

      updatedCount++;
      if (updatedCount % 25 === 0 || updatedCount === rows.length) {
        console.log(`Progress: Updated ${updatedCount}/${rows.length} products with variants.`);
      }
    }

    console.log("\n=========================================");
    console.log("       VARIANT SEEDING COMPLETED         ");
    console.log("=========================================");
    console.log(`- Successfully Updated: ${updatedCount} products`);
    console.log(`- Failed / Unmatched:   ${failedCount} products`);
    console.log(`- Total Processed:      ${rows.length} rows`);
    console.log("=========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Fatal Error during variant seeding:", error);
    process.exit(1);
  }
}

seedVariants();
