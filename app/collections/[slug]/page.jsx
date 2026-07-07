"use client";

import Image from "next/image";
import { useState, use, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import CollectionCTA from "@/components/common/CollectionCTA";
import BigBanner from "@/components/home/BigBanner";
import Carousel from "@/components/home/Carousel";

import { PiCaretDown } from "react-icons/pi";
import { BiSolidGrid, BiSolidGridAlt } from "react-icons/bi";

export default function CollectionPage({ params }) {
  const data = [
    {
      id: 1,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_1.webp",
      imageHover: "/assets/small_banners3/Small_Banner_1_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 2,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_2.webp",
      imageHover: "/assets/small_banners3/Small_Banner_2_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 3,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_3.webp",
      imageHover: "/assets/small_banners3/Small_Banner_3_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 4,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_4.webp",
      imageHover: "/assets/small_banners3/Small_Banner_4_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 5,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_5.webp",
      imageHover: "/assets/small_banners3/Small_Banner_5_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 6,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_6.webp",
      imageHover: "/assets/small_banners3/Small_Banner_6_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 7,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_7.webp",
      imageHover: "/assets/small_banners3/Small_Banner_7_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 8,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_8.webp",
      imageHover: "/assets/small_banners3/Small_Banner_8_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 9,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_9.webp",
      imageHover: "/assets/small_banners3/Small_Banner_9_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 10,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_1.webp",
      imageHover: "/assets/small_banners3/Small_Banner_1_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 11,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_2.webp",
      imageHover: "/assets/small_banners3/Small_Banner_2_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 12,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_3.webp",
      imageHover: "/assets/small_banners3/Small_Banner_3_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 13,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_4.webp",
      imageHover: "/assets/small_banners3/Small_Banner_4_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 14,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_5.webp",
      imageHover: "/assets/small_banners3/Small_Banner_5_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 15,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_6.webp",
      imageHover: "/assets/small_banners3/Small_Banner_6_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 16,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_7.webp",
      imageHover: "/assets/small_banners3/Small_Banner_7_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 17,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_8.webp",
      imageHover: "/assets/small_banners3/Small_Banner_8_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 18,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_3.webp",
      imageHover: "/assets/small_banners3/Small_Banner_4_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 19,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_1.webp",
      imageHover: "/assets/small_banners3/Small_Banner_1_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 20,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_3.webp",
      imageHover: "/assets/small_banners3/Small_Banner_4_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 21,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_1.webp",
      imageHover: "/assets/small_banners3/Small_Banner_1_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 22,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_3.webp",
      imageHover: "/assets/small_banners3/Small_Banner_4_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
    {
      id: 23,
      name: "Ruban Wall Ascent",
      price: 4999,
      image: "/assets/small_banners3/Small_Banner_1.webp",
      imageHover: "/assets/small_banners3/Small_Banner_1_hover.webp",
      soldOut: false,
      slug: "ruban-wall-ascent",
    },
    {
      id: 24,
      name: "Pillow",
      price: 6999,
      image: "/assets/small_banners3/Small_Banner_3.webp",
      imageHover: "/assets/small_banners3/Small_Banner_4_hover.webp",
      soldOut: false,
      slug: "pillow",
    },
  ];
  const subCategories=[
    {
      id:1,
      name:"Sculpture Fountains",
      image:"/assets/small_banners3/Small_Banner_9.webp",
      href:"/"
    },
    {
      id:2,
      name:"Stone Boulder",
      image:"/assets/small_banners3/Small_Banner_9.webp",
      href:"/"
    },
    {
      id:3,
      name:"Stone Lamps",
      image:"/assets/small_banners3/Small_Banner_9.webp",
      href:"/"
    },
    {
      id:4,
      name:"Stone Planters",
      image:"/assets/small_banners3/Small_Banner_9.webp",
      href:"/"
    },
    {
      id:5,
      name:"Stone Benches",
      image:"/assets/small_banners3/Small_Banner_9.webp",
      href:"/"
    },
    {
      id:6,
      name:"Stone Seating Sets",
      image:"/assets/small_banners3/Small_Banner_9.webp",
      href:"/"
    }
  ];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleViewAll = () => {
    if (categoryLevel !== "1" && categoryLevel !== "2") return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("categoryLevel", "3");

    router.push(`${pathname}?${params.toString()}`);
  };

  const [hoveredId, setHoveredId] = useState(null);
  const [gridSizeLarge, setGridSizeLarge] = useState(true);

  const { slug } = use(params);
  console.log("slug", slug);
  const { categoryLevel: categoryLevel } = searchParams.get("categoryLevel") ? { categoryLevel: searchParams.get("categoryLevel") } : { categoryLevel: "1" };
  const sliceLength = categoryLevel === "1" || categoryLevel === "2" ? 8 : data.length;

  useEffect(() => {}, [gridSizeLarge]);

  return (
    <div className="w-full">
      <BigBanner
        src="/assets/hero/collection-banner.webp"
        title={slug}
        alt={slug}
        button={null}
        height={575}
      />
      <div className="sticky top-[63px] lg:top-[106px] h-14 w-full border border-[#cbc9c4] bg-[#eae8e2] z-100 flex justify-between">
        <div className="border-r h-full w-35 border-[#cbc9c4] flex items-center justify-center gap-2">
          <BiSolidGridAlt
            className={` ${gridSizeLarge ? "opacity-50 text-[25px]" : "opacity-100 text-[26px]"} cursor-pointer`}
            onClick={() => setGridSizeLarge(false)}
          />
          <BiSolidGrid
            className={` ${gridSizeLarge ? "opacity-100 text-[26px]" : "opacity-50 text-[25px]"} cursor-pointer`}
            onClick={() => setGridSizeLarge(true)}
          />
        </div>
        <div className="h-full flex">
          <button className="h-full relative w-35 border-l border-[#cbc9c4] uppercase font-heading tracking-[2px] text-[12px] font-medium flex items-center justify-center gap-2">
            Sort
            <PiCaretDown className="text-2md" />
          </button>
          <button className="h-full relative w-35 border-l border-[#cbc9c4] uppercase font-heading tracking-[2px] text-[12px] font-medium">
            Filter
          </button>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridSizeLarge ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6 p-10 justify-items-center`}
      >
        {data.slice(0, sliceLength).map((item) => (
          <ProductItem
            key={item.id}
            item={item}
            setHoveredId={setHoveredId}
            hoveredId={hoveredId}
            slug={slug}
          />
        ))}
      </div>
      {categoryLevel === "1" || categoryLevel === "2" && (
        <div>
          <div className="flex justify-center items-center">
        <button className="mb-10 rounded-lg border border-[#cbc9c4] bg-[#eae8e2] px-6 py-3 uppercase font-heading tracking-[2px] text-[12px] font-medium cursor-pointer text-center flex justify-center items-center gap-2 hover:scale-[1.02] hover:border-black transition-all" onClick={handleViewAll}>
          View All
          <PiCaretDown className="text-2md" />
        </button>
      </div>
      <div className="col-span-full">
        <Carousel title="Sub Categories" data={subCategories} />
      </div>
      <BigBanner
        src="/assets/hero/Big_Banner_Ethereal_Forms.jpg"
        title={slug}
        alt={slug}
        button={null}
        height={800}
      />
      <CollectionCTA
        title="Ready to Elevate Your Living Space?"
        description="Discover premium stone surfaces, handcrafted décor, and timeless designs curated to bring elegance into every home."
        buttonText="EXPLORE COLLECTION"
        buttonLink="/collections"
      />
        </div>
      )}
    </div>
  );
}

function ProductItem({ item, setHoveredId, hoveredId, slug }) {
  const router = useRouter();
  return (
    <div key={item.id} className="w-full h-auto" onClick={() => {
      router.push(`/collections/${slug}/products/${item.slug}`);
    }}>
      <div className="flex flex-col items-center">
        <div
          className="group relative mb-5 w-full h-full aspect-square bg-[#F4F1EB]"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Image
            src={hoveredId === item.id ? item.imageHover : item.image}
            alt={item.name}
            fill
            className="h-full w-full object-contain"
          />

          {!item.soldOut && hoveredId === item.id && (
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center bg-white">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Add To Bag", item.id);
                }}
                className="w-full border-r border-black py-3 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer"
              >
                Add To Bag
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Buy Now", item.id);
                }}
                className="w-full py-3 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        <h3 className="text-center font-body text-[14px] text-[#393938]">
          {item.name}
        </h3>
        <p className="text-center font-body text-[14px] text-[#6a6a6a]">
          ₹{item.price}
        </p>
      </div>
    </div>
  );
}
