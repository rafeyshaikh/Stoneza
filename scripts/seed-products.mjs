import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import { connectDB } from "../lib/databaseConnection.js";
import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import { parseProductExcel, slugify } from "../lib/excelProductParser.js";

async function runSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected successfully.");

    const excelPath = path.join(process.cwd(), "public", "assets", "Stoneza_Product_ Data- (My version).xlsx");
    console.log(`Parsing Excel file from: ${excelPath}`);

    const { categoryTree, products } = parseProductExcel(excelPath);
    console.log(`Parsed ${products.length} products and category tree.`);

    const categoryMap = new Map(); // key: "top > sec > fin", val: ObjectId

    let categoriesCreated = 0;
    let categoriesExisting = 0;

    console.log("\n--- Synchronizing Category Hierarchy ---");
    for (const [topName, secMap] of categoryTree.entries()) {
      const topSlug = slugify(topName);
      let topCat = await Category.findOne({ slug: topSlug });

      if (!topCat) {
        topCat = await Category.create({
          name: topName,
          slug: topSlug,
          categoryLevel: 1,
          parentCategory: null,
          description: `${topName} collection`,
        });
        categoriesCreated++;
        console.log(`+ Created Level 1 Category: ${topName}`);
      } else {
        categoriesExisting++;
      }

      for (const [secName, finSet] of secMap.entries()) {
        const secSlug = slugify(`${topName}-${secName}`);
        let secCat = await Category.findOne({ slug: secSlug });

        if (!secCat) {
          secCat = await Category.create({
            name: secName,
            slug: secSlug,
            categoryLevel: 2,
            parentCategory: topCat._id,
            description: `${secName} in ${topName}`,
          });
          categoriesCreated++;
          console.log(`  + Created Level 2 Category: ${secName}`);
        } else {
          categoriesExisting++;
        }

        for (const finName of finSet.values()) {
          const finSlug = slugify(`${secName}-${finName}`);
          let finCat = await Category.findOne({ slug: finSlug });

          if (!finCat) {
            finCat = await Category.create({
              name: finName,
              slug: finSlug,
              categoryLevel: 3,
              parentCategory: secCat._id,
              description: `${finName} in ${secName}`,
            });
            categoriesCreated++;
            console.log(`    + Created Level 3 Category: ${finName}`);
          } else {
            categoriesExisting++;
          }

          const mapKey = `${topName} > ${secName} > ${finName}`;
          categoryMap.set(mapKey, finCat._id);
        }
      }
    }

    console.log(`Categories summary: ${categoriesCreated} created, ${categoriesExisting} existing.`);

    console.log("\n--- Upserting Products ---");
    let inserted = 0;
    let updated = 0;

    for (const prodData of products) {
      const { categoryHierarchy, ...rest } = prodData;
      const mapKey = `${categoryHierarchy.topCategory} > ${categoryHierarchy.secondCategory} > ${categoryHierarchy.finalCategory}`;
      const categoryId = categoryMap.get(mapKey);

      if (!categoryId) {
        console.warn(`Warning: No category ObjectId found for key "${mapKey}". Skipping ${rest.name}.`);
        continue;
      }

      const productPayload = {
        ...rest,
        category: categoryId,
      };

      const existingProduct = await Product.findOne({ sku: rest.sku });
      if (existingProduct) {
        await Product.findByIdAndUpdate(existingProduct._id, productPayload, { new: true, runValidators: true });
        updated++;
      } else {
        await Product.create(productPayload);
        inserted++;
      }
    }

    console.log(`\nImport Completed Successfully!`);
    console.log(`- Products Inserted: ${inserted}`);
    console.log(`- Products Updated: ${updated}`);
    console.log(`- Total Processed: ${inserted + updated}`);

    process.exit(0);
  } catch (error) {
    console.error("Fatal Error during product import:", error);
    process.exit(1);
  }
}

runSeed();
