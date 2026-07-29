import path from "path";
import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import Category from "@/models/Category.model";
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
        return response(false, 400, "No Excel file uploaded");
      }

      const bytes = await file.arrayBuffer();
      input = Buffer.from(bytes);
    } else {
      // Default to parsing public/assets catalog
      input = path.join(process.cwd(), "public", "assets", "Stoneza_Product_ Data- (My version).xlsx");
    }

    const { categoryTree, products } = parseProductExcel(input);

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
          description: `${topName} collection`,
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

    let inserted = 0;
    let updated = 0;

    for (const prodData of products) {
      const { categoryHierarchy, ...rest } = prodData;
      const mapKey = `${categoryHierarchy.topCategory} > ${categoryHierarchy.secondCategory} > ${categoryHierarchy.finalCategory}`;
      const categoryId = categoryMap.get(mapKey);

      if (!categoryId) continue;

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

    return response(true, 200, "Bulk product import completed successfully", {
      productsProcessed: products.length,
      inserted,
      updated,
      categoriesCreated,
      categoriesExisting,
    });
  } catch (error) {
    console.error("Error during bulk product import API:", error);
    return response(false, 500, error.message || "Failed to process bulk import");
  }
}
