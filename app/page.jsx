import react from "react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import Container from "@/components/common/Container";
import { shopGiftStyleData } from "@/data/ShopGiftStyleData";
import { collectionData } from "@/data/CollectionHomeData";
import LargeShop from "@/components/home/LargeShop";
import BigBanner from "@/components/home/BigBanner";
import ThreeBanner from "@/components/home/ThreeBanner";
import Carousel from "@/components/home/Carousel";
import { whatsNewData } from "@/data/WhatsNewData";
import ShopTheLook from "@/components/home/ShopTheLook";
import Image from "next/image";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Review from "@/components/home/Review";
import InstagramSection from "@/components/home/InstagramSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Carousel title="SHOP. GIFT. STYLE." data={shopGiftStyleData} />
      <LargeShop />
      <BigBanner />
      <Carousel title={"What's New"} data={whatsNewData} />
      <ThreeBanner />
      <Carousel title={"COLLECTIONS"} data={collectionData} />
      <ShopTheLook />
      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:justify-center lg:gap-15">
        <div className="relative w-full max-w-[650px]">
          <Image
            src="/assets/others/about_us.webp"
            alt="About Us"
            height={440}
            width={700}
            className="object-cover"
          />
          <div className="text-center my-6">
            <h1 className="uppercase font-display tracking-[8px] text-[24px] text-[#393938] ">
              The Brand
            </h1>
            <p className="text-[#1c1c1b] w-120 mx-auto text-[18px] my-6">
              What makes our products so covetable is the quality craftsmanship
              that goes in creating each piece.
            </p>
            <button className="text-[#5f554f] text-[14px] uppercase font-heading tracking-[1px] py-3 px-8 cursor-pointer border border-[#5f554f] ">
              Learn More
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-[650px]">
          <Image
            src="/assets/others/Art_of_Gifting.webp"
            alt="Art Of Gifting"
            height={440}
            width={700}
            className="object-cover"
          />
          <div className="text-center my-6">
            <h1 className="uppercase font-display tracking-[8px] text-[24px] text-[#393938] ">
              Art of Gifting
            </h1>
            <p className="text-[#1c1c1b] w-130 mx-auto text-[18px] my-6">
              We create and curate the now of luxury with a keen eye that brings
              forth innovative design and a global style.
            </p>
            <button className="text-[#5f554f] text-[14px] uppercase font-heading tracking-[1px] py-3 px-8 cursor-pointer border border-[#5f554f] ">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <WhyChooseUs />
      <Review />
      <div className="my-14 md:my-20 px-4">
        <h1 className="font-display text-center text-[22px] md:text-[28px] text-[#393938] tracking-[2px] md:tracking-[4px]">
          THE LUXE AND THE LURE
        </h1>

        <div className="mx-auto mt-10 md:mt-14 max-w-[1360px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-16">
          {/* Card 1 */}
          <div>
            <div className="group overflow-hidden">
              <Image
                src="/assets/others/last_banner_1.webp"
                alt="The Luxe and The Lure"
                width={650}
                height={380}
                className="w-full h-auto object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
            </div>

            <h2 className="mt-5 md:mt-6 font-display text-[16px] md:text-[18px] uppercase leading-[1.4] text-[#393938] text-center lg:text-left">
              Beyond Barware Set Glassware: Designing Evenings, Not Just Drinks
            </h2>

            <div className="flex justify-center lg:justify-start">
              <button className="mt-5 md:mt-6 border border-black px-6 md:px-8 py-3 text-[12px] md:text-[14px] tracking-[2px] md:tracking-[3px] text-[#5F554F] uppercase cursor-pointer transition">
                Read More
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div>
            <div className="group overflow-hidden">
              <Image
                src="/assets/others/last_banner_2.webp"
                alt="The Luxe and The Lure"
                width={650}
                height={380}
                className="w-full h-auto object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
            </div>

            <h2 className="mt-5 md:mt-6 font-display text-[16px] md:text-[18px] uppercase leading-[1.4] text-[#393938] text-center lg:text-left">
              Ceramic Flower Vase Do&apos;s And Don&apos;ts That Keep A Room
              From Feeling Overstyled
            </h2>

            <div className="flex justify-center lg:justify-start">
              <button className="mt-5 md:mt-6 border border-black px-6 md:px-8 py-3 text-[12px] md:text-[14px] tracking-[2px] md:tracking-[3px] text-[#5F554F] uppercase cursor-pointer transition">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
      <InstagramSection />
    </div>
  );
}
