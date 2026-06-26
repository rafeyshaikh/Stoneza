import react from 'react';
import {Button} from '@/components/ui/button';
import HeroSection from '@/components/home/HeroSection';
import Container from "@/components/common/Container";
import { shopGiftStyleData } from "@/data/ShopGiftStyleData";
import { collectionData } from "@/data/CollectionHomeData";
import LargeShop from '@/components/home/LargeShop';
import BigBanner from '@/components/home/BigBanner';
import ThreeBanner from '@/components/home/ThreeBanner';
import Carousel from '@/components/home/Carousel';
import { whatsNewData } from "@/data/WhatsNewData";

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
    </div>
  );
}