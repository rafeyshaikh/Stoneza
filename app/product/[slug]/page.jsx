import { notFound } from "next/navigation";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import Collection from "@/models/Collection.model";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return {
        title: "Product Not Found | Stoneza",
        description: "The requested stone product could not be found.",
      };
    }

    let title = product.seo?.metaTitle?.trim();
    if (!title || title.includes("Manufacturer, Supplier & Exporter") || title.length > 45) {
      title = `${product.name} — ${product.stoneDetails?.stoneType || "Natural Stone"}`;
    }
    title = title.replace(/\s*\|\s*Stoneza.*$/i, "").replace(/\s*—\s*Stoneza.*$/i, "").trim();

    const description =
      product.seo?.metaDescription?.trim() ||
      product.shortDescription?.trim() ||
      (product.description?.replace(/<[^>]*>/g, "")?.slice(0, 160)?.trim() ||
        `Explore quarry-direct ${product.name} natural stone. Calibrated thickness, custom sizes, and architectural specification from Stoneza.`);

    const ogImage =
      product.seo?.ogImage?.trim() ||
      (product.images?.length
        ? typeof product.images[0] === "string"
          ? product.images[0]
          : product.images[0]?.url
        : "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png");

    const canonicalUrl = `https://stoneza.in/product/${slug}`;

    const keywords =
      product.seo?.keywords?.length
        ? product.seo.keywords
        : product.tags?.length
        ? product.tags
        : [product.name, product.stoneDetails?.stoneType, "natural stone", "Stoneza"].filter(Boolean);

    return {
      title,
      description,
      keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Stoneza",
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: product.name }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return {
      title: "Product",
      description: "Explore premium natural stone products from Stoneza.",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let safeProduct = null;

  try {
    await connectDB();
    const product = await Product.findOne({ slug })
      .populate({
        path: "category",
        populate: { path: "parentCategory" },
      })
      .populate({
        path: "collection",
        populate: { path: "parentCollection" },
      })
      .lean();

    if (product) {
      const categoryObj = product.category;
      let categoryName = "";
      let parentCategoryName = "";
      let categorySlug = "";

      const collectionObj = product.collection;
      let collectionName = "";
      let parentCollectionName = "";
      let collectionSlug = "";

      if (collectionObj) {
        collectionName = collectionObj.name || "";
        collectionSlug = collectionObj.slug || "";
        if (collectionObj.parentCollection) {
          parentCollectionName = collectionObj.parentCollection.name || "";
        }
      }

      // Fallback collection derivation from SKU if collection is missing or generic (D-05)
      if (!collectionName || collectionName === "Stonefield" && !product.sku?.startsWith("STZ-ST-")) {
        const skuUpper = (product.sku || "").toUpperCase();
        if (skuUpper.startsWith("STZ-NM-")) collectionName = "Nature Mosaic";
        else if (skuUpper.startsWith("STZ-CO-")) collectionName = "CobbleCraft";
        else if (skuUpper.startsWith("STZ-FO-") || skuUpper.startsWith("STZ-FD-")) collectionName = "Foundations";
        else if (skuUpper.startsWith("STZ-FA-")) collectionName = "Facets & Finishes";
        else if (skuUpper.startsWith("STZ-SW-")) collectionName = "StoneWeave";
        else if (skuUpper.startsWith("STZ-FL-")) collectionName = "Flagstone";
        else if (skuUpper.startsWith("STZ-STP-")) collectionName = "Steps & Coping";
      }

      let relatedProductsRaw = [];
      let relatedCategoriesRaw = [];

      if (categoryObj) {
        categoryName = categoryObj.name || "";
        categorySlug = categoryObj.slug || "";

        // 1. Fetch products of the SAME category or collection, EXCLUDING current product (D-08)
        relatedProductsRaw = await Product.find({
          _id: { $ne: product._id },
          slug: { $ne: product.slug },
          ...(collectionObj ? { collection: collectionObj._id } : { category: categoryObj._id }),
          status: "published",
        })
          .select("name slug images stoneDetails price")
          .limit(16)
          .lean();

        // 2. Fetch related categories (sibling categories under same parent or level)
        if (categoryObj.parentCategory) {
          parentCategoryName = categoryObj.parentCategory.name || "";
          relatedCategoriesRaw = await Category.find({
            _id: { $ne: categoryObj._id },
            parentCategory: categoryObj.parentCategory._id,
            isActive: true,
          })
            .select("name slug categoryLevel bannerImage description")
            .limit(12)
            .lean();
        } else {
          relatedCategoriesRaw = await Category.find({
            _id: { $ne: categoryObj._id },
            categoryLevel: categoryObj.categoryLevel || 1,
            isActive: true,
          })
            .select("name slug categoryLevel bannerImage description")
            .limit(12)
            .lean();
        }
      } else if (collectionObj) {
        relatedProductsRaw = await Product.find({
          _id: { $ne: product._id },
          slug: { $ne: product.slug },
          collection: collectionObj._id,
          status: "published",
        })
          .select("name slug images stoneDetails price")
          .limit(16)
          .lean();
      }

      // Fallback if no same category products found
      if (relatedProductsRaw.length === 0) {
        relatedProductsRaw = await Product.find({
          _id: { $ne: product._id },
          slug: { $ne: product.slug },
          status: "published",
        })
          .select("name slug images stoneDetails price")
          .limit(12)
          .lean();
      }

      // Format Track 1 items: Products of the same category / collection (strictly excluding current)
      const relatedProducts = relatedProductsRaw
        .filter((p) => p.slug !== product.slug)
        .map((p) => ({
          title: p.name,
          subtitle: p.stoneDetails?.stoneType || p.stoneDetails?.faceTexture || "Natural Stone",
          href: `/product/${p.slug}`,
          imageUrl: p.images?.[0]?.url || "",
          bg: "#FAF8F5",
          isCurrent: false,
        }));

      // Format Track 2 items: Related categories
      const relatedCategories = relatedCategoriesRaw
        .filter((c) => !categoryObj || c._id.toString() !== categoryObj._id.toString())
        .map((c) => ({
          title: c.name,
          subtitle: c.description || "Category",
          href: `/product-category/${c.slug}`,
          imageUrl:
            c.bannerImage?.square?.url ||
            c.bannerImage?.wide?.url ||
            (Array.isArray(c.bannerImage?.wide) && c.bannerImage.wide[0]?.url) ||
            "",
          bg: "#FAF8F5",
          isCurrent: false,
        }));

      safeProduct = JSON.parse(
        JSON.stringify({
          ...product,
          categoryName,
          parentCategoryName,
          categorySlug,
          collectionName,
          parentCollectionName,
          collectionSlug,
          relatedProducts,
          relatedCategories,
        })
      );
    }
  } catch (error) {
    console.error("ProductDetailPage error:", error.message);
  }

  if (!safeProduct) {
    notFound();
  }

  // Generate Product & Offer Schema (F-08)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: safeProduct.name,
    image: (safeProduct.images || [])
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean),
    description: safeProduct.description || safeProduct.shortDescription,
    sku: safeProduct.sku,
    mpn: safeProduct.sku,
    brand: {
      "@type": "Brand",
      name: "Stoneza",
    },
    material: safeProduct.stoneDetails?.stoneType || "Natural Stone",
    offers: {
      "@type": "Offer",
      url: `https://stoneza.in/product/${safeProduct.slug}`,
      priceCurrency: "INR",
      price: "0",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/InvoicePrice",
        description: "Price on request • ex-factory",
      },
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Stoneza",
      },
    },
  };

  // Generate FAQPage Schema (F-09)
  const faqSchema =
    safeProduct.faqs && safeProduct.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: safeProduct.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Generate BreadcrumbList Schema (F-09, F-11)
  const breadcrumbElements = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://stoneza.in" },
  ];
  let pos = 2;
  if (safeProduct.categoryName) {
    breadcrumbElements.push({
      "@type": "ListItem",
      position: pos++,
      name: safeProduct.categoryName,
      item: `https://stoneza.in/product-category/${safeProduct.categorySlug || ""}`,
    });
  }
  breadcrumbElements.push({
    "@type": "ListItem",
    position: pos++,
    name: safeProduct.name,
    item: `https://stoneza.in/product/${safeProduct.slug}`,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbElements,
  };

  return (
    <>
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqSchema && (
        <script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient productData={safeProduct} />
    </>
  );
}
