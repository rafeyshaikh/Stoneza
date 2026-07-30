"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const normalizedPath = (pathname || "").replace(/\/$/, "");
  const isHomePage = normalizedPath === "";

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