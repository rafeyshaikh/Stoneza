import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Product from "@/models/Product.model";
import Blog from "@/models/Blog.model";
import Homepage from "@/models/Homepage.model";
import Seo from "@/models/Seo.model";
import { connectDB } from "@/lib/databaseConnection";
import { getAboutData } from "@/lib/getAboutData";
import ThreeBanner from "@/components/home/ThreeBanner";
import Carousel from "@/components/home/Carousel";
import { whatsNewData } from "@/data/WhatsNewData";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Review from "@/components/home/Review";
import InstagramSection from "@/components/home/InstagramSection";
import EnquiryForm from "@/components/common/EnquiryForm";
import BrandPromo from "@/components/home/BrandPromo";
import RecentBlogs from "@/components/home/RecentBlogs";
import MiddleBanner from "@/components/home/MiddleBanner";
import HomeAboutSection from "@/components/home/HomeAboutSection";
import { getCategoriesForLayout } from "@/lib/getCategoriesForLayout";

export async function generateMetadata() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();
    return {
      title: seo?.metaTitle || "Stoneza - Natural Stone Showcase & Enquiry",
      description: seo?.metaDescription || "Elevate interiors and outdoor spaces with natural stone crafted for lasting strength, refined beauty, and enduring performance.",
      keywords: seo?.keywords || "natural stone, stoneza, marble, granite, flooring, wall cladding",
    };
  } catch (err) {
    return {
      title: "Stoneza - Natural Stone Showcase & Enquiry",
      description: "Elevate interiors and outdoor spaces with natural stone crafted for lasting strength, refined beauty, and enduring performance.",
      keywords: "natural stone, stoneza, marble, granite, flooring, wall cladding",
    };
  }
}

export default async function Home() {
  let categories = [];
  let safeHomepage = null;
  let safeAbout = null;
  let safeFeatured = [];
  let safeNewArrivals = [];
  let safeLatestBlogs = [];

  try {
    await connectDB();
    categories = await getCategoriesForLayout();

    const homepage = await Homepage.findOne().lean();
    safeHomepage = homepage ? JSON.parse(JSON.stringify(homepage)) : null;

    safeAbout = await getAboutData();

    const featured = await Product.find({ isFeatured: true, status: "published" })
      .select("name slug images hoverImage price")
      .lean();
    safeFeatured = featured ? JSON.parse(JSON.stringify(featured)) : [];

    const newArrivals = await Product.find({ isNewArrival: true, status: "published" })
      .select("name slug images hoverImage price")
      .lean();
    safeNewArrivals = newArrivals ? JSON.parse(JSON.stringify(newArrivals)) : [];

    const latestBlogs = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(2)
      .lean();
    safeLatestBlogs = latestBlogs ? JSON.parse(JSON.stringify(latestBlogs)) : [];
  } catch (err) {
    console.error("Home page DB error:", err.message);
  }

  const newArrivalsData = safeNewArrivals.length > 0
    ? safeNewArrivals.map((prod) => ({
        id: prod._id,
        title: prod.name,
        price: prod.price,
        image: prod.images?.[0]?.url || "",
        hoverImage: prod.hoverImage?.url || prod.images?.[0]?.url || "",
        href: `/products/${prod.slug}`,
      }))
    : whatsNewData;

  const mainCategoryData = categories.length > 0
    ? categories.map((cat, idx) => ({
        id: cat.slug || idx,
        title: cat.title,
        titleStyle: "font-body uppercase tracking-[2px]",
        image: cat.squareImage || "",
        href: `/categories/${cat.slug}`,
      }))
    : [];

  const subCategoryData = categories.reduce((acc, cat) => {
    if (Array.isArray(cat.categories)) {
      const mappedSubs = cat.categories.map((sub, idx) => ({
        id: sub.slug || `${cat.slug}-sub-${idx}`,
        title: sub.title,
        titleStyle: "font-body uppercase tracking-[2px]",
        image: sub.squareImage || "",
        href: `/categories/${sub.slug}`,
      }));
      acc.push(...mappedSubs);
    }
    return acc;
  }, []);

  return (
    <div>
      <HeroSection slides={safeHomepage?.heroSlides} />
      
      {mainCategoryData.length > 0 && (
      <Carousel title="Main Categories" data={mainCategoryData} itemsPerView={mainCategoryData.length} />
      )}
      <FeaturedProducts products={safeFeatured} cmsData={safeHomepage?.featuredProducts} />
      <HomeAboutSection storyData={safeAbout?.story} />
      <MiddleBanner
        src={safeHomepage?.middleBanner?.image?.url || "/assets/Banner/All_products_banner.png"}
        title={safeHomepage?.middleBanner?.title || "All Products"}
        eyebrow={safeHomepage?.middleBanner?.eyebrow || "The Stoneza Collection"}
        caption={safeHomepage?.middleBanner?.caption || "Natural stone. Timeless character. Endless possibilities."}
        button={safeHomepage?.middleBanner?.buttonText || "View All"}
        link={safeHomepage?.middleBanner?.buttonLink || "/products"}
      />
      <Carousel title={safeHomepage?.newArrivalsTitle || "What's New"} data={newArrivalsData} button={true} />
      <HomeAboutSection storyData={safeAbout?.story} imageleft={true} />
      <ThreeBanner banners={safeHomepage?.threeBanners} />
      {subCategoryData.length > 0 && (
        <Carousel title="Sub Categories" data={subCategoryData} />
      )}
      <EnquiryForm />
      <BrandPromo promos={safeHomepage?.brandPromos} />
      <WhyChooseUs />
      <Review reviews={safeHomepage?.testimonials} />
      <RecentBlogs blogs={safeLatestBlogs} />
      <InstagramSection />
    </div>
  );
}
