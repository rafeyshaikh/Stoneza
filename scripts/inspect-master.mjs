import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";

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

async function inspectMaster() {
  await connectDB();
  const dbProducts = await Product.find({}).lean();
  console.log("DB Products count:", dbProducts.length);

  const masterContent = fs.readFileSync(masterCsvPath, "utf-8");
  const { headers, rows } = parseCSV(masterContent);
  console.log("Master headers:", headers);

  const sampleRow = rows[0];
  console.log("\nSample Row Keys & Values (first 25):");
  Object.keys(sampleRow).slice(0, 25).forEach(k => {
    console.log(`  ${k}: ${sampleRow[k]}`);
  });

  console.log("\nSample Row Spec fields:");
  Object.keys(sampleRow).filter(k => k.toLowerCase().includes("spec") || k.toLowerCase().includes("tds") || k.toLowerCase().includes("option") || k.toLowerCase().includes("variant")).forEach(k => {
    console.log(`  ${k}: ${sampleRow[k]}`);
  });

  process.exit(0);
}

inspectMaster();
