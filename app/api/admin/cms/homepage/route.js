import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidateTag } from "next/cache";
import Homepage from "@/models/Homepage.model";
import cloudinary from "@/lib/cloudinary";

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
      threeBanners: [],
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

    // Update fields from the body
    if (body.heroSlides !== undefined) homepage.heroSlides = body.heroSlides;
    if (body.featuredProducts !== undefined) homepage.featuredProducts = body.featuredProducts;
    if (body.middleBanner !== undefined) homepage.middleBanner = body.middleBanner;
    if (body.newArrivalsTitle !== undefined) homepage.newArrivalsTitle = body.newArrivalsTitle;
    if (body.threeBanners !== undefined) homepage.threeBanners = body.threeBanners;
    if (body.brandPromos !== undefined) homepage.brandPromos = body.brandPromos;
    if (body.testimonials !== undefined) homepage.testimonials = body.testimonials;
    if (body.footer !== undefined) homepage.footer = body.footer;

    await homepage.save();

    // Revalidate the homepage cache
    revalidateTag("homepage-data");

    return response(true, 200, "Homepage CMS data updated successfully", homepage);
  } catch (error) {
    console.error("PATCH Homepage CMS error:", error);
    return response(false, 500, "Failed to update Homepage CMS data");
  }
}
