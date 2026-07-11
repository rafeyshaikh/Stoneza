import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidateTag } from "next/cache";
import Homepage from "@/models/Homepage.model";

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

    // Update fields from the body
    if (body.heroSlides !== undefined) homepage.heroSlides = body.heroSlides;
    if (body.featuredProducts !== undefined) homepage.featuredProducts = body.featuredProducts;
    if (body.middleBanner !== undefined) homepage.middleBanner = body.middleBanner;
    if (body.newArrivalsTitle !== undefined) homepage.newArrivalsTitle = body.newArrivalsTitle;
    if (body.threeBanners !== undefined) homepage.threeBanners = body.threeBanners;
    if (body.brandPromos !== undefined) homepage.brandPromos = body.brandPromos;
    if (body.testimonials !== undefined) homepage.testimonials = body.testimonials;
    if (body.footer !== undefined) homepage.footer = body.footer;
    if (body.seo !== undefined) homepage.seo = body.seo;

    await homepage.save();

    // Revalidate the homepage cache
    revalidateTag("homepage-data");

    return response(true, 200, "Homepage CMS data updated successfully", homepage);
  } catch (error) {
    console.error("PATCH Homepage CMS error:", error);
    return response(false, 500, "Failed to update Homepage CMS data");
  }
}
