import react from 'react';
import {Button} from '@/components/ui/button';
import HeroSection from '@/components/home/HeroSection';
import Container from "@/components/common/Container";
import Carausel from '@/components/home/Carausel';
import { shopGiftStyleData } from "@/data/ShopGiftStyleData";
import { collectionData } from "@/data/CollectionHomeData";
import LargeShop from '@/components/home/LargeShop';
import BigBanner from '@/components/home/BigBanner';
import ThreeBanner from '@/components/home/ThreeBanner';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Carausel title="SHOP. GIFT. STYLE." data={shopGiftStyleData} />
      <LargeShop />
      <BigBanner />
      <ThreeBanner />
      <Carausel title="COLLECTIONS" data={collectionData} />
    </div>
  );
}