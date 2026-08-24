import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Project from "../models/Project.model.js";
import Product from "../models/Product.model.js";
import Seo from "../models/Seo.model.js";
import Pages from "../models/Pages.model.js";

dotenv.config();

const WP_CLOUDINARY_MAP = {
  "https://stoneza.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-20-at-3.41.21-PM-1-1.png":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
  "https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
  "https://stoneza.in/wp-content/uploads/2026/02/Landscaping-Outdoor-Living-Natural-Stone.webp":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340268/stoneza/homepage/hero/newslide3-kw98hw7m.png",
  "https://stoneza.in/wp-content/uploads/2026/02/Wall-Facade-Cladding-Natural-Stone.webp":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
  "https://stoneza.in/wp-content/uploads/2026/02/Flooring-Paving-Natural-Stone.webp":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
  "https://stoneza.in/wp-content/uploads/2026/02/Patterns-Finishes-natural-stone.webp":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
  "https://stoneza.in/assets/hero/fieldstone-cladding-facade-banner.webp":
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
};

async function fixSectionFData() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected successfully.\n");

    // 1. Fix Project Images & Thumbnails (F-05 & F-06)
    const projects = await Project.find({});
    let projectsUpdated = 0;

    for (const p of projects) {
      let modified = false;

      // Check bannerImage
      if (p.bannerImage?.url && WP_CLOUDINARY_MAP[p.bannerImage.url]) {
        p.bannerImage.url = WP_CLOUDINARY_MAP[p.bannerImage.url];
        modified = true;
      }
      if (!p.bannerImage?.url) {
        p.bannerImage = {
          url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
        };
        modified = true;
      }

      // Check images array
      if (p.images && p.images.length > 0) {
        p.images.forEach((img) => {
          if (img.url && WP_CLOUDINARY_MAP[img.url]) {
            img.url = WP_CLOUDINARY_MAP[img.url];
            modified = true;
          }
        });
      } else {
        p.images = [
          {
            url: p.bannerImage.url,
            caption: p.title,
          },
        ];
        modified = true;
      }

      // Check thumbnail
      if (!p.thumbnail?.url) {
        p.thumbnail = {
          url: p.images[0]?.url || p.bannerImage?.url,
        };
        modified = true;
      }

      // Fix SEO canonical on project
      if (!p.seo) p.seo = {};
      p.seo.canonicalUrl = `https://stoneza.in/projects`;

      if (modified) {
        await p.save();
        projectsUpdated++;
      }
    }
    console.log(`Updated ${projectsUpdated} projects with valid Cloudinary assets.`);

    // 2. Fix Product Canonicals (F-01, F-02, F-07)
    const products = await Product.find({});
    let productsUpdated = 0;

    for (const p of products) {
      let modified = false;
      if (!p.seo) p.seo = {};

      const correctCanonical = `https://stoneza.in/product/${p.slug}`;
      if (p.seo.canonicalUrl !== correctCanonical) {
        p.seo.canonicalUrl = correctCanonical;
        modified = true;
      }

      // Clean meta title
      if (!p.seo.metaTitle || p.seo.metaTitle.includes("Showcase & Enquiry")) {
        p.seo.metaTitle = `${p.name} — ${p.stoneDetails?.stoneType || "Natural Stone"}`;
        modified = true;
      }

      if (modified) {
        await p.save();
        productsUpdated++;
      }
    }
    console.log(`Updated ${productsUpdated} products with clean canonicals and meta titles.`);

    // 3. Fix Global SEO Document (F-03, F-04, F-06)
    let seo = await Seo.findOne();
    if (!seo) {
      seo = new Seo({});
    }
    seo.metaTitle = "Stoneza | Natural Stone Manufacturer & Exporter";
    seo.metaDescription =
      "Quarry-direct natural stone manufacturer and exporter in India since 1992. Precision-calibrated sandstone, limestone, granite, cobblestones, and wall cladding.";
    seo.ogImage =
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";
    await seo.save();
    console.log("Updated global SEO defaults in database.");

    console.log("\n=========================================");
    console.log("       SECTION F DB FIX COMPLETED        ");
    console.log("=========================================");
    process.exit(0);
  } catch (error) {
    console.error("Error in fixSectionFData:", error);
    process.exit(1);
  }
}

fixSectionFData();
