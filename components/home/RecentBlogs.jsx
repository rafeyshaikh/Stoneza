import Image from "next/image";

export default function RecentBlogs() {
  return (  
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
  );
}
