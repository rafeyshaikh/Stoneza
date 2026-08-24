import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Category from "../models/Category.model.js";
import Collection from "../models/Collection.model.js";
import Product from "../models/Product.model.js";

dotenv.config();

const masterCsvPath = path.join(process.cwd(), "public", "Stoneza_MASTER_Product_Sheet.csv");

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (text) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        result.push(cur);
        cur = "";
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length === 1 && vals[0] === "") continue;
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = vals[idx] ? vals[idx].trim() : "";
    });
    rows.push(rowObj);
  }
  return { headers, rows };
}

// Rich Architectural Descriptions Map for Categories and Collections (E-02)
const CATEGORY_DESCRIPTIONS = {
  // L1
  "paving-flooring": "Quarry-direct natural stone paving tiles, heavy-duty cobblestones, precision-calibrated crazy paving, and large-format interior limestone and sandstone flooring.",
  "wall-cladding": "Natural stone facade slabs, rockface walling, precision ledge form panels, and monolithic stone cladding engineered for contemporary elevations and structural facades.",
  "landscape-garden": "Hand-selected sculptural boulders, river pebbles, crushed decorative gravels, solid carved stone furniture, and organic stone glow landscape illumination.",

  // L2 Wall Cladding
  "textured-cladding": "Tactile split-face, rockface, and hand-chiseled walling formats designed to create organic depth, shadow lines, and raw masonry texture across exterior and interior feature walls.",
  "facade-feature": "Architectural facade slabs, large-format panels, and lightweight thin veneers calibrated for seamless vertical installation on residential and commercial facades.",
  "carved-3d-stone": "Precision CNC fluted profiles, geometric masonry panels, and custom-chiseled stone relief work tailored for luxury hospitality and accent elevations.",

  // L3 Wall Cladding
  "fieldstone-cladding": "Random-sized organic sandstone and limestone flags offering authentic cottage and heritage masonry character with modern calibrated installation.",
  "ledge-stone-cladding": "Linear dry-stack ledge stone formats with interlocking profiles for clean horizontal coursing on boundary walls and entrance features.",
  "rockface-cladding": "Heavy-textured quarried rockface blocks featuring deep dimensional relief and rugged mountain stone aesthetics.",
  "thin-stone-veneer": "Real quarried natural stone sliced to ultra-light 12–15 mm profiles for weight-sensitive vertical surfaces and retrofit cladding.",
  "flexible-stone-veneer": "Micro-thin natural stone sheets backed with fiberglass resin, enabling curved columns and lightweight architectural applications.",
  "sandstone-facade-slabs": "Large-format 20–30 mm sandstone facade panels in honed, shotblast, and textured finishes for monolithic contemporary elevations.",
  "granite-facade-slabs": "Ultra-durable, weather-impervious granite slabs calibrated for high-rise facades and institutional architecture.",
  "limestone-facade-slabs": "Fine-grained Kota and regional limestone panels providing soft, neutral warmth across exterior building envelopes.",
  "cnc-fluted-panels": "Fluted, reeded, and scalloped 3D architectural panels cut with high-precision diamond CNC tooling.",
  "carved-jali-screens": "Intricately perforated stone jali panels providing natural ventilation, filtered daylight, and timeless architectural privacy.",

  // L2 Paving & Flooring
  "flooring": "Large-format interior and exterior stone slabs available in polished, satin, riverwash, and honed finishes for monolithic floor surfaces.",
  "paving": "Exterior paving stones, heavy-duty cobblestones, and calibrated crazy paving engineered to endure harsh weathering and vehicular loads.",
  "pool-water": "Low-absorption natural quartzite, limestone, and granite tiles with non-slip surfaces tailored for pool interiors and surrounding decks.",
  "steps-paths": "Solid monolithic 40 mm stone stair treads, coping pieces, and organic stepping stones crafted for garden landscapes and elevation transitions.",

  // L3 Paving & Flooring
  "kota-stone": "Classic Rajasthan limestone quarried from our Bijolia and Kota mines — renowned for extreme density, low porosity, and timeless cool grey-green tones.",
  "kadappa-stone": "Deep charcoal and velvet-black limestone offering monolithic consistency and high compressive strength for modern interiors and courtyards.",
  "sandstone-flooring": "Warm-toned large-format sandstone slabs pre-sealed at our works for interior elegance with natural slip resistance.",
  "pattern-inlay": "Custom waterjet and CNC-cut multi-stone geometric patterns, medallions, and borders dry-laid and numbered for seamless site installation.",
  "cobblestone": "Hand-split and machine-cut cobblestone blocks in 20–90 mm thicknesses engineered for heavy vehicular driveways and heritage pathways.",
  "paving-tiles-patio-packs": "Calibrated 20–22 mm stone paving flags and multi-size patio packs designed for effortless outdoor entertaining zones.",
  "crazy-paving": "Irregular interlocking stone flags calibrated to 20–30 mm and 30–40 mm bands for level, tripping-free installation across organic landscape walkways.",
  "pool-tiles": "Emerald-green Sukabumi quartzite and dense limestone tiles delivering natural water vibrancy and enduring chemical resistance.",
  "pool-copings": "Precision bullnose and drop-down stone coping units providing safe grip, smooth edge transitions, and seamless perimeter integration.",
  "steps-treads": "Full-length 40 mm single-piece stone treads with rockface edges eliminating vulnerable grout joints on exterior steps.",
  "stepping-stones": "Organically shaped 30–50 mm thick stone steppers creating natural, rhythmic pathway journeys through lawns and gravel beds.",

  // L2 Landscape & Garden
  "boulders-feature-stone": "Hand-selected monolithic granite and sandstone landscape boulders inspected and approved before quarry dispatch.",
  "ground-cover": "Precision-graded river pebbles and crushed mineral gravels providing clean drainage and rich textural ground layering.",
  "stone-objects": "Solid stone hand-carved benches, monolithic water basins, and weather-resistant stone glow luminaires.",

  // L3 Landscape & Garden
  "sculptural-boulders": "Weathered natural landscape boulders with rich lichen patina and sculptural geological contours.",
  "pebbles": "Smooth water-worn river pebbles in sorted size bands (20–100 mm) for water features, dry riverbeds, and planter top-dressings.",
  "gravels": "Crushed angular stone aggregates offering excellent interlock and ground stability for walkways and driveways.",
  "stone-glow-lighting": "Sculpted hollow-body natural stone luminaires casting warm, subtle accent lighting along outdoor paths and courtyards.",
  "stone-furniture": "Monolithic stone benches and sculptural tables quarried and carved from single solid stone blocks for permanent outdoor installation.",
};

