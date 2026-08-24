import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getAboutData } from "@/lib/getAboutData";

export async function generateMetadata() {
  const data = await getAboutData();
  const title =
    data?.seo?.metaTitle?.trim() ||
    (data?.hero?.title
      ? `${data.hero.title} | Stoneza Natural Stone`
      : "About Stoneza | 34+ Years of Natural Stone Quarries & Processing in Rajasthan");

  const description =
    data?.seo?.metaDescription?.trim() ||
    (data?.story?.lead
      ? data.story.lead
      : "Discover Stoneza's legacy since 1992. Three generations of quarrying Bijolia sandstone, Kota stone & Asind granite with in-house processing factories in Bhilwara, Rajasthan.");

  const heroImageUrl =
    data?.seo?.ogImage?.trim() ||
    data?.hero?.image?.url ||
    "https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp";

  const canonicalUrl =
    data?.seo?.canonicalUrl?.trim() ||
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/pages/about-us`;

  const keywords =
    data?.seo?.keywords?.trim() ||
    [
      "Stoneza about us",
      "Bijolia sandstone quarry",
      "Kota stone manufacturer",
      "Asind granite supplier",
      "natural stone suppliers Rajasthan",
      "Bhilwara stone factory",
      "Kanishk Ostwal",
      "Devanshi Jain",
      "natural stone cladding",
      "architectural stone solutions",
    ].join(", ");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Stoneza",
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImageUrl],
    },
  };
}

export default async function AboutUsPage() {
  const data = await getAboutData();

  const hero = data?.hero || {
    eyebrow: "Our Story · Since 1992",
    title: "Three generations. One love affair with stone.",
    image: { url: "https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp" },
  };

  const story = data?.story || {
    eyebrow: "Where It Began",
    lead: "In 1992, in Bhilwara, Rajasthan, our family stepped into the sandstone belts of Bijolia — not as traders looking for a margin, but as people who wanted to stand at the source.",
    paragraphs: [
      "What began as a single family enterprise quarrying Bijolia's legendary sandstone grew, decade by decade, into something rare in the Indian stone industry: a house that owns quarries in Bijolia, Kota and Asind and processes every order through its own factories in Bhilwara.",
      "But three decades at the source taught us something else too. India's finest stones are scattered across the country — a perfect basalt here, a flawless limestone there — and no single company owns them all. Anyone who claims otherwise is selling you a story. So we built the next best thing to ownership: decades-old, direct relationships with the finest quarries in India, with no anonymous trading chain in between.",
      "Today, our own mountains supply our signature stones, and our curation network supplies the rest — and every single lot, owned or sourced, passes through the same Stoneza factories, the same grading, the same standard. That is the promise behind every crate that leaves our yard: ownership where it matters, accountability everywhere.",
    ],
    eras: [
      { year: "1992", title: "The first quarry", description: "A family enterprise begins in Bhilwara, quarrying the renowned sandstone belts of Bijolia." },
      { year: "2000s–2010s", title: "The house grows", description: "Owned quarries grow to Kota and Asind. In-house processing factories rise in Bhilwara." },
      { year: "Today", title: "Owners & curators", description: "40+ signature stones. 1000+ architects served. Specified at landmark hospitality properties, delivered across India and exported to four continents." },
    ],
  };

  const stats = data?.stats || [
    { number: "34", label: "Years in stone" },
    { number: "3", label: "Owned quarries" },
    { number: "40+", label: "Signature stones" },
    { number: "1000+", label: "Architects & designers" },
  ];

  const founders = data?.founders || {
    eyebrow: "From The Founders",
    image: { url: "/assets/others/Below_Banner_1.jpg" },
    people: [
      {
        name: "Kanishk Ostwal",
        role: "Founder",
        quotes: [
          '"My journey with Stoneza is driven by one commitment — to make natural stone reliable, consistent, and accessible across India."',
          '"From sourcing at quarries to quality checks and logistics, my role is to ensure every order is delivered with honesty and precision. Your trust motivates us to keep raising the benchmark for quality and service."',
        ],
      },
      {
        name: "Devanshi Jain",
        role: "Co-Founder",
        quotes: [
          '"At Stoneza, my focus has always been on design, detail, and the emotion that a material brings into a space."',
          '"India has such incredible natural stone, and my mission is to curate it in a way that feels modern, premium, and effortless for architects and homeowners."',
        ],
      },
    ],
  };

  const howWeWork = data?.howWeWork || {
    eyebrow: "How We Work",
    title: "From enquiry to installed. One accountable system.",
    steps: [
      { number: "01", title: "Enquiry & consultation", description: "One dedicated consultant understands your project — application, palette, timeline and budget." },
      { number: "02", title: "Samples & specification", description: "Physical samples in 48 hours, mockup panels on request, spec sheets for the drawing board." },
      { number: "03", title: "Production & QC", description: "Cut to your drawings, calibrated for level laying, and matched wet & dry — lot after lot." },
      { number: "04", title: "Insured delivery", description: "Container-grade crating and insured transit with live order tracking to your site gate." },
    ],
  };

  const showroom = data?.showroom || {
    eyebrow: "The Experience Centre",
    title: "Pictures look good. In person, stone hits different.",
    description: "Walk the Stoneza experience centre in Bhilwara — real textures under real light, from CNC-carved feature walls to full-format flooring and cladding. Every material, waiting to be touched.",
    buttonText: "PLAN YOUR VISIT →",
    buttonLink: "/pages/contact",
  };

  const manifesto = data?.manifesto || {
    quote: "Paint har saal purana hota hai. Natural stone har saal behtar.",
    sub: "The Stoneza Belief · Since 1992",
  };

  const cta = data?.cta || {
    eyebrow: "Start Your Project",
    title: "Now you know our story. Tell us yours.",
    description: "Share what you're building, and a Stoneza consultant responds with factory-direct pricing, honest lead times and samples on their way — usually the same day.",
    buttonText: "START YOUR PROJECT →",
    buttonLink: "/#quote",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stoneza",
    url: "https://stoneza.in",
    logo: "https://stoneza.in/assets/logo.png",
    description: "Owners of quarries in Bijolia, Kota & Asind with in-house processing factories in Bhilwara, Rajasthan.",
    foundingDate: "1992",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bhilwara",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
    },
    founder: (founders?.people || []).map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.role,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://stoneza.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: "https://stoneza.in/pages/about-us",
      },
    ],
  };

  return (
    <div className="bg-[#faf8f5] text-[#2a2118] font-body antialiased">
      <Script
        id="about-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="about-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. HERO SECTION */}
      <section className="relative h-[72vh] min-h-[520px] text-white flex items-end overflow-hidden">
        <Image
          src={hero.image?.url || "https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp"}
          alt={hero.title}
          fill
          priority
          className="object-cover"
          unoptimized={Boolean(hero.image?.url && hero.image.url.startsWith("http"))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/95 via-[#1c1917]/40 to-[#1c1917]/30" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 w-full pb-16">
          <div className="flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[4px] text-[#c9a877]">
            <span className="w-[34px] h-[1px] bg-[#c9a877]" />
            {hero.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-[38px] sm:text-[54px] lg:text-[66px] font-normal leading-[1.12] text-white max-w-[17ch]">
            {(() => {
              const text = hero.title || "";
              const lastSpaceIndex = text.lastIndexOf(" ");
              if (lastSpaceIndex === -1) {
                return <span>{text}</span>;
              }
              return (
                <>
                  {text.slice(0, lastSpaceIndex)}{" "}
                  <em className="font-display italic text-[#c9a877]">
                    {text.slice(lastSpaceIndex)}
                  </em>
                </>
              );
            })()}
          </h1>
        </div>
      </section>

      {/* 2. THE STORY */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[840px] mx-auto px-6">
          <div className="flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[4px] text-[#8c8275] mb-7">
            <span className="w-[34px] h-[1px] bg-[#c9a877]" />
            {story.eyebrow}
          </div>

          <p className="font-display text-[22px] sm:text-[28px] text-[#2a2118] leading-[1.45] mb-8 font-normal">
            {story.lead}
          </p>

          <div className="space-y-6 text-[16px] text-[#5a5550] leading-relaxed font-body">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Era Timeline */}
          {story.eras && story.eras.length > 0 && (
            <div className="mt-14 grid gap-px bg-[#e5e2dc] border border-[#e5e2dc] md:grid-cols-3 rounded-lg overflow-hidden">
              {story.eras.map((era, idx) => (
                <div key={idx} className="bg-white p-7">
                  <span className="font-display text-2xl font-normal text-[#c9a877] block mb-3">
                    {era.year}
                  </span>
                  <h3 className="font-heading text-base font-semibold uppercase tracking-wider text-[#2a2118] mb-2">
                    {era.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6f6f6f] leading-relaxed font-body">
                    {era.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. STATS STRIP */}
      <section className="bg-white py-14 border-y border-[#e5e2dc]">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-display text-[34px] sm:text-[42px] font-normal text-[#2a2118] block">
                {stat.number}
              </span>
              <span className="font-heading text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8c8275]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FROM THE FOUNDERS */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-sm">
                <Image
                  src={founders.image?.url || "/assets/others/Below_Banner_1.jpg"}
                  alt="Founders of Stoneza"
                  fill
                  className="object-cover object-center"
                  unoptimized={Boolean(founders.image?.url && founders.image.url.startsWith("http"))}
                />
              </div>
              <div className="absolute -inset-3.5 border border-[#c9a877] pointer-events-none hidden sm:block rounded-lg" />
            </div>

            <div>
              <div className="flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[4px] text-[#8c8275] mb-8">
                <span className="w-[34px] h-[1px] bg-[#c9a877]" />
                {founders.eyebrow}
              </div>

              <div className="space-y-10">
                {founders.people?.map((person, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-display text-2xl font-normal text-[#2a2118]">
                      {person.name}
                    </h3>
                    <span className="inline-block font-heading text-[11px] font-bold tracking-[0.22em] uppercase text-[#c9a877] mb-3">
                      {person.role}
                    </span>
                    <blockquote className="border-l-2 border-[#c9a877] pl-5 space-y-3 text-[15.5px] text-[#5a5550] italic font-body">
                      {person.quotes?.map((q, qIdx) => (
                        <p key={qIdx}>{q}</p>
                      ))}
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW WE WORK */}
      <section className="bg-white py-20 lg:py-28 border-t border-[#e5e2dc]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[4px] text-[#8c8275] mb-3">
            <span className="w-[34px] h-[1px] bg-[#c9a877]" />
            {howWeWork.eyebrow}
          </div>

          <h2 className="font-display text-[28px] sm:text-[40px] text-[#2a2118] font-normal max-w-[24ch] leading-tight mb-12">
            {howWeWork.title}
          </h2>

          <div className="grid gap-px bg-[#e5e2dc] border border-[#e5e2dc] sm:grid-cols-2 lg:grid-cols-4 rounded-lg overflow-hidden">
            {howWeWork.steps?.map((step, idx) => (
              <div key={idx} className="bg-white p-7 space-y-3">
                <span className="font-display text-base font-normal tracking-[0.18em] text-[#c9a877] block">
                  {step.number}
                </span>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#2a2118]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6f6f6f] leading-relaxed font-body">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SHOWROOM */}
      <section className="bg-[#2a2118] text-white py-20">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[4px] text-[#c9a877]">
              <span className="w-[34px] h-[1px] bg-[#c9a877]" />
              {showroom.eyebrow}
            </div>
            <h2 className="font-display text-[28px] sm:text-[38px] font-normal text-white leading-tight">
              {showroom.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-body">
              {showroom.description}
            </p>
          </div>

          <Link
            href={showroom.buttonLink || "/pages/contact"}
            className="inline-flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[0.25em] px-8 py-4 bg-[#c9a877] text-[#1c1917] hover:bg-[#b8965a] transition cursor-pointer shrink-0 shadow-sm"
          >
            {showroom.buttonText}
          </Link>
        </div>
      </section>

      {/* 7. MANIFESTO */}
      <section className="py-24 text-center bg-[#faf8f5]">
        <div className="max-w-[820px] mx-auto px-6 space-y-4">
          <p className="font-display italic text-[26px] sm:text-[42px] text-[#2a2118] leading-tight max-w-[22ch] mx-auto font-normal">
            &quot;Paint har saal <span className="font-display italic font-semibold text-[#2a2118]">purana</span> hota hai. Natural stone har saal <span className="font-display italic font-semibold text-[#c9a877]">behtar</span>.&quot;
          </p>
          <span className="block font-heading text-xs font-semibold tracking-[0.22em] uppercase text-[#8c8275]">
            {manifesto.sub}
          </span>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="bg-white py-20 text-center border-t border-[#e5e2dc]">
        <div className="max-w-[700px] mx-auto px-6 space-y-4">
          <div className="flex items-center justify-center gap-3 font-heading text-xs font-semibold uppercase tracking-[4px] text-[#8c8275]">
            <span className="w-[34px] h-[1px] bg-[#c9a877]" />
            {cta.eyebrow}
            <span className="w-[34px] h-[1px] bg-[#c9a877]" />
          </div>

          <h2 className="font-display text-[28px] sm:text-[42px] font-normal text-[#2a2118] leading-tight">
            {cta.title}
          </h2>

          <p className="text-sm sm:text-base text-[#5a5550] leading-relaxed max-w-[54ch] mx-auto font-body">
            {cta.description}
          </p>

          <div className="pt-4">
            <Link
              href={cta.buttonLink || "/#quote"}
              className="inline-flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[0.25em] px-8 py-4 bg-[#2a2118] text-white hover:bg-[#1a140f] transition cursor-pointer shadow-sm"
            >
              {cta.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}