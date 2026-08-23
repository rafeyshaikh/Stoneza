import React from "react";
import Link from "next/link";
import ImageWithLoader from "@/components/common/Loader";

export const DEFAULT_ON_SITE_PROJECTS = [
  {
    id: "jw-marriott-ranthambore",
    title: "JW Marriott Ranthambore",
    description:
      "Castle Grey crazy paving and Burgundy Bliss fieldstone across the arrival court and entrance.",
    tag: "HOSPITALITY",
    image:
      "https://stoneza.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-20-at-3.41.21-PM-1-1.png",
    href: "/projects/jw-marriott-ranthambore",
    slug: "jw-marriott-ranthambore",
  },
  {
    id: "ananta-pushkar",
    title: "Ananta, Pushkar",
    description:
      "A cobblestone driveway carrying vehicles for over twenty years, and it has only gained sheen.",
    tag: "RESORT",
    image:
      "https://stoneza.in/wp-content/uploads/2025/01/Untitled-design-2-1-2.jpg",
    href: "/projects/ananta-spa-resort",
    slug: "ananta-spa-resort",
  },
  {
    id: "villas-townships",
    title: "Villas & townships",
    description:
      "Elevations, boundary walls, driveways and pool decks, matched across phases years apart.",
    tag: "RESIDENTIAL",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
    href: "/projects",
    slug: "township-phased-delivery",
  },
];

export default function OnSiteProjects({
  eyebrow = "ON SITE",
  title = "Specified, supplied, standing",
  subtitle = "Stone we have supplied to projects that had to get it right the first time.",
  projects = DEFAULT_ON_SITE_PROJECTS,
  limit = 3,
  showViewAll = true,
  className = "",
}) {
  const allProjects = projects && projects.length > 0 ? projects : DEFAULT_ON_SITE_PROJECTS;
  const displayProjects = limit > 0 ? allProjects.slice(0, limit) : allProjects;

  return (
    <section className={`w-full bg-white border-t border-b-2 border-[#C9BDB2]/50 dark:border-stone-800 py-16 sm:py-20 md:py-24 ${className} `}>
      <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-12 md:mb-14 gap-4">
          <div>
            {eyebrow && (
              <p className="font-heading font-medium tracking-[0.25em] text-[10px] sm:text-[11px] text-[#8A7F73] uppercase mb-2 sm:mb-3">
                {eyebrow}
              </p>
            )}

            <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-normal text-[#1C1714] leading-[1.2] tracking-tight mb-3">
              {title}
            </h2>

            {subtitle && (
              <p className="font-body text-[14px] sm:text-[15px] text-[#635B54] max-w-[650px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && (
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-[11px] uppercase tracking-[0.2em] text-[#8A7F73] hover:text-[#1C1714] transition-colors pb-1 shrink-0"
            >
              <span>Explore All Projects</span>
              <span className="text-sm">&rarr;</span>
            </Link>
          )}
        </div>

        {/* 3-Column Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {displayProjects.map((project, idx) => (
            <Link
              key={project.id || project._id || idx}
              href={project.href || (project.slug ? `/projects/${project.slug}` : "/projects")}
              className="group block"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE8E2] mb-4 sm:mb-5">
                <ImageWithLoader
                  src={project.image || project.bannerImage?.url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  seedIndex={idx}
                />
              </div>

              {/* Title */}
              <h3 className="font-display text-[18px] sm:text-[20px] text-[#1C1714] font-normal leading-snug mb-2 group-hover:text-[#9A4A2E] transition-colors">
                {project.title}
              </h3>

              {/* Description */}
              <p className="font-body text-[13px] sm:text-[14px] text-[#635B54] leading-[1.6] mb-3 sm:mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Category / Tag with Arrow */}
              <div className="inline-flex items-center gap-1.5 font-heading font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8A7F73] group-hover:text-[#1C1714] transition-colors">
                <span>{project.tag || project.segment || "PROJECT"}</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-sm font-normal">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