const COLLECTION_DESCRIPTIONS = {
  // L1
  "surface-collections": "Seven signature stone series encompassing fieldstone walling, cobblestones, calibrated crazy paving, and foundational limestone flooring.",
  "facade-collections": "Specialized vertical surface series engineered for high-performance building envelopes, large-format panels, and thin stone veneers.",
  "atelier-artistry": "High-craft bespoke collection combining artisan hand-chiseling, multi-stone inlays, and precision diamond CNC sculpture.",
  "landscape-collections": "Curated landscape architectural series featuring sculptural boulders, polished water pebbles, graded gravels, and solid stone lighting.",

  // L2
  "stonefield": "Natural organic fieldstone cladding with weathered textures and earthy tonal warmth, inspired by timeless countryside masonry.",
  "ledge-form": "Linear interlocking ledge stone profiles providing structured horizontal coursing and crisp architectural shadow lines.",
  "rawscape": "Heavy split-face rockface stone walling designed for rugged, fortress-like elevation presence and enduring durability.",
  "cobblecraft": "Traditional and contemporary stone cobbles crafted in calibrated thicknesses for pedestrian courtyards and heavy-traffic driveways.",
  "outfloor": "Calibrated exterior paving flags and multi-size patio packs curated for terraces, garden decks, and outdoor living spaces.",
  "foundations": "Core limestone and sandstone flooring series (Kota, Kadappa, Mandana) offering proven performance and monolithic beauty.",
  "nature-mosaic": "Precision-calibrated crazy paving flags creating flowing, non-repeating natural stone mosaic floors for landscape pathways.",
  "facade-stone": "Large-format 20–30 mm calibrated sandstone and limestone panels engineered for high-end exterior rainscreens and facades.",
  "earthskin": "Thin-profile stone cladding panels offering lightweight vertical installation without compromising authentic stone depth.",
  "veneer-series": "Flexible and ultra-thin real stone veneers enabling seamless application on curved walls, ceilings, and interior millwork.",
  "cascade": "Cascading textured stone tiles and water-wall surfaces engineered to guide water flow with rhythmic surface refraction.",
  "cnc-atelier": "Bespoke fluted, reeded, and micro-grooved architectural stone surfaces sculpted with precision multi-axis CNC machines.",
  "stoneweave": "Artisanal woven stone patterns and contrasting multi-material inlays dry-laid and numbered for luxury flooring installations.",
  "boulderscape": "Monolithic feature boulders quarried in sculptural natural forms for statement focal points in luxury landscape architecture.",
  "pebblescape": "Tumbled and washed natural river pebbles curated in uniform color grades and sizes for water features and ground cover.",
  "gravelscape": "Crushed natural stone chippings providing permeable, low-maintenance ground surfacing for walkways and vehicular paths.",
  "stone-artistry": "Solid stone architectural objects, monolithic outdoor seating, and bespoke hand-carved stone vessels.",
  "stone-glow": "Hollowed natural stone lanterns and pathway bollards designed to integrate organic illumination into landscape environments.",
};

