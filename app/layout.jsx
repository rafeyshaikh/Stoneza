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
import { getContactDetails } from "@/lib/getContactDetails";
import { connectDB } from "@/lib/databaseConnection";
import Seo from "@/models/Seo.model";
import Script from "next/script";

export const metadata = {
  title: "Stoneza",
  description: "Created by Adarsh Agrahari",
};

export default async function RootLayout({ children }) {
  const categories = await getCategoriesForLayout();
  const contactDetails = await getContactDetails();

  await connectDB();
  const seo = await Seo.findOne().lean();
  const gaId = seo?.googleAnalyticsId || "";

  return (
    <html
      lang="en"
      className={`
        ${montserrat.variable}
        ${nunitoSans.variable}
        ${libreBaskerville.variable}
        h-full antialiased
      `}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#EAE8E2]">
        <Providers initialCategories={categories} initialContactDetails={contactDetails}>
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