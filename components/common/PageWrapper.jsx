"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const normalizedPath = pathname ? pathname.split("?")[0].replace(/\/$/, "") : "";
  const isHomePage = normalizedPath === "" || normalizedPath === "/";

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