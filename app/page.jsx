import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import Container from "@/components/common/Container";
import { shopGiftStyleData } from "@/data/ShopGiftStyleData";
import { collectionData } from "@/data/CollectionHomeData";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Product from "@/models/Product.model";
import Blog from "@/models/Blog.model";
import Homepage from "@/models/Homepage.model";
import Seo from "@/models/Seo.model";
import { connectDB } from "@/lib/databaseConnection";
import BigBanner from "@/components/home/BigBanner";
import ThreeBanner from "@/components/home/ThreeBanner";
import Carousel from "@/components/home/Carousel";
import { whatsNewData } from "@/data/WhatsNewData";
import ShopTheLook from "@/components/home/ShopTheLook";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Review from "@/components/home/Review";
import InstagramSection from "@/components/home/InstagramSection";
import EnquiryForm from "@/components/common/EnquiryForm";
import BrandPromo from "@/components/home/BrandPromo";
import RecentBlogs from "@/components/home/RecentBlogs";
import MiddleBanner from "@/components/home/MiddleBanner";

import { getCategoriesForLayout } from "@/lib/getCategoriesForLayout";

export async function generateMetadata() {
  await connectDB();
  const seo = await Seo.findOne().lean();
  return {
    title: seo?.metaTitle || "Stoneza - Natural Stone Showcase & Enquiry",
    description: seo?.metaDescription || "Elevate interiors and outdoor spaces with natural stone crafted for lasting strength, refined beauty, and enduring performance.",
    keywords: seo?.keywords || "natural stone, stoneza, marble, granite, flooring, wall cladding",
  };
}

export default async function Home() {
  await connectDB();
  const categories = await getCategoriesForLayout();

  const homepage = await Homepage.findOne().lean();
  const safeHomepage = homepage ? JSON.parse(JSON.stringify(homepage)) : null;

  const featured = await Product.find({ isFeatured: true, status: "published" })
    .select("name slug images hoverImage price")
    .lean();
  const safeFeatured = JSON.parse(JSON.stringify(featured));

  const newArrivals = await Product.find({ isNewArrival: true, status: "published" })
    .select("name slug images hoverImage price")
    .lean();
  const safeNewArrivals = JSON.parse(JSON.stringify(newArrivals));

  const latestBlogs = await Blog.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(2)
    .lean();
  const safeLatestBlogs = JSON.parse(JSON.stringify(latestBlogs));

  const newArrivalsData = safeNewArrivals.length > 0
    ? safeNewArrivals.map((prod) => ({
        id: prod._id,
        title: prod.name,
        price: prod.price,
        image: prod.images?.[0]?.url || "/assets/placeholder.jpg",
        hoverImage: prod.hoverImage?.url || prod.images?.[0]?.url || "/assets/placeholder.jpg",
        href: `/products/${prod.slug}`,
      }))
    : whatsNewData;

  const mainCategoryData = categories.length > 0
    ? categories.map((cat, idx) => ({
        id: cat.slug || idx,
        title: cat.title,
        titleStyle: "font-body uppercase tracking-[2px]",
        image: cat.squareImage || "/assets/placeholder.jpg",
        href: `/collections/${cat.slug}`,
      }))
    : [];

  const subCategoryData = categories.reduce((acc, cat) => {
    if (Array.isArray(cat.categories)) {
      const mappedSubs = cat.categories.map((sub, idx) => ({
        id: sub.slug || `${cat.slug}-sub-${idx}`,
        title: sub.title,
        titleStyle: "font-body uppercase tracking-[2px]",
        image: sub.squareImage || "/assets/placeholder.jpg",
        href: `/collections/${sub.slug}`,
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
      <MiddleBanner
        src={safeHomepage?.middleBanner?.image?.url || "/assets/hero/All-Products-Banner.png"}
        title={safeHomepage?.middleBanner?.title || "All Products"}
        eyebrow={safeHomepage?.middleBanner?.eyebrow || "The Stoneza Collection"}
        caption={safeHomepage?.middleBanner?.caption || "Natural stone. Timeless character. Endless possibilities."}
        button={safeHomepage?.middleBanner?.buttonText || "View All"}
        link={safeHomepage?.middleBanner?.buttonLink || "/products"}
      />
      <Carousel title={safeHomepage?.newArrivalsTitle || "What's New"} data={newArrivalsData} button={true} />
      <ThreeBanner banners={safeHomepage?.threeBanners} />
      {subCategoryData.length > 0 && (
        <Carousel title="Sub Categories" data={subCategoryData}  />
      )}
      <EnquiryForm />
      {/* <ShopTheLook /> */}
      <BrandPromo promos={safeHomepage?.brandPromos} />
      <WhyChooseUs />
      <Review reviews={safeHomepage?.testimonials} />
      <RecentBlogs blogs={safeLatestBlogs} />
      <InstagramSection />
    </div>
  );
}
