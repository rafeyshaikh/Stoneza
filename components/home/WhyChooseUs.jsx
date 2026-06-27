import { whyChooseData } from "@/data/WhyChooseUs";

export default function WhyChooseUs() {
  return (
    <section className="my-10">
      <h1 className="font-display text-[#393938] text-[24px] text-center mb-16">
        Why Choose Stoneza For Natural Stone in India
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 items-center justify-items-center">
        {whyChooseData.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="text-center">
              <Icon className="mx-auto text-5xl mb-6" />

              <h3 className="font-display text-[20px] text-[#393938] mb-4 leading-tight text-wrap w-80 mx-auto">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 leading-6 max-w-[320px] mx-auto text-xs">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}