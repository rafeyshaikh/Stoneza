import ContactClientView from "./ContactClientView";
import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import Seo from "@/models/Seo.model";
import { resolveEntityMetadata } from "@/lib/seo/resolveMetadata";
import { resolveStructuredData } from "@/lib/seo/schemaGenerator";
import JsonLd from "@/components/common/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pagesDoc, seoDoc] = await Promise.all([
      Pages.findOne().select("contactUs").lean(),
      Seo.findOne().lean(),
    ]);

    const contactUs = pagesDoc?.contactUs;

    return resolveEntityMetadata({
      entityType: "page",
      entity: contactUs,
      seo: contactUs?.seo,
      path: "/contact",
      globalSeo: seoDoc,
      defaultTitle: "Contact Stoneza — Stone Supply & Specification",
      defaultDescription:
        "Get a quotation for quarry-direct natural stone from Stoneza. Direct phone/WhatsApp, sample box requests, and technical project consultation from Bhilwara, Rajasthan.",
    });
  } catch (error) {
    console.error("Contact generateMetadata error:", error);
    return {
      title: "Contact Stoneza",
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

  const structuredData = resolveStructuredData({
    entityType: "contact",
    entity: initialCmsData,
  });

  return (
    <>
      <JsonLd data={structuredData} id="contact-ldjson" />
      <ContactClientView initialData={initialCmsData} />
    </>
  );
}
