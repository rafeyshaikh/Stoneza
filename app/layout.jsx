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

export async function generateMetadata() {
  await connectDB();
  const seo = await Seo.findOne().lean();
  return {
    title: {
      default: seo?.metaTitle || "Stoneza - Natural Stone Showcase & Enquiry",
      template: `%s | ${seo?.metaTitle || "Stoneza"}`,
    },
    description: seo?.metaDescription || "Elevate interiors and outdoor spaces with natural stone crafted for lasting strength, refined beauty, and enduring performance.",
    keywords: seo?.keywords || "natural stone, stoneza, marble, granite, flooring, wall cladding",
    verification: seo?.searchConsoleVerification ? {
      google: seo.searchConsoleVerification,
    } : undefined,
    openGraph: seo?.ogImage ? {
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.metaTitle || "Stoneza",
        }
      ]
    } : undefined,
  };
}

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
      <body className="min-h-full flex flex-col bg-[#EAE8E2]">
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