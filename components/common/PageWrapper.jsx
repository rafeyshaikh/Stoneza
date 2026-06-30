"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();

  return (
    <main
      className={`flex-grow ${
        pathname !== "/" ? "pt-[64px] lg:pt-[106px]" : ""
      }`}
    >
      {children}
    </main>
  );
}