import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";

dotenv.config();

async function check() {
  await connectDB();
  const allProds = await Product.find({}, { name: 1, slug: 1, variants: 1 }).lean();
  console.log("TOTAL PRODUCTS IN DB:", allProds.length);

  let withVariants = 0;
  let withoutVariants = 0;
  const noVariantSlugs = [];

  for (const p of allProds) {
    if (p.variants && p.variants.length > 0) {
      withVariants++;
    } else {
      withoutVariants++;
      noVariantSlugs.push({ name: p.name, slug: p.slug });
    }
  }

  console.log(`With variants: ${withVariants}`);
  console.log(`Without variants: ${withoutVariants}`);
  
  if (withVariants > 0) {
    const sample = allProds.find(p => p.variants && p.variants.length > 0);
    console.log("\nSample product with variants:", sample.name, `(${sample.slug})`);
    console.log("Variants array:", JSON.stringify(sample.variants, null, 2));
  }

  if (withoutVariants > 0) {
    console.log(`\nFirst 10 products without variants:`, noVariantSlugs.slice(0, 10));
  }

  process.exit(0);
}

check();
