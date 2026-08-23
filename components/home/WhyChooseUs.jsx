import { whyChooseData } from "@/data/WhyChooseUs";

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 sm:py-28 lg:py-32 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
      {/* Section Header Title */}
      <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24">
        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl text-[#1C1714] font-normal leading-[1.15]">
          Why Choose Stoneza For Natural Stone in India
        </h2>
      </div>

      {/* Grid of Scaled Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 lg:gap-x-16 gap-y-16 lg:gap-y-24 items-start justify-items-center">
        {whyChooseData.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex flex-col items-center text-center w-full max-w-[380px] sm:max-w-[400px] px-3"
            >
              {/* Scaled Icon Container */}
              <div className="h-20 w-20 mb-6 flex items-center justify-center text-[#1C1714]">
                <Icon className="text-4xl sm:text-5xl" />
              </div>

              {/* Scaled Item Title with consistent height for uniform alignment */}
              <h3 className="font-heading font-bold text-[17px] sm:text-[19px] uppercase tracking-[2px] text-[#1C1714] mb-4 leading-snug min-h-[56px] flex items-center justify-center">
                {item.title}
              </h3>

              {/* Scaled Description */}
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.7] text-[#57504A]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

