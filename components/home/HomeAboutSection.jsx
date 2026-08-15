import ImageWithLoader from "@/components/common/Loader";
import Link from "next/link";

export default function HomeAboutSection({ storyData, imageleft = false }) {
  const defaultParagraphs = [
    "At STONEZA, we've been part of this journey since the very beginning. As one of India's trusted natural stone suppliers and manufacturers in Rajasthan, we operate our own quarries and factories across Rajasthan to source nature's finest stones—ensuring authenticity, quality, and best prices at every step.",
    "Our story began in 1992 in Bhilwara, Rajasthan, as a family-run enterprise with a simple mission: to provide the finest natural stone flooring, wall tiles, and architectural stone solutions at competitive prices. Starting with sandstone extraction from Bijolia's renowned quarries, we have grown into a globally connected brand offering a diverse range of stones for flooring, cladding, landscaping, and design-led applications.",
    "Today, Stoneza is a preferred partner for architects, designers, builders, and wholesale buyers in Rajasthan seeking premium natural stone wall tiles, flooring solutions, and bespoke stone finishes—crafted responsibly and delivered with precision. Whether you're searching for \"stone suppliers near me in Rajasthan\" or looking for factory-direct pricing on natural stones, Stoneza is your trusted destination for quality, variety, and value.",
  ];

  const paragraphs = storyData?.paragraphs && storyData.paragraphs.length > 0
    ? storyData.paragraphs
    : defaultParagraphs;

  const imageUrl = storyData?.image?.url || "";

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid gap-18 lg:grid-cols-2 items-center">
          {/* LEFT TEXT COLUMN */}
          <div className={`space-y-6 ${imageleft ? "order-2" : ""}`}>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-[#393938]">
              About Us
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-[#4a453e] leading-relaxed font-body">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/pages/about-us">
                <button className="border border-[#5f554f] px-6 md:px-8 py-3 text-[13px] md:text-[14px] uppercase tracking-[1px] text-[#5f554f] cursor-pointer hover:bg-[#5f554f] hover:text-white transition duration-300 font-heading text-sm font-normal">
                  About Us
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE COLUMN */}
          <div className="relative aspect-[4/3] sm:aspect-[14/10] w-full overflow-hidden rounded-2xl shadow-md border border-stone-200 h-[35rem]">
            <ImageWithLoader
              src={imageUrl}
              alt="Stoneza About Us"
              fill
              className="object-cover"
              placeholderTitle="STONEZA ABOUT US"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
