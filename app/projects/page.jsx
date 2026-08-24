import ProjectsClientView from "@/components/projects/ProjectsClientView";
import Project from "@/models/Project.model";
import { connectDB } from "@/lib/databaseConnection";

import Seo from "@/models/Seo.model";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();

    const title = "Architectural Stone Projects & Portfolio";
    const description =
      "Natural stone supplied by Stoneza to luxury resorts, private villas, townships and institutional projects across India and internationally.";
    const canonicalUrl = "https://stoneza.in/projects";
    const ogImage =
      seo?.ogImage ||
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png";

    return {
      title,
      description,
      keywords:
        seo?.keywords ||
        "natural stone projects, luxury stone resort, stoneza projects, sandstone paving supply",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Stoneza",
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (err) {
    return {
      title: "Architectural Stone Projects & Portfolio",
      description:
        "Natural stone supplied by Stoneza to resorts, villas, townships and commercial projects across India and internationally.",
    };
  }
}

const fallbackProjects = [
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
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
      publicId: "jw-marriott-ranthambore",
    },
    images: [
      {
        url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
        caption: "Arrival Court & Main Entrance Paving",
      },
    ],
    isFeatured: true,
    status: "published",
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
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
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
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340268/stoneza/homepage/hero/newslide3-kw98hw7m.png",
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
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
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
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
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
      url: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
    },
    isFeatured: false,
    status: "published",
  },
];

export default async function PublicProjectsPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialSelectedSlug =
    resolvedParams?.project || resolvedParams?.slug || resolvedParams?.id || null;

  let projects = [];

  try {
    await connectDB();
    projects = await Project.find({ status: "published" })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();

    // Auto-seed if database has no projects yet
    if (!projects || projects.length === 0) {
      console.log("No projects found in DB. Auto-seeding initial projects...");
      await Project.insertMany(fallbackProjects);
      projects = await Project.find({ status: "published" })
        .sort({ isFeatured: -1, createdAt: -1 })
        .lean();
    }
  } catch (error) {
    console.error("PublicProjectsPage DB Error:", error.message);
    projects = fallbackProjects;
  }

  return (
    <ProjectsClientView
      initialProjects={JSON.parse(JSON.stringify(projects))}
      initialSelectedSlug={initialSelectedSlug}
    />
  );
}
