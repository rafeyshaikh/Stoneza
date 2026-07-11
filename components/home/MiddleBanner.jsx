import Image from "next/image";
import Link from "next/link";

export default function MiddleBanner({
  src,
  alt = "Stoneza natural stone collection",
  title = "All Products",
  button = "View All Products",
  height = 600,
  link = "/products",
}) {
  return (
    <section
      className="relative min-h-[520px] w-full overflow-hidden md:min-h-0"
      style={{ "--banner-height": `${height}px` }}
      aria-label={`${title} collection`}
    >
      {/* Background image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-[1500ms] ease-out hover:scale-[1.02]"
      />

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

      {/* Slight bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1400px] items-center px-6 md:h-[var(--banner-height)] md:px-10 lg:px-16">
        <div className="max-w-2xl text-white">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[#c98b4b] md:w-12"/>

            <p className="font-heading text-[12px] uppercase tracking-[0.35em] text-white/90 md:text-sm">
              The Stoneza Collection
            </p>
          </div>

          {/* Heading */}
          <h2 className="font-display text-5xl font-light leading-[0.95] tracking-wide sm:text-6xl md:text-7xl lg:text-[82px]">
            {title}
          </h2>

          {/* Accent line */}
          <span className="mt-7 block h-[2px] w-14 bg-[#c98b4b]" />

          {/* Description */}
          <p className="mt-7 max-w-md font-display text-lg leading-relaxed text-white/90 md:text-xl">
            Natural stone. Timeless character.
            <br />
            Endless possibilities.
          </p>

          {/* CTA */}
          {button && (
            <Link
              href={link}
              className="group mt-9 inline-flex items-center border border-[#c98b4b] px-7 py-4 font-heading text-[10px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:bg-white hover:text-black md:px-9">
              <span
                aria-hidden="true"
                className="text-[14px] leading-none transition-transform duration-300 group-hover:translate-x-1"
              >
                View All Products →
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}