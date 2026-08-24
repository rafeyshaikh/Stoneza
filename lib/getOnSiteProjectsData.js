import { connectDB } from "./databaseConnection.js";
import Project from "@/models/Project.model.js";

export const DEFAULT_ON_SITE_PROJECTS = [
  {
    id: "jw-marriott-ranthambore",
    title: "JW Marriott Ranthambore",
    description:
      "Castle Grey crazy paving and Burgundy Bliss fieldstone across the arrival court and entrance.",
    tag: "HOSPITALITY",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
    href: "/projects?project=jw-marriott-ranthambore",
    slug: "jw-marriott-ranthambore",
  },
  {
    id: "ananta-pushkar",
    title: "Ananta, Pushkar",
    description:
      "A cobblestone driveway carrying vehicles for over twenty years, and it has only gained sheen.",
    tag: "RESORT",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785326287/stoneza/homepage/hero/newslide2-ms616c0w.png",
    href: "/projects?project=ananta-spa-resort",
    slug: "ananta-spa-resort",
  },
  {
    id: "villas-townships",
    title: "Villas & townships",
    description:
      "Elevations, boundary walls, driveways and pool decks, matched across phases years apart.",
    tag: "RESIDENTIAL",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
    href: "/projects?project=private-villa-elevation-boundary",
    slug: "private-villa-elevation-boundary",
  },
];

export async function getOnSiteProjectsData() {
  try {
    await connectDB();
    const dbProjects = await Project.find({ status: "published" })
      .sort({ isFeatured: -1, createdAt: 1 })
      .lean();

    if (!dbProjects || dbProjects.length === 0) {
      return DEFAULT_ON_SITE_PROJECTS;
    }

    // Map projects cleanly
    const formatted = dbProjects.map((p) => {
      let shortDesc = p.description || "";
      if (shortDesc.length > 130) {
        // Find sentence break
        const firstPeriod = shortDesc.indexOf(". ");
        if (firstPeriod > 30 && firstPeriod < 160) {
          shortDesc = shortDesc.substring(0, firstPeriod + 1);
        }
      }

      return {
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        description: shortDesc,
        fullDescription: p.description,
        tag: (p.segment || "PROJECT").toUpperCase(),
        segment: p.segment || "Project",
        location:
          p.location?.formatted ||
          [p.location?.city, p.location?.state].filter(Boolean).join(", ") ||
          "Rajasthan",
        stone: p.stone || "",
        products: Array.isArray(p.products) ? p.products : p.products ? [p.products] : [],
        supply: p.supply || "",
        image: p.bannerImage?.url || p.images?.[0]?.url || "",
        href: `/projects?project=${p.slug || p._id}`,
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error fetching on-site projects:", error);
    return DEFAULT_ON_SITE_PROJECTS;
  }
}
