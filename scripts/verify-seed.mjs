import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const sampleProducts = await db.collection("products").find({ "variants.0": { $exists: true } }).limit(3).toArray();

  console.log("=== VERIFICATION SAMPLE PRODUCTS ===");
  sampleProducts.forEach(p => {
    console.log(`\nProduct: ${p.name} (${p.slug})`);
    console.log("Variants:", JSON.stringify(p.variants, null, 2));
  });

  const countWithVariants = await db.collection("products").countDocuments({ "variants.0": { $exists: true } });
  console.log(`\nTotal products in DB with variants populated: ${countWithVariants}`);

  process.exit(0);
}

verify();
