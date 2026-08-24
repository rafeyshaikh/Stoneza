import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Product from "../models/Product.model.js";
import AboutPage from "../models/AboutPage.model.js";

dotenv.config();

async function fixSectionGData() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected successfully.\n");

    // 1. Fix Product FAQs across all products (G-07)
    const products = await Product.find({});
    let faqUpdates = 0;

    for (const p of products) {
      let modified = false;
      if (p.faqs && p.faqs.length > 0) {
        p.faqs.forEach((faq) => {
          if (
            faq.answer &&
            (faq.answer.includes("We own our mines") ||
              faq.answer.includes("our own mines at Bijolia"))
          ) {
            const stoneType = p.stoneDetails?.stoneType || "natural stone";
            faq.answer = `Stoneza — Anantay Exports Pvt. Ltd. — is a quarry-direct manufacturer, processor and exporter of ${stoneType}, operating from Bhilwara, Rajasthan since 1992. We operate quarries at Bijolia, Kota and Asind alongside verified direct quarry networks across India, processing and calibrating every order through our in-house factories in Bhilwara with zero middle trader markups. We supply pan-India and export worldwide.`;
            modified = true;
          }
        });
      }

      if (modified) {
        await p.save();
        faqUpdates++;
      }
    }
    console.log(`Updated supplier FAQs across ${faqUpdates} products with honest, differentiated positioning.`);

    // 2. Fix AboutPage Document in MongoDB (G-01, G-02, G-03, G-04)
    let aboutDoc = await AboutPage.findOne();
    if (aboutDoc) {
      // Standardize stats (G-04)
      aboutDoc.stats = [
        { number: "273", label: "Natural Stone Products" },
        { number: "34+", label: "Years Since 1992" },
        { number: "18", label: "Named Series (4 Families)" },
        { number: "60+", label: "Quarry Partners & Mines" },
      ];

      // Fix leadership titles (G-03)
      if (!aboutDoc.founders) aboutDoc.founders = {};
      aboutDoc.founders.eyebrow = "Leadership & Direction";
      aboutDoc.founders.people = [
        {
          name: "Kanishk Ostwal",
          role: "Director",
          quotes: [
            '"My commitment is to make natural stone reliable, calibrated, and directly accessible across India with zero middle trader markups."',
            '"From quarry extraction to micron-level factory QC and logistics, we ensure every crate is delivered with uncompromised integrity."',
          ],
        },
        {
          name: "Devanshi Jain",
          role: "Director — Operations",
          quotes: [
            '"At Stoneza, our focus is on architectural precision, texture curation, and the authentic tactile character of natural stone."',
            '"We bridge India’s finest stone belts with contemporary architectural standards through rigorous in-house processing."',
          ],
        },
      ];

      // Standardize dispatch time in How We Work (G-01)
      if (aboutDoc.howWeWork && aboutDoc.howWeWork.steps) {
        aboutDoc.howWeWork.steps.forEach((step) => {
          if (step.description && step.description.includes("hours")) {
            step.description = step.description.replace(/24\s*hours/gi, "48 hours");
          }
        });
      }

      await aboutDoc.save();
      console.log("Updated AboutPage document with Director titles, reconciled stats, and 48h dispatch.");
    }

    console.log("\n=========================================");
    console.log("       SECTION G DB FIX COMPLETED        ");
    console.log("=========================================");
    process.exit(0);
  } catch (error) {
    console.error("Error in fixSectionGData:", error);
    process.exit(1);
  }
}

fixSectionGData();
