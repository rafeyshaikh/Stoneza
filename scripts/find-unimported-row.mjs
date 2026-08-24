import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Category from "../models/Category.model.js";
import Collection from "../models/Collection.model.js";
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

async function findUnimportedRow() {
  await connectDB();
  const dbProds = await Product.find({}).populate("category").lean();
  console.log("DB count:", dbProds.length);

  const { rows } = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  console.log("CSV rows count:", rows.length);

  // For each CSV row, check if there is a 1-to-1 match in DB
  const matchedDbIds = new Set();
  const unmatchedRows = [];

  rows.forEach((r, idx) => {
    const pName = r["PRODUCT NAME (page)"]?.toLowerCase().trim();
    const sku = (r["HERO — spec code"] || r["TDS L2 Spec code"] || "").toUpperCase().trim();
    const slug = (r["SLUG"] || "").toLowerCase().trim();
    const catName = r["MENU L3 (category)"]?.toLowerCase().trim();

    // Find DB product
    const match = dbProds.find(
      (p) =>
        !matchedDbIds.has(p._id.toString()) &&
        (p.sku?.toUpperCase().trim() === sku ||
          p.slug?.toLowerCase().trim() === slug ||
          (p.name?.toLowerCase().trim() === pName && p.category?.name?.toLowerCase().trim() === catName))
    );

    if (match) {
      matchedDbIds.add(match._id.toString());
    } else {
      unmatchedRows.push({ rowIdx: idx + 1, name: r["PRODUCT NAME (page)"], sku, slug, cat: r["MENU L3 (category)"], col: r["COLLECTIONS menu — collection"] });
    }
  });

  console.log("Unmatched CSV rows count:", unmatchedRows.length);
  console.log("Unmatched CSV rows:", unmatchedRows);

  process.exit(0);
}

findUnimportedRow();
