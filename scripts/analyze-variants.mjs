import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";

dotenv.config();

const csvPath = path.join(process.cwd(), "public", "variantsFormat_Data_FILLED.csv");
const masterCsvPath = path.join(process.cwd(), "public", "Stoneza_MASTER_Product_Sheet.csv");

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

async function analyze() {
  await connectDB();
  const dbProducts = await Product.find({}, { name: 1, slug: 1, variants: 1, sku: 1 }).lean();
  console.log("DB Products count:", dbProducts.length);

  const fileContent = fs.readFileSync(csvPath, "utf-8");
  const { headers, rows } = parseCSV(fileContent);
  console.log("variantsFormat_Data_FILLED.csv rows:", rows.length);
  console.log("variants CSV Headers:", headers);

  // Check how many CSV rows matched vs didn't match
  const slugMap = new Map();
  const nameMap = new Map();
  dbProducts.forEach((p) => {
    if (p.slug) slugMap.set(p.slug.toLowerCase().trim(), p);
    if (p.name) nameMap.set(p.name.toLowerCase().trim(), p);
  });

  let matchedBySlug = 0;
  let matchedByName = 0;
  let unmatchedRows = [];

  rows.forEach((row, idx) => {
    const slug = (row["SLUG"] || "").toLowerCase().trim();
    const name = (row["PRODUCT NAME"] || "").toLowerCase().trim();
    
    if (slug && slugMap.has(slug)) {
      matchedBySlug++;
    } else if (name && nameMap.has(name)) {
      matchedByName++;
    } else {
      unmatchedRows.push({ rowIdx: idx + 2, slug, name });
    }
  });

  console.log(`Matched by slug: ${matchedBySlug}`);
  console.log(`Matched by name: ${matchedByName}`);
  console.log(`Unmatched rows in variants CSV: ${unmatchedRows.length}`);
  if (unmatchedRows.length > 0) {
    console.log("Sample unmatched rows:", unmatchedRows.slice(0, 10));
  }

  // Also inspect what Stoneza_MASTER_Product_Sheet.csv has
  if (fs.existsSync(masterCsvPath)) {
    const masterContent = fs.readFileSync(masterCsvPath, "utf-8");
    const { headers: masterHeaders, rows: masterRows } = parseCSV(masterContent);
    console.log("\nStoneza_MASTER_Product_Sheet.csv rows:", masterRows.length);
    console.log("Stoneza_MASTER_Product_Sheet.csv headers:", masterHeaders.filter(h => h.toLowerCase().includes("variant") || h.toLowerCase().includes("thick") || h.toLowerCase().includes("size") || h.toLowerCase().includes("edge")));
  }

  process.exit(0);
}

analyze();
