import Image from "next/image";
import Link from "next/link";

export default function BrandPromo() {
  return (
    <div className="mt-10 flex flex-col gap-12 px-4 py-15 lg:flex-row lg:justify-center lg:gap-15">
      <Link href="/pages/about-us" className="w-full max-w-[650px]">
        <div>
          <Image
            src="/assets/others/about_us.webp"
            alt="About Us"
            height={440}
            width={700}
            className="h-auto w-full object-cover"
          />

          <div className="my-6 text-center">
            <h1 className="font-display text-[20px] md:text-[24px] uppercase tracking-[4px] md:tracking-[8px] text-[#393938]">
              The Brand
            </h1>

            <p className="mx-auto my-6 max-w-[90%] md:max-w-[480px] text-[16px] md:text-[18px] text-[#1c1c1b]">
              What makes our products so covetable is the quality craftsmanship
              that goes in creating each piece.
            </p>

            <button className="border border-[#5f554f] px-6 md:px-8 py-3 text-[13px] md:text-[14px] uppercase tracking-[1px] text-[#5f554f] cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </Link>

      <div className="w-full max-w-[650px]">
        <Image
          src="/assets/others/Art_of_Gifting.webp"
          alt="Art Of Gifting"
          height={440}
          width={700}
          className="h-auto w-full object-cover"
        />

        <div className="my-6 text-center">
          <h1 className="font-display text-[20px] md:text-[24px] uppercase tracking-[4px] md:tracking-[8px] text-[#393938]">
            Art of Gifting
          </h1>

          <p className="mx-auto my-6 max-w-[90%] md:max-w-[520px] text-[16px] md:text-[18px] text-[#1c1c1b]">
            We create and curate the now of luxury with a keen eye that brings
            forth innovative design and a global style.
          </p>

          <button className="border border-[#5f554f] px-6 md:px-8 py-3 text-[13px] md:text-[14px] uppercase tracking-[1px] text-[#5f554f] cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
