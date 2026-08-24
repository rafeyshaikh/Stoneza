import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";

dotenv.config();

const csvPath = path.join(process.cwd(), "public", "Stoneza_MASTER_Product_Sheet.csv");

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

async function findMissing() {
  await connectDB();
  const dbProds = await Product.find({}).lean();
  console.log("DB count:", dbProds.length);

  const { rows } = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  console.log("CSV rows count:", rows.length);

  const dbSlugs = new Set(dbProds.map((p) => p.slug?.toLowerCase()));
  const dbSkus = new Set(dbProds.map((p) => p.sku?.toUpperCase()));

  const missing = [];
  rows.forEach((r, idx) => {
    const name = r["PRODUCT NAME (page)"];
    const sku = (r["HERO — spec code"] || r["TDS L2 Spec code"] || "").toUpperCase();
    const slug = (r["SLUG"] || "").toLowerCase();

    if (!dbSkus.has(sku) && !dbSlugs.has(slug)) {
      missing.push({ rowNumber: idx + 1, name, sku, slug, cat: r["MENU L3 (category)"], col: r["COLLECTIONS menu — collection"] });
    }
  });

  console.log("Missing rows in DB:", missing);
  process.exit(0);
}

findMissing();
