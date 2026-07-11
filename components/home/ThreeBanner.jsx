import Image from "next/image";
import Link from "next/link";

const staticBanners = [
  {
    image: "/assets/others/Below_Banner_1.jpg",
    title: "Photo Frames",
    link: "/products",
  },
  {
    image: "/assets/others/Below_Banner_2.jpg",
    title: "Decor Object",
    link: "/products",
  },
  {
    image: "/assets/others/Below_Banner_3.jpg",
    title: "Book Boxes",
    link: "/products",
  },
];

export default function ThreeBanner({ banners }) {
  const displayBanners = banners && banners.length > 0
    ? banners.map((b) => ({
        image: b.image?.url || "/assets/placeholder.jpg",
        title: b.title || "",
        link: b.buttonLink || "/products",
      }))
    : staticBanners;

  return (
    <div className="flex mt-12 lg:mt-0 flex-col md:flex-row">
      {displayBanners.map((item, index) => (
        <div
          key={index}
          className="group relative w-full h-[400px] md:h-[500px] md:flex-1 overflow-hidden"
        >
          <Image
            src={item.image}
            alt={item.title || "Stoneza Banner"}
            fill
            className="object-cover transition-transform duration-[4000ms] group-hover:scale-110"
            unoptimized={item.image.startsWith("http")}
          />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <Link href={item.link}>
              <button className="border border-white px-6 md:px-8 py-3 font-heading text-[11px] md:text-[12px] font-medium uppercase tracking-[0.3em] text-white whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition duration-300">
                {item.title}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}