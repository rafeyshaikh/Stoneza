import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Project from "../models/Project.model.js";

const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error("MONGODB_URI is missing in environment");
  process.exit(1);
}

const seedProjects = [
  {
    title: "JW Marriott Ranthambore",
    slug: "jw-marriott-ranthambore",
    description:
      "Castle Grey crazy paving and fieldstone across the arrival court and entrance approach — the first thing a guest walks on, and the surface least forgiving of a bad batch. The stone was supplied quarry-direct and batch-matched across construction phases. That matters more on a hospitality project than anywhere else: work happens in stages, sometimes years apart, and a paving run that shifts tone halfway across a courtyard cannot be fixed without lifting it. It remains the project we point architects to when they ask whether a natural stone surface can be held to a specification at scale.",
    segment: "Hospitality",
    location: {
      city: "Sawai Madhopur",
      state: "Rajasthan",
      formatted: "Sawai Madhopur, Rajasthan",
    },
    application: ["Arrival court", "entrance approach"],
    stone: "Castle Grey — Kandla Grey sandstone",
    products: ["Crazy paving", "fieldstone cladding"],
    supply: "Quarry-direct, batch-matched across phases",
    bannerImage: {
      url: "https://stoneza.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-20-at-3.41.21-PM-1-1.png",
      publicId: "jw-marriott-ranthambore",
    },
    images: [
      {
        url: "https://stoneza.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-20-at-3.41.21-PM-1-1.png",
        publicId: "jw-marriott-1",
        caption: "Arrival Court & Main Entrance Paving",
      },
    ],
    isFeatured: true,
    status: "published",
    seo: {
      metaTitle: "JW Marriott Ranthambore — Natural Stone Project | Stoneza",
      metaDescription:
        "Castle Grey crazy paving and fieldstone supplied quarry-direct to JW Marriott Ranthambore.",
      keywords: ["JW Marriott", "Castle Grey", "crazy paving", "hospitality paving"],
    },
  },
  {
    title: "Ananta Spa & Resort",
    slug: "ananta-spa-resort",
    description:
      "Cobblestone driveway laid over two decades ago, still carrying vehicles daily and holding its sheen.",
    segment: "Hospitality",
    location: {
      city: "Pushkar",
      state: "Rajasthan",
      formatted: "Pushkar, Rajasthan",
    },
    application: ["Driveway", "Main Resort Drive"],
    stone: "Castle Grey Sandstone",
    products: ["Castle Grey CobbleCraft", "Cobblestones"],
    supply: "Quarry-direct bulk batch",
    bannerImage: {
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785326287/stoneza/homepage/hero/newslide2-ms616c0w.png",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Kaivalya Resort",
    slug: "kaivalya-resort",
    description:
      "Full material scheme across pool, driveway, pathways and elevation — specified zone by zone from the master plan.",
    segment: "Hospitality",
    location: {
      city: "Jaipur",
      state: "Rajasthan",
      formatted: "Rajasthan",
    },
    application: ["Pool deck", "Driveway", "Pathways", "Elevation"],
    stone: "Sukabumi, Silver Grey, Lava Black & Sandy Brown",
    products: ["Sukabumi", "Silver Grey", "Lava Black", "Sandy Brown"],
    supply: "Quarry-direct master plan scheme",
    bannerImage: {
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340177/stoneza/homepage/hero/newslide3-ms69fx6r.png",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Private villa — elevation & boundary",
    slug: "private-villa-elevation-boundary",
    description:
      "Fieldstone elevation with matching boundary wall, blended to a fixed ratio so a later extension still matches.",
    segment: "Residential",
    location: {
      city: "Jaipur",
      state: "Rajasthan",
      formatted: "Jaipur, Rajasthan",
    },
    application: ["Elevation", "Boundary wall"],
    stone: "Cosmic Rust Sandstone",
    products: ["Cosmic Rust Stonefield", "Fieldstone"],
    supply: "Pre-blended crates to fixed ratio",
    bannerImage: {
      url: "https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Resort landscape & water body",
    slug: "resort-landscape-water-body",
    description:
      "Pool coping, deck and a water feature wall in a single stone family, kept under 0.5% absorption throughout.",
    segment: "Landscape",
    location: {
      city: "Udaipur",
      state: "Rajasthan",
      formatted: "Udaipur, Rajasthan",
    },
    application: ["Pool coping", "Pool deck", "Water feature wall"],
    stone: "Lava Black & Silver Grey Sandstone",
    products: ["Lava Black Cascade", "Silver Grey coping"],
    supply: "Tested & certified < 0.5% absorption",
    bannerImage: {
      url: "https://stoneza.in/wp-content/uploads/2026/02/Landscaping-Outdoor-Living-Natural-Stone.webp",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Corporate campus facade",
    slug: "corporate-campus-facade",
    description:
      "Large-format facade slabs on a mechanical fixing system, spec-coded into the BOQ to survive the tender.",
    segment: "Commercial",
    location: {
      city: "Delhi",
      state: "Delhi NCR",
      formatted: "Delhi NCR",
    },
    application: ["Exterior facade", "Elevation cladding"],
    stone: "Castle Grey Sandstone",
    products: ["Castle Grey Facade Stone", "Facade Slabs"],
    supply: "BOQ spec-coded mechanical fixing",
    bannerImage: {
      url: "https://stoneza.in/wp-content/uploads/2026/02/Wall-Facade-Cladding-Natural-Stone.webp",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Township — phased delivery",
    slug: "township-phased-delivery",
    description:
      "Driveways and common-area paving delivered across three phases, batch-matched from the same beds.",
    segment: "Residential",
    location: {
      city: "Ahmedabad",
      state: "Gujarat",
      formatted: "Ahmedabad, Gujarat",
    },
    application: ["Driveways", "Common-area paving"],
    stone: "Sandy Brown Sandstone",
    products: ["Sandy Brown CobbleCraft", "Patio packs"],
    supply: "Phased delivery across 3 phases",
    bannerImage: {
      url: "https://stoneza.in/wp-content/uploads/2026/02/Flooring-Paving-Natural-Stone.webp",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Export programme — Gulf",
    slug: "export-programme-gulf",
    description:
      "Repeat container programme with export packing and documentation handled in-house at Bhilwara.",
    segment: "Export",
    location: {
      city: "Dubai",
      state: "UAE",
      formatted: "UAE",
    },
    application: ["Resort paving", "Villa paving"],
    stone: "Mixed sandstone & limestone",
    products: ["Mixed sandstone & limestone"],
    supply: "Export container programme",
    bannerImage: {
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
    },
    isFeatured: false,
    status: "published",
  },
  {
    title: "Boutique hotel courtyard",
    slug: "boutique-hotel-courtyard",
    description:
      "Courtyard flooring and carved jaali screens cut to the architect's drawing and numbered before dispatch.",
    segment: "Hospitality",
    location: {
      city: "Jaisalmer",
      state: "Rajasthan",
      formatted: "Jaisalmer, Rajasthan",
    },
    application: ["Courtyard flooring", "Carved jaali screens"],
    stone: "Asian Gold Sandstone",
    products: ["Asian Gold", "CNC Atelier jaali"],
    supply: "Number-coded custom architectural dispatch",
    bannerImage: {
      url: "https://stoneza.in/wp-content/uploads/2026/02/Patterns-Finishes-natural-stone.webp",
    },
    isFeatured: false,
    status: "published",
  },
];

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for projects seed...");

    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(seedProjects);
      console.log(`Successfully seeded ${seedProjects.length} initial projects.`);
    } else {
      console.log(`Database already has ${count} projects. Skipping seed.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding projects:", error);
    process.exit(1);
  }
}

runSeed();