async function fixSectionEData() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected successfully.\n");

    // 1. Reconcile missing 273rd product: Cosmic Rust (E-09)
    let existingCosmicRust = await Product.findOne({ slug: "cosmic-rust" });
    if (!existingCosmicRust) {
      console.log("Adding missing 273rd product: Cosmic Rust (Row 1)...");
      const fieldstoneCat = await Category.findOne({ slug: "fieldstone-cladding" });
      const stonefieldCol = await Collection.findOne({ slug: { $in: ["surface-collections-stonefield", "stonefield"] } });

      await Product.create({
        name: "Cosmic Rust",
        slug: "cosmic-rust",
        sku: "STZ-ST-COSR",
        description: "The most varied face in the collection.\n\nNatural sandstone quarried from our Monsoon Multi deposits, featuring rich iron-oxide banding, warm terracotta undertones, and weathered olive-grey relief.",
        shortDescription: "The most varied face in the collection — natural sandstone with rich geological rust and ochre tonal movement.",
        category: fieldstoneCat ? fieldstoneCat._id : null,
        collection: stonefieldCol ? stonefieldCol._id : null,
        status: "published",
        images: [
          {
            url: "https://res.cloudinary.com/chlmognp/image/upload/v1787583274/stoneza/products/copy-of-copy-of-img-8990-mt7cxe0u.jpg",
            caption: "Cosmic Rust — Fieldstone Cladding",
          },
        ],
        stoneDetails: {
          stoneType: "Natural sandstone",
          tradeName: "Monsoon Multi",
          productForm: "Natural + Tumbled",
          pieceSize: "Length 4\"–15\" · Width 4\"–15\" (random)",
          calibratedThickness: "20–22 MM",
          faceTexture: "Natural + Tumbled",
          edges: "Per collection standard",
          cornerPieces: "On request",
          coveragePerUnit: "Crate pack — 220 sqft/pack",
          waterAbsorption: "1.5-2.5%",
          density: 2300,
          weatherResistance: "Yes — exterior grade",
          application: ["Large elevations", "Boundary walls", "Entrances and courtyards"],
          installationMethod: "Mortared onto masonry wall with staggered joints.",
          weightPerSqM: "5 kg/sqft",
          groutRecommendation: "2–4 mm",
          sealerRequirement: "Impregnating sealer for exteriors",
          leadTime: "In stock / 2–6 weeks custom",
          sampleAvailable: true,
        },
        overview: {
          specifyFor: "Large elevations, boundary walls and anything meant to read as aged or geological. It is the most forgiving colour on a big wall because the variation absorbs the eye rather than exposing repetition.",
          steerElsewhereFor: "Projects wanting a uniform, monolithic solid grey with zero natural colour movement.",
          howItReads: {
            atDistance: "A warm, textured elevation with rich organic variation that softens large architectural planes.",
            closeUp: "Pronounced mineral banding, subtle cleft ridges, and hand-chiseled perimeter character.",
            throughDay: "Warm undertones glow under late afternoon sunlight; cooler neutral greys emerge in overcast lighting.",
            whenWet: "Iron-oxide terracotta and golden ochre veins deepen into dramatic saturated contrast.",
          },
        },
        variants: [
          { name: "Thickness", options: ["20–22 MM"] },
          { name: "Size", options: ["Length 4\"–15\" · Width 4\"–15\" (random)"] },
          { name: "Edges", options: ["Hand-cut sides"] },
          { name: "Packaging", options: ["Crate pack - 220 sqft/pack"] },
        ],
        faqs: [
          {
            question: "Who supplies Cosmic Rust in India?",
            answer: "Stoneza — Anantay Exports Pvt. Ltd. — is a quarry-direct manufacturer and exporter operating from Bhilwara, Rajasthan since 1992.",
          },
          {
            question: "What is the lead time for Cosmic Rust?",
            answer: "Standard crate packs ship within 3–7 business days pan-India. Custom lot selections require 2–4 weeks.",
          },
        ],
        seo: {
          metaTitle: "Cosmic Rust Fieldstone Cladding | Natural Sandstone Wall Stone | Stoneza",
          metaDescription: "Explore Cosmic Rust natural sandstone fieldstone wall cladding by Stoneza. Rich earthy iron-oxide tones with 20–22 mm calibrated thickness.",
          canonicalUrl: "https://stoneza.in/product/cosmic-rust",
        },
      });
      console.log("Successfully created Cosmic Rust (Product #273).");
    } else {
      console.log("Cosmic Rust already exists in DB.");
    }

    // 2. Update Category Descriptions (E-02)
    const allCategories = await Category.find({});
    let catDescUpdated = 0;

    for (const cat of allCategories) {
      const slugKey = cat.slug.toLowerCase().trim();
      // Match exact slug or sub-slug
      let richDesc = CATEGORY_DESCRIPTIONS[slugKey];
      if (!richDesc) {
        // Try matching normalized name
        const normKey = Object.keys(CATEGORY_DESCRIPTIONS).find(
          (k) => slugKey.endsWith(k) || k.endsWith(slugKey)
        );
        if (normKey) richDesc = CATEGORY_DESCRIPTIONS[normKey];
      }

      if (richDesc && cat.description !== richDesc) {
        cat.description = richDesc;
        if (!cat.seo) cat.seo = {};
        if (!cat.seo.metaDescription || cat.seo.metaDescription.includes("category")) {
          cat.seo.metaDescription = richDesc;
        }
        if (!cat.seo.metaTitle) {
          cat.seo.metaTitle = `${cat.name} | Natural Stone Manufacturer & Supplier | Stoneza`;
        }
        await cat.save();
        catDescUpdated++;
      }
    }
    console.log(`Updated rich descriptions on ${catDescUpdated} categories.`);

    // 3. Update Collection Descriptions (E-02)
    const allCollections = await Collection.find({});
    let colDescUpdated = 0;

    for (const col of allCollections) {
      const slugKey = col.slug.toLowerCase().trim();
      let richDesc = COLLECTION_DESCRIPTIONS[slugKey];
      if (!richDesc) {
        const normKey = Object.keys(COLLECTION_DESCRIPTIONS).find(
          (k) => slugKey.endsWith(k) || k.endsWith(slugKey)
        );
        if (normKey) richDesc = COLLECTION_DESCRIPTIONS[normKey];
      }

      if (richDesc && col.description !== richDesc) {
        col.description = richDesc;
        if (!col.seo) col.seo = {};
        if (!col.seo.metaDescription || col.seo.metaDescription.includes("collection")) {
          col.seo.metaDescription = richDesc;
        }
        if (!col.seo.metaTitle) {
          col.seo.metaTitle = `${col.name} Collection | Stoneza`;
        }
        await col.save();
        colDescUpdated++;
      }
    }
    console.log(`Updated rich descriptions on ${colDescUpdated} collections.`);

    // 4. Verify Total Counts (E-09)
    const finalProductCount = await Product.countDocuments({ status: "published" });
    console.log(`\nFinal Published Products Count in MongoDB: ${finalProductCount}`);

    console.log("\n=========================================");
    console.log("       SECTION E DB FIX COMPLETED        ");
    console.log("=========================================");

    process.exit(0);
  } catch (error) {
    console.error("Error in fixSectionEData:", error);
    process.exit(1);
  }
}

fixSectionEData();
