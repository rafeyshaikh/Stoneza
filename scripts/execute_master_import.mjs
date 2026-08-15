import mongoose from "mongoose";
import { parseProductExcel, slugify } from "../lib/excelProductParser.js";
import Category from "../models/Category.model.js";
import Collection from "../models/Collection.model.js";
import Product from "../models/Product.model.js";

const MONGODB_URI = "mongodb+srv://stonezadatabase_db_user:aX684yARGRr6BPvq@cluster0.qhqz0ax.mongodb.net/stoneza?retryWrites=true&w=majority&appName=Cluster0";

async function runImport() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully.");

  const csvPath = "./public/Stoneza_MASTER_Product_Sheet.csv";
  console.log(`Parsing ${csvPath}...`);
  const { categoryTree, collectionTree, products } = parseProductExcel(csvPath);
  console.log(`Parsed ${products.length} products, ${categoryTree.size} top categories, ${collectionTree.size} top collection groups.`);

  // 1. Process Categories
  const categoryMap = new Map();
  let categoriesCreated = 0;
  let categoriesExisting = 0;

  for (const [topName, secMap] of categoryTree.entries()) {
    const topSlug = slugify(topName);
    let topCat = await Category.findOne({ slug: topSlug });

    if (!topCat) {
      topCat = await Category.create({
        name: topName,
        slug: topSlug,
        categoryLevel: 1,
        parentCategory: null,
        description: `${topName} category`,
      });
      categoriesCreated++;
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
        } else {
          categoriesExisting++;
        }

        const mapKey = `${topName} > ${secName} > ${finName}`;
        categoryMap.set(mapKey, finCat._id);
      }
    }
  }
  console.log(`Categories: ${categoriesCreated} created, ${categoriesExisting} existing.`);

  // 2. Process Collections
  const collectionMap = new Map();
  let collectionsCreated = 0;
  let collectionsExisting = 0;

  for (const [topColGroup, subColSet] of collectionTree.entries()) {
    const topColSlug = slugify(topColGroup);
    let topCol = await Collection.findOne({ slug: topColSlug });

    if (!topCol) {
      topCol = await Collection.create({
        name: topColGroup,
        slug: topColSlug,
        collectionLevel: 1,
        parentCollection: null,
        description: `${topColGroup} collection group`,
      });
      collectionsCreated++;
    } else {
      collectionsExisting++;
    }

    for (const subColName of subColSet.values()) {
      const subColSlug = slugify(`${topColGroup}-${subColName}`);
      let subCol = await Collection.findOne({ slug: subColSlug });

      if (!subCol) {
        subCol = await Collection.create({
          name: subColName,
          slug: subColSlug,
          collectionLevel: 2,
          parentCollection: topCol._id,
          description: `${subColName} in ${topColGroup}`,
        });
        collectionsCreated++;
      } else {
        collectionsExisting++;
      }

      const mapKey = `${topColGroup} > ${subColName}`;
      collectionMap.set(mapKey, subCol._id);
    }
  }
  console.log(`Collections: ${collectionsCreated} created, ${collectionsExisting} existing.`);

  // 3. Process Products
  let inserted = 0;
  let updated = 0;

  for (let idx = 0; idx < products.length; idx++) {
    const prodData = products[idx];
    const { categoryHierarchy, collectionHierarchy, ...rest } = prodData;

    const catMapKey = `${categoryHierarchy.topCategory} > ${categoryHierarchy.secondCategory} > ${categoryHierarchy.finalCategory}`;
    const categoryId = categoryMap.get(catMapKey);

    let collectionId = null;
    if (collectionHierarchy?.topCollection && collectionHierarchy?.subCollection) {
      const colMapKey = `${collectionHierarchy.topCollection} > ${collectionHierarchy.subCollection}`;
      collectionId = collectionMap.get(colMapKey) || null;
    }

    if (!categoryId) {
      console.warn(`Skipping row ${idx+1} [${rest.name}] due to missing category mapping: ${catMapKey}`);
      continue;
    }

    let existingProduct = await Product.findOne({ slug: rest.slug });
    if (!existingProduct) {
      existingProduct = await Product.findOne({ sku: rest.sku });
    }

    if (existingProduct) {
      const productPayload = {
        ...rest,
        sku: existingProduct.sku,
        category: categoryId,
        collection: collectionId,
      };
      await Product.findByIdAndUpdate(existingProduct._id, productPayload, {
        new: true,
        runValidators: true,
      });
      updated++;
    } else {
      const productPayload = {
        ...rest,
        category: categoryId,
        collection: collectionId,
      };
      await Product.create(productPayload);
      inserted++;
    }

    if ((idx + 1) % 50 === 0 || idx + 1 === products.length) {
      console.log(`Processed ${idx + 1} / ${products.length} products...`);
    }
  }

  console.log(`\n=== BULK IMPORT SUCCESSFULLY COMPLETED ===`);
  console.log(`Total Products Processed: ${products.length}`);
  console.log(`Products Inserted: ${inserted}`);
  console.log(`Products Updated: ${updated}`);
  console.log(`Categories Created: ${categoriesCreated}`);
  console.log(`Categories Existing: ${categoriesExisting}`);
  console.log(`Collections Created: ${collectionsCreated}`);
  console.log(`Collections Existing: ${collectionsExisting}`);

  await mongoose.disconnect();
}

runImport().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
