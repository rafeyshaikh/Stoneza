import { connectDB } from "./databaseConnection.js";
import Blog from "@/models/Blog.model.js";

export const DEFAULT_JOURNAL_ARTICLES = [
  {
    id: "not-every-kota-stone-performs-the-same",
    title: "Not every Kota Stone performs the same",
    slug: "not-every-kota-stone-performs-the-same",
    tag: "SPECIFICATION",
    excerpt:
      "Consistent thickness, low water absorption and honest calibration — what separates a fifty-year floor from a five-year one.",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785326096/stoneza/homepage/hero/newslide1-ms6128lq.png",
    href: "/blogs/not-every-kota-stone-performs-the-same",
  },
  {
    id: "choosing-cobblestone-thickness-by-load",
    title: "Choosing cobblestone thickness by load",
    slug: "choosing-cobblestone-thickness-by-load",
    tag: "DETAILING",
    excerpt:
      "50–60 mm for cars, 80 mm for service vehicles. Under-specify it and the setts rock within a season.",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
    href: "/blogs/choosing-cobblestone-thickness-by-load",
  },
  {
    id: "which-sandstone-finish-for-which-surface",
    title: "Which sandstone finish for which surface",
    slug: "which-sandstone-finish-for-which-surface",
    tag: "FINISHES",
    excerpt:
      "Mirror belongs in a dry lobby, riverwash beside a pool. How wet grip should decide the finish, not the look.",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
    href: "/blogs/which-sandstone-finish-for-which-surface",
  },
];

export async function getJournalArticlesData(limit = 3) {
  try {
    await connectDB();
    const dbBlogs = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit || 3)
      .lean();

    if (!dbBlogs || dbBlogs.length === 0) {
      return DEFAULT_JOURNAL_ARTICLES;
    }

    const mapped = dbBlogs.map((b, idx) => {
      const fallback = DEFAULT_JOURNAL_ARTICLES[idx] || DEFAULT_JOURNAL_ARTICLES[0];
      const tag =
        (Array.isArray(b.tags) && b.tags[0]) ||
        b.tag ||
        fallback.tag ||
        "JOURNAL";

      return {
        id: b._id.toString(),
        title: b.title || fallback.title,
        slug: b.slug || fallback.slug,
        tag: tag.toUpperCase(),
        excerpt: b.excerpt || fallback.excerpt,
        image: b.bannerImage?.url || fallback.image,
        href: `/blogs/${b.slug || fallback.slug}`,
      };
    });

    // If fewer than 3 in DB, fill with curated defaults
    if (mapped.length < 3) {
      for (let i = mapped.length; i < 3; i++) {
        mapped.push(DEFAULT_JOURNAL_ARTICLES[i]);
      }
    }

    return mapped;
  } catch (error) {
    console.error("Error fetching journal articles:", error);
    return DEFAULT_JOURNAL_ARTICLES;
  }
}
