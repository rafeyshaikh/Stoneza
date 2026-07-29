import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const pCount = await db.collection("products").countDocuments();
  const cCount = await db.collection("categories").countDocuments();

  console.log("=== MONGODB ATLAS LIVE STATUS ===");
  console.log(`Total Products: ${pCount}`);
  console.log(`Total Categories: ${cCount}`);

  const samples = await db.collection("products").find().limit(5).toArray();
  console.log("\nSample 5 Products in Database:");
  samples.forEach((p) => {
    console.log(` - ${p.name} | SKU: ${p.sku}`);
  });

  process.exit(0);
}

check();
