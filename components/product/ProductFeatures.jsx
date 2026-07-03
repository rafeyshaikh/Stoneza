import {
  ShieldCheck,
  Hammer,
  Leaf,
  Mountain,
} from "lucide-react";

const icons = [
  Mountain,
  Hammer,
  ShieldCheck,
  Leaf,
];

export default function ProductFeatures({
  features,
}) {
  return (
    <section className="py-20 border-t border-[#ece8e3]">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm tracking-[3px] uppercase text-[#8c857d] mb-3">
            Why Choose This Product
          </p>

          <h2 className="font-display text-4xl text-[#2c2c2c]">
            Crafted To Last Generations
          </h2>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = icons[index];

            return (
              <div
                key={feature.title}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#f8f6f3] flex items-center justify-center">
                  <Icon
                    size={28}
                    className="text-[#665b54]"
                  />
                </div>

                <h3 className="text-lg font-medium mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-[#6f6f6f]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}