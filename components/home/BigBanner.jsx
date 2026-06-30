import Image from "next/image";

export default function BigBanner({src,alt,title,button,height}) {
  return (
    <div className="relative w-full overflow-hidden"
    style={{ height: `${height}px` }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute left-4 md:left-9 bottom-8 md:bottom-18 z-10 px-6 text-white">
        <h1 className="font-display text-3xl md:text-[52px] font-light tracking-wide capitalize">
          {title}
        </h1>

        {button&& (<button className="mt-6 border border-white px-6 md:px-8 py-3 font-heading text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:bg-white hover:text-black">
          {button}
        </button>)}
      </div>
    </div>
  );
}