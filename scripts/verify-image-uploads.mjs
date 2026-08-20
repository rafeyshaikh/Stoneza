import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;
const BASE_IMAGE_DIR = './public/product-images';

async function verifyAll() {
  console.log('=== VERIFYING DATABASE PRODUCT IMAGES ===\n');

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const folders = fs.readdirSync(BASE_IMAGE_DIR).filter(f => fs.statSync(path.join(BASE_IMAGE_DIR, f)).isDirectory());

  const productsWithCloudinary = await db.collection('products').find({
    'images.url': { $regex: 'res.cloudinary.com' }
  }).toArray();

  console.log(`Total products with live Cloudinary gallery images: ${productsWithCloudinary.length}`);

  const productsWithCloudinaryHover = await db.collection('products').find({
    'hoverImage.url': { $regex: 'res.cloudinary.com' }
  }).toArray();

  console.log(`Total products with live Cloudinary hover images: ${productsWithCloudinaryHover.length}\n`);

  console.log('--- Sample 10 Updated Products ---');
  productsWithCloudinary.slice(0, 10).forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.slug}] "${p.name}"`);
    console.log(`   Gallery count: ${p.images?.length || 0}`);
    if (p.images?.[0]) {
      console.log(`   Main Image: ${p.images[0].url} (publicId: ${p.images[0].publicId})`);
    }
    if (p.hoverImage?.url) {
      console.log(`   Hover Image: ${p.hoverImage.url} (publicId: ${p.hoverImage.publicId})`);
    }
    console.log('');
  });

  // Check if any updated products still have old mock paths
  const invalidProducts = productsWithCloudinary.filter(p => {
    return p.images?.some(img => img.url.includes('/assets/products/')) || p.hoverImage?.url?.includes('/assets/products/');
  });

  if (invalidProducts.length === 0) {
    console.log('✓ VERIFICATION PASSED: No mock/placeholder URLs remain on any updated products.');
  } else {
    console.log(`❌ WARNING: ${invalidProducts.length} products still have mock paths.`);
  }

  await mongoose.disconnect();
}

verifyAll().catch(console.error);
