import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGODB_URI = process.env.MONGODB_URI;
const BASE_IMAGE_DIR = './public/product-images';

// Custom mappings for folder names that differ from DB slugs
const CUSTOM_MAPPINGS = {
  'asian-gold-sawn-facade': 'asian-gold-sawn',
  'asian-gold-shotblast-facade': 'asian-gold-shotblast',
  'black-fantasy-flamed': 'fantasy-black-flame',
  'burgundy-bliss-paving-tile': 'burgundy-bliss-paving-tiles-patio-packs',
  'castle-grey-paving-tile': 'castle-grey-paving-tiles-patio-packs',
  'cosmic-black-shotblast-facade': 'cosmic-black-shotblast',
  'cosmic-rust': 'cosmic-rust-ledge-stone',
  'lava-black-flamed': 'lava-black-flame',
  'lava-black-shot': 'lava-black-shotblast',
  'linea-black-paving-tile': 'linea-black',
  'linea-black-paving': 'linea-black',
  'midhnight-black': 'midnight-black-natural',
  'sandy-brown-chem-satin': 'sandy-brown-satin',
  'silver-grey-shot': 'silver-grey-granite-shotblast',
  'cosmic-black-bamboo': 'cosmic-black',
  'imperial-blue-rustic-soft': 'imperial-blue',
  'matrix-5d': 'silver-matrix-linea',
  'midnight-black-paving': 'midnight-black-natural-midnight-black-kadappa'
};

async function uploadFileToCloudinary(filePath, folderName, fileName) {
  const sanitizedName = fileName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  const publicId = `${folderName}-${sanitizedName}-${Date.now().toString(36)}`;

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    folder: `stoneza/products/${folderName}`,
    public_id: publicId,
    resource_type: 'auto',
    timeout: 120000,
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
}

async function runBulkUpload() {
  console.log('=== STONEZA PRODUCT IMAGES BULK UPLOAD ===\n');

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  console.log('1. Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB.\n');

  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  console.log(`✓ Loaded ${products.length} products from database.\n`);

  const folders = fs
    .readdirSync(BASE_IMAGE_DIR)
    .filter((f) => fs.statSync(path.join(BASE_IMAGE_DIR, f)).isDirectory());

  console.log(`2. Found ${folders.length} image folders in ${BASE_IMAGE_DIR}.\n`);

  let totalImagesUploaded = 0;
  let productsUpdatedCount = 0;
  let unmappedFoldersCount = 0;
  const stats = [];

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const folderPath = path.join(BASE_IMAGE_DIR, folder);
    const allFiles = fs.readdirSync(folderPath);

    // Filter out duplicate files like *(1).*
    const cleanFiles = allFiles.filter((f) => !f.includes('(1)'));

    if (cleanFiles.length === 0) {
      console.log(`[${i + 1}/${folders.length}] ⚠️ Folder "${folder}" is empty. Skipping.`);
      continue;
    }

    // Determine matching product in DB
    let targetSlug = folder;
    if (CUSTOM_MAPPINGS[folder]) {
      targetSlug = CUSTOM_MAPPINGS[folder];
    }

    let product = products.find((p) => p.slug === targetSlug);
    if (!product) {
      // Try normalized comparison
      const norm = targetSlug.replace(/[^a-z0-9]/gi, '').toLowerCase();
      product = products.find((p) => p.slug.replace(/[^a-z0-9]/gi, '').toLowerCase() === norm);
    }

    console.log(`[${i + 1}/${folders.length}] Processing folder "${folder}" (${cleanFiles.length} files)...`);

    // Separate hover image from main/detail gallery images
    const hoverFile = cleanFiles.find((f) => f.toLowerCase().startsWith('hover'));
    const galleryFiles = cleanFiles
      .filter((f) => !f.toLowerCase().startsWith('hover'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const uploadedImages = [];
    let uploadedHover = null;

    // Upload gallery images
    for (const file of galleryFiles) {
      const filePath = path.join(folderPath, file);
      try {
        console.log(`  ↑ Uploading gallery image: ${file}...`);
        const res = await uploadFileToCloudinary(filePath, folder, file);
        uploadedImages.push({
          url: res.url,
          publicId: res.publicId,
          caption: product ? `${product.name} — ${file.replace(/\.[^/.]+$/, '')}` : file,
        });
        totalImagesUploaded++;
      } catch (err) {
        console.error(`  ❌ Failed to upload ${file}:`, err.message);
      }
    }

    // Upload hover image
    if (hoverFile) {
      const filePath = path.join(folderPath, hoverFile);
      try {
        console.log(`  ↑ Uploading hover image: ${hoverFile}...`);
        const res = await uploadFileToCloudinary(filePath, folder, hoverFile);
        uploadedHover = {
          url: res.url,
          publicId: res.publicId,
        };
        totalImagesUploaded++;
      } catch (err) {
        console.error(`  ❌ Failed to upload hover image ${hoverFile}:`, err.message);
      }
    }

    // If no gallery images exist, use hover image as primary gallery image
    if (uploadedImages.length === 0 && uploadedHover) {
      uploadedImages.push({
        url: uploadedHover.url,
        publicId: uploadedHover.publicId,
        caption: product ? product.name : folder,
      });
    }

    if (product) {
      // 1. Delete old mock/placeholder image data and update with new Cloudinary data
      await db.collection('products').updateOne(
        { _id: product._id },
        {
          $set: {
            images: uploadedImages,
            hoverImage: uploadedHover || (uploadedImages[0] ? { url: uploadedImages[0].url, publicId: uploadedImages[0].publicId } : { url: '', publicId: '' }),
            updatedAt: new Date(),
          },
        }
      );

      productsUpdatedCount++;
      console.log(`  ✓ Updated product "${product.name}" (${product.slug}) with ${uploadedImages.length} images & hover image.\n`);

      stats.push({
        folder,
        productName: product.name,
        productSlug: product.slug,
        imageCount: uploadedImages.length,
        hasHover: !!uploadedHover,
        status: 'UPDATED',
      });
    } else {
      unmappedFoldersCount++;
      console.log(`  ⚠️ No matching DB product found for folder "${folder}". Images uploaded to Cloudinary.\n`);
      stats.push({
        folder,
        productName: null,
        productSlug: null,
        imageCount: uploadedImages.length,
        hasHover: !!uploadedHover,
        status: 'UNMAPPED_UPLOADED',
      });
    }
  }

  console.log('\n========================================');
  console.log('🎉 BULK UPLOAD & SYNCHRONIZATION COMPLETE');
  console.log('========================================');
  console.log(`Total Folders Processed: ${folders.length}`);
  console.log(`Total Cloudinary Uploads: ${totalImagesUploaded}`);
  console.log(`Products Updated in MongoDB: ${productsUpdatedCount}`);
  console.log(`Unmapped Folders (Assets Stored): ${unmappedFoldersCount}`);
  console.log('========================================\n');

  // Save report
  fs.writeFileSync('./scripts/upload-summary.json', JSON.stringify(stats, null, 2));
  console.log('Report saved to scripts/upload-summary.json');

  await mongoose.disconnect();
}

runBulkUpload().catch((err) => {
  console.error('Fatal error during bulk upload:', err);
  process.exit(1);
});
