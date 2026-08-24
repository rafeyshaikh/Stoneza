import ContactClientView from "./ContactClientView";
import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import Seo from "@/models/Seo.model";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pagesDoc, seoDoc] = await Promise.all([
      Pages.findOne().select("contactUs").lean(),
      Seo.findOne().lean(),
    ]);

    const contactSeo = pagesDoc?.contactUs?.seo;
    const title =
      contactSeo?.metaTitle?.trim() ||
      "Contact Stoneza | Natural Stone Supply & Specification, Bhilwara";
    const description =
      contactSeo?.metaDescription?.trim() ||
      "Get a quotation for quarry-direct natural stone from Stoneza. Direct phone/WhatsApp, sample box requests, and technical project consultation from Bhilwara, Rajasthan.";

    const ogImage =
      contactSeo?.ogImage?.trim() ||
      pagesDoc?.contactUs?.hero?.bgImage ||
      seoDoc?.ogImage ||
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png";

    const canonicalUrl =
      contactSeo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/pages/contact`;

    const keywords =
      contactSeo?.keywords?.trim() ||
      "contact stoneza, stone manufacturer bhilwara, natural stone sample box, sandstone quotation, stone supplier india";

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: [{ url: ogImage }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Contact generateMetadata error:", error);
    return {
      title: "Contact Stoneza | Natural Stone Supply & Specification",
      description: "Get in touch with Stoneza for natural stone supply, free sample boxes, and quotation requests.",
    };
  }
}

export default async function ContactPage() {
  let initialCmsData = null;
  try {
    await connectDB();
    const pagesDoc = await Pages.findOne().select("contactUs").lean();
    if (pagesDoc?.contactUs) {
      initialCmsData = JSON.parse(JSON.stringify(pagesDoc.contactUs));
    }
  } catch (error) {
    console.error("Contact page server fetch error:", error);
  }

  return <ContactClientView initialData={initialCmsData} />;
}
