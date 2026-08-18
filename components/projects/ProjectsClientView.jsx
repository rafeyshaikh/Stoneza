"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Building,
  ArrowUpRight,
} from "lucide-react";

export default function ProjectsClientView({ initialProjects = [] }) {
  const [activeSegment, setActiveSegment] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const SEGMENTS = [
    { label: "All", value: "all" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Residential", value: "residential" },
    { label: "Landscape", value: "landscape" },
    { label: "Commercial", value: "commercial" },
    { label: "Export", value: "export" },
    { label: "Other", value: "other" },
  ];

  // Separate featured project (JW Marriott or marked featured)
  const featuredProject =
    initialProjects.find((p) => p.isFeatured) || initialProjects[0] || null;

  // Filter remaining / grid projects
  const gridProjects = initialProjects.filter((project) => {
    if (activeSegment === "all") return true;
    return project.segment?.toLowerCase() === activeSegment.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-white text-[#26221E] font-sans antialiased selection:bg-[#9C7233]/20 selection:text-[#26221E]">
      {/* Breadcrumb Navigation */}
      <nav className="border-b border-[#E4DDD3] bg-[#F5F1EB] text-[10.5px] uppercase tracking-[0.1em] font-mono text-[#8A8078]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-8">
          <Link
            href="/"
            className="text-[#8A8078] hover:text-[#26221E] transition-colors"
          >
            Home
          </Link>
          <span className="mx-2 text-[#8A8078]/60">/</span>
          <span className="text-[#26221E] font-medium">Projects</span>
        </div>
      </nav>

      {/* Hero Header Section */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-[#E4DDD3] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#9C7233] mb-5 font-semibold">
            Projects
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-[-0.028em] text-[#26221E] mb-8 max-w-[17ch]">
            Specified, supplied,<br />
            <span className="text-[#8A8078]">standing.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 border-t border-[#26221E] pt-6 text-[15px] leading-relaxed text-[#57504A]">
            <p className="text-[#26221E] font-medium text-[16.5px]">
              Resorts, villas, townships and campuses across India — and containers
              to four continents.
            </p>
            <p>
              Most of what leaves Bhilwara was specified before it was ordered.
              These are the projects where the stone had to be right the first
              time, and stay right through every phase after it.
            </p>
            <p>
              If you are specifying a large job, ask for references in your
              segment. We will put you in touch with the people who used it.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 sm:py-14 md:py-20 border-b border-[#E4DDD3] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Featured Reference Project (Case) */}
          {featuredProject && (
            <div className="border-t border-[#26221E] pt-8 md:pt-11 mb-16 md:mb-20">
              <div
                className="group relative aspect-[16/9] w-full overflow-hidden border border-[#E4DDD3] bg-[#F5F1EB] mb-8 rounded-xs cursor-pointer"
                onClick={() => setSelectedProject(featuredProject)}
              >
                {featuredProject.bannerImage?.url ||
                featuredProject.images?.[0]?.url ? (
                  <Image
                    src={
                      featuredProject.bannerImage?.url ||
                      featuredProject.images[0].url
                    }
                    alt={featuredProject.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#F5F1EB] text-[#8A8078] font-mono text-xs uppercase">
                    Reference Project Showcase
                  </div>
                )}
                <span className="absolute left-4 top-4 bg-white/95 px-3 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-[#26221E] font-medium shadow-xs">
                  Reference project
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16">
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#8A8078] mb-3">
                    {featuredProject.segment} &middot;{" "}
                    {featuredProject.location?.formatted ||
                      [
                        featuredProject.location?.city,
                        featuredProject.location?.state,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                      "Rajasthan"}
                  </p>
                  <h2
                    className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-[#26221E] mb-4 hover:underline cursor-pointer decoration-1 underline-offset-4"
                    onClick={() => setSelectedProject(featuredProject)}
                  >
                    {featuredProject.title}
                  </h2>
                  <p className="text-[#57504A] text-[15px] leading-relaxed max-w-[66ch] whitespace-pre-line">
                    {featuredProject.description}
                  </p>
                </div>

                <div>
                  <dl className="border-t border-[#26221E] divide-y divide-[#E4DDD3]">
                    <div className="flex justify-between items-baseline gap-4 py-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] shrink-0">
                        Segment
                      </dt>
                      <dd className="text-[14px] text-[#26221E] text-right font-medium">
                        {featuredProject.segment}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline gap-4 py-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] shrink-0">
                        Location
                      </dt>
                      <dd className="text-[14px] text-[#26221E] text-right">
                        {featuredProject.location?.formatted ||
                          [
                            featuredProject.location?.city,
                            featuredProject.location?.state,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                          "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline gap-4 py-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] shrink-0">
                        Application
                      </dt>
                      <dd className="text-[14px] text-[#26221E] text-right">
                        {Array.isArray(featuredProject.application)
                          ? featuredProject.application.join(", ")
                          : featuredProject.application || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline gap-4 py-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] shrink-0">
                        Stone
                      </dt>
                      <dd className="text-[14px] text-[#26221E] text-right font-medium">
                        {featuredProject.stone || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline gap-4 py-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] shrink-0">
                        Products
                      </dt>
                      <dd className="text-[14px] text-[#26221E] text-right">
                        {Array.isArray(featuredProject.products)
                          ? featuredProject.products.join(", ")
                          : featuredProject.products || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline gap-4 py-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] shrink-0">
                        Supply
                      </dt>
                      <dd className="text-[14px] text-[#26221E] text-right">
                        {featuredProject.supply || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* More Projects Section & Filter Chips */}
          <div className="space-y-6">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#8A8078]">
              More projects
            </p>

            {/* Segment Chips */}
            <div className="flex flex-wrap gap-2.5">
              {SEGMENTS.map((chip) => {
                const isActive = activeSegment === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setActiveSegment(chip.value)}
                    className={`font-mono text-[9.5px] uppercase tracking-[0.13em] px-4 py-2.5 border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#26221E] border-[#26221E] text-[#C9BDB2]"
                        : "bg-white border-[#CFC6B9] text-[#57504A] hover:border-[#26221E] hover:text-[#26221E]"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pt-4">
              {gridProjects.length === 0 ? (
                <div className="col-span-full py-16 text-center text-[#8A8078] border border-dashed border-[#E4DDD3] rounded-xs">
                  <p className="font-serif text-xl text-[#26221E]">
                    No projects found for this segment
                  </p>
                  <p className="font-mono text-xs mt-1">
                    Select &quot;All&quot; or another segment filter to explore showcase entries.
                  </p>
                </div>
              ) : (
                gridProjects.map((project) => {
                  const displayImg =
                    project.bannerImage?.url ||
                    project.images?.[0]?.url ||
                    "";
                  const locationStr =
                    project.location?.formatted ||
                    [project.location?.city, project.location?.state]
                      .filter(Boolean)
                      .join(", ") ||
                    "India";

                  const productsText = Array.isArray(project.products)
                    ? project.products.join(" · ")
                    : project.products || project.stone || "Natural Stone";

                  return (
                    <div
                      key={project._id}
                      onClick={() => setSelectedProject(project)}
                      className="group block cursor-pointer text-left transition-all"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#E4DDD3] bg-[#F5F1EB] mb-3">
                        {displayImg ? (
                          <Image
                            src={displayImg}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-103"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#8A8078] font-mono text-[10px] uppercase">
                            Stoneza Project
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#26221E]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Segment */}
                      <span className="block font-mono text-[8.5px] uppercase tracking-[0.15em] text-[#9C7233] mb-1 font-semibold">
                        {project.segment || "Project"}
                      </span>

                      {/* Title */}
                      <h3 className="font-serif text-[21px] font-normal leading-[1.22] text-[#26221E] mb-1 group-hover:underline decoration-1 underline-offset-4">
                        {project.title}
                      </h3>

                      {/* Location */}
                      <p className="font-mono text-[9.5px] tracking-[0.08em] text-[#8A8078] mb-2">
                        {locationStr}
                      </p>

                      {/* Description */}
                      <p className="text-[13.5px] leading-[1.62] text-[#57504A] line-clamp-2 mb-3 max-w-[38ch]">
                        {project.description}
                      </p>

                      {/* Used / Stone info */}
                      <span className="block font-mono text-[9px] tracking-[0.06em] text-[#26221E] border-t border-[#E4DDD3] pt-2.5 line-clamp-1">
                        {productsText}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <div className="bg-[#26221E] text-white py-10 px-4 sm:px-8 border-b border-[#3A342E]">
        <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
          <div>
            <b className="block font-serif text-3xl sm:text-4xl font-normal text-[#C9BDB2]">
              1992
            </b>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C9BDB2]/60">
              Supplying since
            </span>
          </div>
          <div>
            <b className="block font-serif text-3xl sm:text-4xl font-normal text-[#C9BDB2]">
              4
            </b>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C9BDB2]/60">
              Continents
            </span>
          </div>
          <div>
            <b className="block font-serif text-3xl sm:text-4xl font-normal text-[#C9BDB2]">
              273
            </b>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C9BDB2]/60">
              Products
            </span>
          </div>
          <div>
            <b className="block font-serif text-3xl sm:text-4xl font-normal text-[#C9BDB2]">
              3
            </b>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C9BDB2]/60">
              Own mines
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <b className="block font-serif text-3xl sm:text-4xl font-normal text-[#C9BDB2]">
              Batch
            </b>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C9BDB2]/60">
              Matched across phases
            </span>
          </div>
        </div>
      </div>

      {/* Pullquote Banner */}
      <div className="bg-[#F5F1EB] border-b border-[#E4DDD3] py-14 md:py-20 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-2xl sm:text-4xl md:text-5xl leading-[1.16] tracking-[-0.02em] text-[#26221E] max-w-[24ch]">
            Phase two has to match phase one, three years later.
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8078] mt-6 block">
            The reason we grade and blend before crating, not after
          </span>
        </div>
      </div>

      {/* How A Project Runs (Four Stages) */}
      <section className="py-14 md:py-20 border-b border-[#E4DDD3] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#8A8078] mb-3">
            How a project runs
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] text-[#26221E] mb-10 max-w-[22ch]">
            Four stages, one consultant
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-[#26221E] pt-8">
            <div>
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-[#9C7233] block mb-3 font-semibold">
                01
              </span>
              <h3 className="font-sans text-base font-semibold text-[#26221E] mb-2">
                Specification
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57504A]">
                We work from your drawings, not a price list. You get the stones
                that suit the application, technical datasheets, and spec codes
                to write into the BOQ so the specification survives the tender.
              </p>
            </div>

            <div>
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-[#9C7233] block mb-3 font-semibold">
                02
              </span>
              <h3 className="font-sans text-base font-semibold text-[#26221E] mb-2">
                Samples &amp; approval
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57504A]">
                Physical samples, wet and dry, free of charge. On larger jobs
                we send a full crate for a mock-up panel so the blend is
                approved before production starts.
              </p>
            </div>

            <div>
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-[#9C7233] block mb-3 font-semibold">
                03
              </span>
              <h3 className="font-sans text-base font-semibold text-[#26221E] mb-2">
                Production &amp; QC
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57504A]">
                Cut, calibrated and finished at Bhilwara. Colour blended to a
                fixed ratio, every crate inspected before it is closed, and the
                lot recorded so a later phase can be matched to it.
              </p>
            </div>

            <div>
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-[#9C7233] block mb-3 font-semibold">
                04
              </span>
              <h3 className="font-sans text-base font-semibold text-[#26221E] mb-2">
                Delivery &amp; phases
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57504A]">
                Insured pan-India delivery or container loading with export
                documentation. We hold the lot reference, so phase two comes
                off the same beds as phase one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architects & PMC Callout Section */}
      <section className="bg-[#F5F1EB] py-14 md:py-20 border-b border-[#E4DDD3]">
        <div className="mx-auto max-w-[980px] px-4 sm:px-8">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#8A8078] mb-3">
            For architects and PMC firms
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] text-[#26221E] mb-4 max-w-[22ch]">
            Ask for references in your segment
          </h2>
          <p className="text-[#57504A] text-[15px] leading-relaxed mb-4 max-w-[66ch]">
            A resort developer wants to hear from a resort. A township wants to
            hear from a township. Tell us the segment and the scale, and we will
            connect you with people who have specified the same stone on a
            comparable job — and, where the client permits it, arrange a site
            visit.
          </p>
          <p className="text-[#57504A] text-[15px] leading-relaxed mb-8 max-w-[66ch]">
            We can also send the specification pack: technical datasheets,
            Stoneza spec codes and physical samples for the stones on your
            drawing.
          </p>
          <Link
            href="/pages/contact"
            className="inline-block bg-[#26221E] text-[#C9BDB2] hover:bg-[#8E4B2A] font-mono text-[10.5px] uppercase tracking-[0.14em] px-7 py-4 transition-colors"
          >
            Request references
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#C9BDB2] py-16 md:py-24 text-center px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#26221E] mb-4 max-w-[20ch] mx-auto">
            Tell us what you are building
          </h2>
          <p className="text-[#544B42] text-[15px] leading-relaxed max-w-[56ch] mx-auto mb-8">
            Send the drawings, the areas or just the idea. A consultant comes
            back with the right stones, lead times and samples — usually the
            same day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pages/contact"
              className="bg-[#26221E] text-[#C9BDB2] hover:bg-[#8E4B2A] font-mono text-[10.5px] uppercase tracking-[0.14em] px-7 py-4 transition-colors"
            >
              Start a project
            </Link>
            <a
              href="https://wa.me/917877108154"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#26221E]/35 text-[#26221E] hover:border-[#26221E] font-mono text-[10.5px] uppercase tracking-[0.14em] px-7 py-4 transition-colors"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* Modal / Drawer for Viewing Single Project Details */}
      {selectedProject && (
        <div
          className="fixed top-[62px] lg:top-[127px] bottom-0 left-0 right-0 z-[800] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-h-[calc(100vh-62px-2rem)] lg:max-h-[calc(100vh-127px-3rem)] w-full max-w-4xl overflow-y-auto bg-white p-6 sm:p-10 shadow-2xl border border-[#E4DDD3] text-[#26221E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 p-2 text-[#8A8078] hover:text-[#26221E] cursor-pointer"
            >
              <X className="size-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#9C7233] font-semibold block mb-1">
                {selectedProject.segment}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#26221E]">
                {selectedProject.title}
              </h2>
              <p className="font-mono text-[11px] tracking-[0.08em] text-[#8A8078] mt-1">
                {selectedProject.location?.formatted ||
                  [selectedProject.location?.city, selectedProject.location?.state]
                    .filter(Boolean)
                    .join(", ")}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#E4DDD3] bg-[#F5F1EB] mb-6">
              {selectedProject.bannerImage?.url || selectedProject.images?.[0]?.url ? (
                <Image
                  src={
                    selectedProject.bannerImage?.url ||
                    selectedProject.images[0].url
                  }
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#8A8078]">
                  No Image Available
                </div>
              )}
            </div>

            {/* Multiple Gallery Shots */}
            {selectedProject.images && selectedProject.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {selectedProject.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] overflow-hidden border border-[#E4DDD3] bg-[#F5F1EB]"
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || `Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mb-8 border-t border-[#E4DDD3] pt-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8078] mb-2 font-medium">
                Project Narrative
              </h4>
              <p className="text-[15px] leading-relaxed text-[#57504A] whitespace-pre-line">
                {selectedProject.description}
              </p>
            </div>

            {/* Detailed Specs Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#26221E] pt-4 mb-8 text-sm">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8A8078]">
                  Stone Specification
                </dt>
                <dd className="font-medium text-[#26221E] mt-0.5">
                  {selectedProject.stone || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8A8078]">
                  Products
                </dt>
                <dd className="text-[#26221E] mt-0.5">
                  {Array.isArray(selectedProject.products)
                    ? selectedProject.products.join(", ")
                    : selectedProject.products || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8A8078]">
                  Application Areas
                </dt>
                <dd className="text-[#26221E] mt-0.5">
                  {Array.isArray(selectedProject.application)
                    ? selectedProject.application.join(", ")
                    : selectedProject.application || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8A8078]">
                  Supply Model
                </dt>
                <dd className="text-[#26221E] mt-0.5">
                  {selectedProject.supply || "—"}
                </dd>
              </div>
            </dl>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-[#E4DDD3] pt-4">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="font-mono text-[10.5px] uppercase tracking-[0.14em] px-5 py-3 border border-[#E4DDD3] text-[#57504A] hover:border-[#26221E] hover:text-[#26221E] transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/pages/contact"
                className="font-mono text-[10.5px] uppercase tracking-[0.14em] px-6 py-3 bg-[#26221E] text-[#C9BDB2] hover:bg-[#8E4B2A] transition-colors"
              >
                Specify This Stone
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
