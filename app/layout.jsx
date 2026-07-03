import "./globals.css";
import { Toaster } from "sonner";
import {
  montserrat,
  nunitoSans,
  libreBaskerville,
} from "@/lib/fonts";

import Providers from "@/context";
import AppChrome from "@/components/common/AppChrome";

export const metadata = {
  title: "Stoneza",
  description: "Created by Adarsh Agrahari",
};

export default function RootLayout({ children }) {
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
        <Providers>
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