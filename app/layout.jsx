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
import { getCollectionsForLayout } from "@/lib/getCollectionsForLayout";
import { getContactDetails } from "@/lib/getContactDetails";
import { connectDB } from "@/lib/databaseConnection";
import Seo from "@/models/Seo.model";
import Script from "next/script";

export async function generateMetadata() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"),
      title: {
        default: seo?.metaTitle || "Stoneza | Natural Stone Manufacturer & Exporter",
        template: `%s | Stoneza`,
      },
      description:
        seo?.metaDescription ||
        "Quarry-direct natural stone manufacturer and exporter in India since 1992. Precision-calibrated sandstone, limestone, granite, cobblestones, and wall cladding.",
      keywords: seo?.keywords || "natural stone, stoneza, marble, granite, flooring, wall cladding",
      verification: seo?.searchConsoleVerification
        ? {
            google: seo.searchConsoleVerification,
          }
        : undefined,
      alternates: {
        canonical: "https://stoneza.in",
      },
      openGraph: {
        title: seo?.metaTitle || "Stoneza | Natural Stone Manufacturer & Exporter",
        description:
          seo?.metaDescription ||
          "Quarry-direct natural stone manufacturer and exporter in India since 1992. Precision-calibrated sandstone, limestone, granite, cobblestones, and wall cladding.",
        url: "https://stoneza.in",
        siteName: "Stoneza",
        images: [
          {
            url:
              seo?.ogImage ||
              "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
            width: 1200,
            height: 630,
            alt: "Stoneza Natural Stone",
          },
        ],
      },
    };
  } catch (error) {
    console.error("Layout generateMetadata DB error:", error.message);
    return {
      metadataBase: new URL("https://stoneza.in"),
      title: {
        default: "Stoneza | Natural Stone Manufacturer & Exporter",
        template: "%s | Stoneza",
      },
      description:
        "Quarry-direct natural stone manufacturer and exporter in India since 1992. Precision-calibrated sandstone, limestone, granite, cobblestones, and wall cladding.",
      keywords: "natural stone, stoneza, marble, granite, flooring, wall cladding",
    };
  }
}

export default async function RootLayout({ children }) {
  const categories = await getCategoriesForLayout();
  const collections = await getCollectionsForLayout();
  const contactDetails = await getContactDetails();

  let gaId = "";
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();
    gaId = seo?.googleAnalyticsId || "";
  } catch (error) {
    console.error("RootLayout DB error:", error.message);
  }

  return (
    <html
      lang="en"
      className={`
        ${montserrat.variable}
        ${nunitoSans.variable}
        ${libreBaskerville.variable}
        h-full antialiased
      `}>
      <body className="min-h-full flex flex-col bg-white">
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
        {/* Organization and LocalBusiness Structured Data Schema (F-09) */}
        <script
          id="stoneza-org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Stoneza",
              legalName: "Anantay Exports Pvt. Ltd.",
              url: "https://stoneza.in",
              logo: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
              image: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
              telephone: "+91-7877108154",
              email: "sales@stoneza.in",
              description:
                "Quarry-direct manufacturer and exporter of natural stone, sandstone cladding, limestone flooring, and cobblestones since 1992.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Stoneza Works, Opp. Cross Road, RIICO Pur Road",
                addressLocality: "Bhilwara",
                addressRegion: "Rajasthan",
                postalCode: "311001",
                addressCountry: "IN",
              },
              sameAs: [
                "https://www.linkedin.com/company/stoneza",
                "https://www.instagram.com/stoneza.in",
              ],
              priceRange: "$$",
            }),
          }}
        />

        <Providers initialCategories={categories} initialCollections={collections} initialContactDetails={contactDetails}>
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