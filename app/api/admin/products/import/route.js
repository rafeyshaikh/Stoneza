import path from "path";
import fs from "fs";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Category from "@/models/Category.model";
import Collection from "@/models/Collection.model";
import Product from "@/models/Product.model";
import { parseProductExcel, slugify } from "@/lib/excelProductParser";

export const maxDuration = 60; // 60s max execution

export async function POST(request) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    let input;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return response(false, 400, "No CSV or Excel file uploaded");
      }

      const bytes = await file.arrayBuffer();
      input = Buffer.from(bytes);
    } else {
      // Default to parsing public/Stoneza_MASTER_Product_Sheet.csv
      const masterCsvPath = path.join(process.cwd(), "public", "Stoneza_MASTER_Product_Sheet.csv");
      const fallbackXlsxPath = path.join(process.cwd(), "public", "assets", "Stoneza_Product_ Data- (My version).xlsx");

      if (fs.existsSync(masterCsvPath)) {
        input = masterCsvPath;
      } else if (fs.existsSync(fallbackXlsxPath)) {
        input = fallbackXlsxPath;
      } else {
        return response(false, 404, "Master catalog file not found");
      }
    }

    const { categoryTree, collectionTree, products } = parseProductExcel(input);

    // 1. Process 3-Level Category Tree
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

    // 2. Process 2-Level Collection Tree
    const collectionMap = new Map();
    let collectionsCreated = 0;
    let collectionsExisting = 0;

    if (collectionTree && collectionTree.size > 0) {
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
    }

    // 3. Import / Upsert Products
    let inserted = 0;
    let updated = 0;

    for (const prodData of products) {
      const { categoryHierarchy, collectionHierarchy, ...rest } = prodData;

      const catMapKey = `${categoryHierarchy.topCategory} > ${categoryHierarchy.secondCategory} > ${categoryHierarchy.finalCategory}`;
      const categoryId = categoryMap.get(catMapKey);

      let collectionId = null;
      if (collectionHierarchy?.topCollection && collectionHierarchy?.subCollection) {
        const colMapKey = `${collectionHierarchy.topCollection} > ${collectionHierarchy.subCollection}`;
        collectionId = collectionMap.get(colMapKey) || null;
      }

      if (!categoryId) continue;

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
    }

    revalidateTag("layout-categories");
    revalidateTag("layout-collections");
    revalidateTag("public-categories");
    revalidateTag("public-collections");
    revalidatePath("/", "layout");

    return response(true, 200, "Bulk product import completed successfully", {
      productsProcessed: products.length,
      inserted,
      updated,
      categoriesCreated,
      categoriesExisting,
      collectionsCreated,
      collectionsExisting,
    });
  } catch (error) {
    console.error("Error during bulk product import API:", error);
    return response(false, 500, error.message || "Failed to process bulk import");
  }
}
