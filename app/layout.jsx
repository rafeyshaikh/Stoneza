import "./globals.css";
import { Toaster } from "sonner";
import {
  montserrat,
  nunitoSans,
  libreBaskerville,
} from "@/lib/fonts";

import Providers from "@/context";
import AppChrome from "@/components/common/AppChrome";
import { getCategoriesForLayout } from "@/lib/getCategoriesForLayout";

export const metadata = {
  title: "Stoneza",
  description: "Created by Adarsh Agrahari",
};

export default async function RootLayout({ children }) {
  const categories = await getCategoriesForLayout();

  return (
    <html
      lang="en"
      className={`
        ${montserrat.variable}
        ${nunitoSans.variable}
        ${libreBaskerville.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col bg-[#EAE8E2]">
        <Providers initialCategories={categories}>
          <AppChrome>{children}</AppChrome>
        </Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}