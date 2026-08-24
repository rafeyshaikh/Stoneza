import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";

dotenv.config();

async function list29() {
  await connectDB();
  const allProds = await Product.find({
    $or: [
      { variants: { $exists: false } },
      { variants: { $size: 0 } },
      { variants: null }
    ]
  })
    .populate("category", "name slug")
    .select("name slug sku category")
    .sort({ name: 1 })
    .lean();

  console.log(`TOTAL WITHOUT VARIANTS: ${allProds.length}\n`);
  allProds.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.sku || 'NO SKU'}] ${p.name} | Slug: ${p.slug} | Category: ${p.category?.name || 'N/A'}`);
  });

  process.exit(0);
}

list29();
