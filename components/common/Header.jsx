"use client";

import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "../../data/Navigation";
import MegaMenu from "./Megamenu";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { PiUserLight } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { PiBagSimpleThin } from "react-icons/pi";
import { div } from "framer-motion/client";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const darkMode = !isHomePage || isScrolled || logoHovered;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-[9999]
        transition-all duration-500
        ${
          darkMode
            ? "bg-[#C5B9AB] text-[#393938] shadow-sm"
            : "bg-black/10 text-white"
        }
      `}
      onMouseEnter={() => setLogoHovered(true)}
      onMouseLeave={() => setLogoHovered(false)}
    >
      <Container>
        {/* Logo */}
        <div className="relative flex h-20 items-center justify-center">
          <Link href="/" className="mouse-pointer">
          {logoHovered || darkMode ? (
            
            <Image
              src="/assets/logo/Logo-dark.png"
              alt="Logo"
              width={210}
              height={60}
              priority
              className="h-auto w-auto"
            />
          ) : (
            <Image
              src="/assets/logo/Logo.png"
              alt="Logo"
              width={210}
              height={60}
              priority
              className="h-auto w-auto"
            />
          )}
          </Link>

          <Link
            href="/auth/login"
            className="absolute right-20 top-1/2 -translate-y-1/2"
          >
            <PiUserLight className="text-2xl" />
          </Link>

          <Link
            href="/search"
            className="absolute right-10 top-1/2 -translate-y-1/2"
          >
            <CiSearch className="text-2xl" />
          </Link>

          <Link
            href="/cart"
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <PiBagSimpleThin className="text-2xl" />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-center pb-2">
          <div
            className="relative"
            onMouseLeave={closeMenu}
          >
            <nav>
              <ul className="flex items-center gap-11 uppercase text-[12px] font-heading font-medium tracking-widest">
                {navItems.map((item, index) => (
                  <li
                    key={`${item.title}-${index}`}
                    className="group"
                    onMouseEnter={() =>
                      item.categories
                        ? openMenu(item)
                        : closeMenu()
                    }
                  >
                    <Link
                      href={item.href || "#"}
                      className="relative block"
                    >
                      {item.title}

                      <span
                        className={`
                          absolute left-0 -bottom-1 h-[1px] w-0
                          transition-all duration-300 group-hover:w-full
                          ${
                            darkMode
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

            {activeMenu && <MegaMenu item={activeMenu} />}
          </div>
        </div>
      </Container>
    </header>
  );
}