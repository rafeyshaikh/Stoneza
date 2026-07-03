"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageWrapper from "@/components/common/PageWrapper";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  if (isAdminPath) {
    return children;
  }

  return (
    <>
      <Header />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
    </>
  );
}
