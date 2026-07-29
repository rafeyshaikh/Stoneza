import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const products = await db.collection("products").find().toArray();
  let invalidCount = 0;

  products.forEach((p) => {
    const url = p.images?.[0]?.url;
    if (url) {
      const isValid = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
      if (!isValid) {
        invalidCount++;
        console.log(`Product: "${p.name}" has invalid image URL: "${url}"`);
      }
    }
  });

  console.log(`\nTotal products with non-URL image strings: ${invalidCount}`);
  process.exit(0);
}

check();
