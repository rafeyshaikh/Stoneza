"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();

  return (
    <main
      className={`flex-grow ${
        pathname !== "/" ? "pt-[112px]" : ""
      }`}
    >
      {children}
    </main>
  );
}