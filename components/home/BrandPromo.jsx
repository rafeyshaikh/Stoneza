import Image from "next/image";
import Link from "next/link";

const staticPromos = [
  {
    image: "/assets/others/about_us.webp",
    title: "The Brand",
    caption: "What makes our products so covetable is the quality craftsmanship that goes in creating each piece.",
    buttonText: "Learn More",
    buttonLink: "/pages/about-us",
  },
  {
    image: "/assets/others/Art_of_Gifting.webp",
    title: "Art of Gifting",
    caption: "We create and curate the now of luxury with a keen eye that brings forth innovative design and a global style.",
    buttonText: "Learn More",
    buttonLink: "/pages/about-us",
  },
];

export default function BrandPromo({ promos }) {
  const displayPromos = promos && promos.length > 0
    ? promos.map((p) => ({
        image: p.image?.url || "/assets/placeholder.jpg",
        title: p.title || "",
        caption: p.caption || "",
        buttonText: p.buttonText || "Learn More",
        buttonLink: p.buttonLink || "/pages/about-us",
      }))
    : staticPromos;

  return (
    <div className="mt-10 flex flex-col gap-12 px-4 py-15 lg:flex-row lg:justify-center lg:gap-15">
      {displayPromos.map((item, index) => (
        <div key={index} className="w-full max-w-[650px] group">
          <div className="relative aspect-[700/440] w-full overflow-hidden">
            <Image
              src={item.image}
              alt={item.title || "Brand Promo"}
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              unoptimized={item.image.startsWith("http")}
            />
          </div>

          <div className="my-6 text-center">
            <h1 className="font-display text-[20px] md:text-[24px] uppercase tracking-[4px] md:tracking-[8px] text-[#393938]">
              {item.title}
            </h1>

            <p className="mx-auto my-6 max-w-[90%] md:max-w-[500px] text-[16px] md:text-[18px] text-[#1c1c1b] font-light min-h-[56px] leading-relaxed">
              {item.caption}
            </p>

            <Link href={item.buttonLink}>
              <button className="border border-[#5f554f] px-6 md:px-8 py-3 text-[13px] md:text-[14px] uppercase tracking-[1px] text-[#5f554f] cursor-pointer hover:bg-[#5f554f] hover:text-white transition duration-300">
                {item.buttonText}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
