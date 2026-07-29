import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidateTag, revalidatePath } from "next/cache";
import Homepage from "@/models/Homepage.model";
import cloudinary from "@/lib/cloudinary";

const defaultThreeBanners = [
  { title: "Photo Frames", image: { url: "/assets/others/Below_Banner_1.jpg", publicId: "" }, buttonLink: "/products" },
  { title: "Decor Object", image: { url: "/assets/others/Below_Banner_2.jpg", publicId: "" }, buttonLink: "/products" },
  { title: "Book Boxes", image: { url: "/assets/others/Below_Banner_3.jpg", publicId: "" }, buttonLink: "/products" },
];

async function getOrCreateHomepageDocument() {
  let homepage = await Homepage.findOne();

  if (!homepage) {
    homepage = await Homepage.create({
      heroSlides: [],
      featuredProducts: {
        title: "",
        caption: "",
        buttonText: "",
      },
      middleBanner: {
        title: "",
        eyebrow: "",
        caption: "",
        buttonText: "",
        buttonLink: "",
        image: { url: "", publicId: "" }
      },
      newArrivalsTitle: "What's New",
      threeBanners: defaultThreeBanners,
      brandPromos: [],
      testimonials: [],
      footer: {
        caption: "",
        copyright: "",
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
    });
  } else if (!homepage.threeBanners || homepage.threeBanners.length === 0) {
    homepage.threeBanners = defaultThreeBanners;
    homepage.markModified("threeBanners");
    await homepage.save();
  }

  return homepage;
}

export async function GET() {
  try {
    await connectDB();
    const homepage = await getOrCreateHomepageDocument();
    return response(true, 200, "Homepage CMS data fetched successfully", homepage);
  } catch (error) {
    console.error("GET Homepage CMS error:", error);
    return response(false, 500, "Failed to fetch Homepage CMS data");
  }
}

export async function PATCH(request) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const body = await request.json();
    let homepage = await getOrCreateHomepageDocument();

    // 1. Collect all public IDs in old document before updates
    const oldPublicIds = new Set();
    (homepage.heroSlides || []).forEach((slide) => {
      if (slide.image?.publicId) oldPublicIds.add(slide.image.publicId);
    });
    if (homepage.featuredProducts?.bannerImage?.publicId) {
      oldPublicIds.add(homepage.featuredProducts.bannerImage.publicId);
    }
    if (homepage.middleBanner?.image?.publicId) {
      oldPublicIds.add(homepage.middleBanner.image.publicId);
    }
    (homepage.threeBanners || []).forEach((banner) => {
      if (banner.image?.publicId) oldPublicIds.add(banner.image.publicId);
    });
    (homepage.brandPromos || []).forEach((promo) => {
      if (promo.image?.publicId) oldPublicIds.add(promo.image.publicId);
    });

    // 2. Collect all public IDs in updated/new data
    const newPublicIds = new Set();

    const updatedHero = body.heroSlides !== undefined ? body.heroSlides : homepage.heroSlides;
    (updatedHero || []).forEach((slide) => {
      if (slide.image?.publicId) newPublicIds.add(slide.image.publicId);
    });

    const updatedFeatured = body.featuredProducts !== undefined ? body.featuredProducts : homepage.featuredProducts;
    if (updatedFeatured?.bannerImage?.publicId) {
      newPublicIds.add(updatedFeatured.bannerImage.publicId);
    }

    const updatedMiddle = body.middleBanner !== undefined ? body.middleBanner : homepage.middleBanner;
    if (updatedMiddle?.image?.publicId) {
      newPublicIds.add(updatedMiddle.image.publicId);
    }

    const updatedThree = body.threeBanners !== undefined ? body.threeBanners : homepage.threeBanners;
    (updatedThree || []).forEach((banner) => {
      if (banner.image?.publicId) newPublicIds.add(banner.image.publicId);
    });

    const updatedPromos = body.brandPromos !== undefined ? body.brandPromos : homepage.brandPromos;
    (updatedPromos || []).forEach((promo) => {
      if (promo.image?.publicId) newPublicIds.add(promo.image.publicId);
    });

    // 3. Identify orphaned publicIds to delete from Cloudinary
    const idsToDelete = [...oldPublicIds].filter((id) => !newPublicIds.has(id));

    // 4. Perform Cloudinary deletions
    for (const publicId of idsToDelete) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Successfully deleted orphaned homepage image ${publicId} from Cloudinary`);
      } catch (err) {
        console.error(`Failed to delete orphaned image ${publicId} from Cloudinary:`, err);
      }
    }

    // Update fields from the body with explicit Mongoose markModified
    if (body.heroSlides !== undefined) {
      homepage.heroSlides = body.heroSlides;
      homepage.markModified("heroSlides");
    }
    if (body.featuredProducts !== undefined) {
      homepage.featuredProducts = body.featuredProducts;
      homepage.markModified("featuredProducts");
    }
    if (body.middleBanner !== undefined) {
      homepage.middleBanner = body.middleBanner;
      homepage.markModified("middleBanner");
    }
    if (body.newArrivalsTitle !== undefined) {
      homepage.newArrivalsTitle = body.newArrivalsTitle;
    }
    if (body.threeBanners !== undefined) {
      homepage.threeBanners = body.threeBanners;
      homepage.markModified("threeBanners");
    }
    if (body.brandPromos !== undefined) {
      homepage.brandPromos = body.brandPromos;
      homepage.markModified("brandPromos");
    }
    if (body.testimonials !== undefined) {
      homepage.testimonials = body.testimonials;
      homepage.markModified("testimonials");
    }
    if (body.footer !== undefined) {
      homepage.footer = body.footer;
      homepage.markModified("footer");
    }

    await homepage.save();

    // Revalidate the homepage cache both by tag and by path
    try {
      revalidateTag("homepage-data");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return response(true, 200, "Homepage CMS data updated successfully", homepage);
  } catch (error) {
    console.error("PATCH Homepage CMS error:", error);
    return response(false, 500, "Failed to update Homepage CMS data");
  }
}
