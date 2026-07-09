import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import Container from "@/components/common/Container";
import { shopGiftStyleData } from "@/data/ShopGiftStyleData";
import { collectionData } from "@/data/CollectionHomeData";
import FeaturedProducts from "@/components/home/FeaturedProducts";
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

import { getCategoriesForLayout } from "@/lib/getCategoriesForLayout";

export default async function Home() {
  const categories = await getCategoriesForLayout();

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
      <HeroSection />
      {mainCategoryData.length > 0 && (
        <Carousel title="Main Categories" data={mainCategoryData} itemsPerView={mainCategoryData.length} />
      )}
      <FeaturedProducts />
      <BigBanner src={"/assets/hero/Big_Banner_Ethereal_Forms.jpg"} alt={"Ethereal"} title={"Onde Éternelle"} button={"Home Decor"} height={800} />
      <Carousel title={"What's New"} data={whatsNewData} />
      <ThreeBanner />
      {subCategoryData.length > 0 && (
        <Carousel title="Sub Categories" data={subCategoryData}  />
      )}
      <EnquiryForm />
      {/* <ShopTheLook /> */}
      <BrandPromo />
      <WhyChooseUs />
      <Review />
      <RecentBlogs />
      <InstagramSection />
    </div>
  );
}
