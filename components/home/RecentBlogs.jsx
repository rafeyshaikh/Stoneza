import Image from "next/image";
import Link from "next/link";

export default function RecentBlogs({ blogs = [] }) {
  const uniqueBlogs = [];
  const titles = new Set();
  
  // Add database blogs
  for (const b of blogs) {
    uniqueBlogs.push({
      id: b._id,
      title: b.title,
      image: b.bannerImage?.url || "/assets/placeholder.jpg",
      href: `/blogs/${b.slug}`,
    });
    titles.add(b.title.toLowerCase());
  }

  // Fallback blogs
  const fallbacks = [
    {
      id: "fallback-1",
      title: "Beyond Barware Set Glassware: Designing Evenings, Not Just Drinks",
      image: "/assets/others/last_banner_1.webp",
      href: "/blogs",
    },
    {
      id: "fallback-2",
      title: "Ceramic Flower Vase Do's And Don'ts That Keep A Room From Feeling Overstyled",
      image: "/assets/others/last_banner_2.webp",
      href: "/blogs",
    },
  ];

  for (const f of fallbacks) {
    if (!titles.has(f.title.toLowerCase())) {
      uniqueBlogs.push(f);
      titles.add(f.title.toLowerCase());
    }
  }

  const displayBlogs = uniqueBlogs.slice(0, 2);

  return (
    <div className="my-14 md:my-20 px-4">
      <h1 className="font-display text-center text-[22px] md:text-[28px] text-[#393938] tracking-[2px] md:tracking-[4px]">
        RECENT BLOGS
      </h1>

      <div className="mx-auto mt-10 md:mt-14 max-w-[1360px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-16">
        {displayBlogs.map((blog) => (
          <div key={blog.id}>
            <Link href={blog.href} className="block group">
              <div className="group overflow-hidden aspect-[650/380] relative">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
              </div>

              <h2 className="mt-5 md:mt-6 font-display text-[16px] md:text-[18px] uppercase leading-[1.4] text-[#393938] text-center lg:text-left transition-colors group-hover:text-stone-600">
                {blog.title}
              </h2>
            </Link>

            <div className="flex justify-center lg:justify-start">
              <Link href={blog.href}>
                <button className="mt-5 md:mt-6 border border-black px-6 md:px-8 py-3 text-[12px] md:text-[14px] tracking-[2px] md:tracking-[3px] text-[#5F554F] uppercase cursor-pointer transition hover:bg-black hover:text-white">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
