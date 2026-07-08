"use client";

import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "./Megamenu";
import { useAuth } from "@/context/AuthContext";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { PiUserLight } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { PiBagSimpleThin } from "react-icons/pi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { PiXBold } from "react-icons/pi";
import { PiCaretDownThin } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, userRole } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const closeTimer = useRef(null);

  const openMenu = (item) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(item);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  useEffect(() => {
    // 1. Try to load cached categories from localStorage for instant mount
    try {
      const cached = localStorage.getItem("stoneza_categories");
      if (cached) {
        setCategories(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Failed to load cached categories:", e);
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/public/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const normalized = json.data.map((cat) => ({
            title: cat.name,
            slug: cat.slug,
            categories: cat.children?.map((sub) => ({
              title: sub.name,
              slug: sub.slug,
              links: sub.children?.map((third) => ({
                name: third.name,
                slug: third.slug
              })) || []
            })) || [],
            images: (cat.wideBanners && cat.wideBanners.length > 0)
              ? cat.wideBanners.slice(0, 2).map((img) => ({
                title: "",
                image: img.url
              }))
              : (cat.squareBanner?.url ? [
                {
                  title: "",
                  image: cat.squareBanner.url
                }
              ] : [])
          }));
          
          setCategories(normalized);

          // 2. Cache updated categories list in localStorage
          try {
            localStorage.setItem("stoneza_categories", JSON.stringify(normalized));
          } catch (e) {
            console.warn("Failed to save categories cache:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const displayNavItems = categories;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoggedIn]);

  const darkMode = !isHomePage || isScrolled || logoHovered;

  return (
    <>
      <header
        className={`
        fixed top-0 left-0 right-0 z-[9999]
        transition-all duration-500 w-screen
        ${darkMode
            ? "bg-[#C5B9AB] text-[#393938] shadow-sm"
            : "bg-black/10 text-white"
          }
      `}
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <Container>
          {/* HEADER TOP */}

          <div className="relative flex h-[64px] items-center justify-center lg:h-20">

            {/* MOBILE HAMBURGER */}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="absolute left-0 text-3xl lg:hidden"
            >
              <HiOutlineMenuAlt3 />
            </button>

            {/* LOGO */}

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 cursor-pointer cursor-pointer">
              {darkMode ? (
                <Image
                  src="/assets/logo/The-Stoneza-Logo.webp"
                  alt="Logo"
                  width={210}
                  height={60}
                  priority
                  className="h-auto w-[150px] lg:w-[210px]"
                />
              ) : (
                <Image
                  src="/assets/logo/The-Stoneza-Logo.webp"
                  alt="Logo"
                  width={210}
                  height={60}
                  priority
                  className="h-auto w-[150px] lg:w-[210px]"
                />
              )}
            </Link>

            {/* USER */}

            {/* <Link
            href={isLoggedIn ? "/profile" : "/auth/login"}
            className="absolute right-20 top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <PiUserLight className="text-2xl" />

          </Link> */}

            {/* {userRole === "admin" && (
            <Link href="/admin"
              className="absolute right-28 top-1/2 hidden -translate-y-1/2 lg:block border px-2">
              Admin Dashboard
            </Link>
          )} */}

            {/* SEARCH */}

            <Link
              href="/search"
              className="absolute right-0 top-1/2 -translate-y-1/2 lg:right-10"
            >
              <CiSearch className="text-2xl" />
            </Link>

          </div>

          {/* Navigation */}
          <div className="hidden justify-center pb-2 lg:flex">
            <div
              className="relative"
              onMouseLeave={closeMenu}
            >
              <nav>
                <ul className="flex items-center gap-11 uppercase text-[12px] font-heading font-medium tracking-widest">
                  {displayNavItems.map((item, index) => (
                    <li
                      key={`${item.title}-${index}`}
                      className="group"
                      onMouseEnter={() =>
                        (item.categories && item.categories.length > 0)
                          ? openMenu(item)
                          : closeMenu()
                      }
                    >
                      <Link
                        href={`/collections/${item.slug}?categoryLevel=1` || "#"}
                        className="relative block"
                      >
                        {item.title}

                        <span
                          className={`
                          absolute left-0 -bottom-1 h-[1px] w-0
                          transition-all duration-300 group-hover:w-full
                          ${darkMode
                              ? "bg-[#1C1B1B]"
                              : "bg-white"
                            }
                        `}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <AnimatePresence>
                {activeMenu && <MegaMenu key={activeMenu.title} item={activeMenu} />}
              </AnimatePresence>
            </div>
          </div>
          {/* MOBILE MENU */}

          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* BACKDROP */}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 z-[9998] bg-black/40 lg:hidden"
                />

                {/* DRAWER */}

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                  }}
                  className="fixed left-0 top-0 z-[9999] h-screen w-[90%] max-w-[380px] overflow-y-auto bg-[#C5B9AB] text-[#393938] shadow-2xl lg:hidden"
                >
                  {/* CLOSE BUTTON */}

                  <div className="flex justify-end p-6">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-3xl"
                    >
                      <PiXBold />
                    </button>
                  </div>

                  {/* NAVIGATION */}

                  <nav className="px-6 pb-10">
                    {displayNavItems.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="border-b border-[#b3a697]"
                      >
                        {/* MAIN CATEGORY */}

                        <button
                          onClick={() =>
                            setOpenCategory(
                              openCategory === index ? null : index
                            )
                          }
                          className="flex w-full items-center justify-betweet py-5 text-left text-[13px] uppercase tracking-[2px] font-medium"
                        >
                          <span>{item.title}</span>

                          <PiCaretDownThin
                            className={`text-xl transition-transform duration-300 ${openCategory === index
                                ? "rotate-180"
                                : ""
                              }`}
                          />
                        </button>

                        {/* SUBMENU */}

                        <AnimatePresence initial={false}>
                          {openCategory === index && (
                            <motion.div
                              initial={{
                                height: 0,
                                opacity: 0,
                              }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.25,
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5">
                                {item.categories?.map(
                                  (category, categoryIndex) => (
                                    <div
                                      key={categoryIndex}
                                      className="mb-6"
                                    >
                                      {/* CATEGORY TITLE */}

                                      <h4
                                        className="mb-3 text-[12px] font-semibold uppercase tracking-[2px]"
                                      >
                                        {category.title}
                                      </h4>

                                      {/* LINKS */}

                                      <div className="space-y-2">
                                        {category.links.map(
                                          (link, linkIndex) => {
                                            const linkName = typeof link === "string" ? link : (link.name || link.title);
                                            const linkSlug = typeof link === "string" ? link.toLowerCase().replace(/ /g, "-") : link.slug;
                                            return (
                                              <Link
                                                key={linkIndex}
                                                href={`/collections/${linkSlug}?categoryLevel=3`}
                                                onClick={() =>
                                                  setMobileMenuOpen(false)
                                                }
                                                className="block pl-3 text-[14px] text-[#5e5e5e] transition hover:text-black"
                                              >
                                                {linkName}
                                              </Link>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Container>
      </header>
    </>
  );
}