"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const isHomePage = !pathname || pathname === "/" || pathname === "";

  return (
    <main
      className={`flex-grow ${
        !isHomePage ? "pt-[64px] lg:pt-[106px]" : ""
      }`}
    >
      {children}
    </main>
  );
}