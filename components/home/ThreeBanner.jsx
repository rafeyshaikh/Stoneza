import Image from "next/image";

const banners = [
  {
    image: "/assets/others/Below_Banner_1.jpg",
    title: "Photo Frames",
  },
  {
    image: "/assets/others/Below_Banner_2.jpg",
    title: "Decor Object",
  },
  {
    image: "/assets/others/Below_Banner_3.jpg",
    title: "Book Boxes",
  },
];

export default function ThreeBanner() {
  return (
    <div className="mt-20 flex flex-col md:flex-row">
      {banners.map((item) => (
        <div
          key={item.title}
          className="group relative w-full h-[400px] md:h-[500px] md:flex-1 overflow-hidden"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-[4000ms] group-hover:scale-110"
          />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <button className="border border-white px-6 md:px-8 py-3 font-heading text-[11px] md:text-[12px] font-medium uppercase tracking-[0.3em] text-white whitespace-nowrap">
              {item.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}