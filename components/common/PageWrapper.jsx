"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const normalizedPath = (pathname || "").replace(/\/$/, "");
  const isHomePage = normalizedPath === "";

  return (
    <main
      className={`flex-grow ${
        !isHomePage ? "pt-[62px] lg:pt-[127px]" : ""
      }`}
    >
      {children}
    </main>
  );
}