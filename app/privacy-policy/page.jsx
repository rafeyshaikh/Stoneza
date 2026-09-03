import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import Seo from "@/models/Seo.model";
import { resolveEntityMetadata } from "@/lib/seo/resolveMetadata";
import { resolveStructuredData } from "@/lib/seo/schemaGenerator";
import JsonLd from "@/components/common/JsonLd";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pages, seo] = await Promise.all([
      Pages.findOne().lean(),
      Seo.findOne().lean(),
    ]);

    const policy = pages?.privacyPolicy;

    return resolveEntityMetadata({
      entityType: "page",
      entity: policy,
      seo: policy?.seo,
      path: "/privacy-policy",
      globalSeo: seo,
      defaultTitle: policy?.title ? `${policy.title}` : "Privacy Policy",
      defaultDescription:
        "Read the Privacy Policy of Stoneza Natural Stones regarding personal data handling and user privacy.",
    });
  } catch {
    return {
      title: "Privacy Policy",
      description: "Read the Privacy Policy of Stoneza.",
    };
  }
}

export default async function PrivacyPolicyPage() {
  let policy = { title: "Privacy Policy", content: "" };
  try {
    await connectDB();
    const pages = await Pages.findOne().lean();
    if (pages?.privacyPolicy) {
      policy = pages.privacyPolicy;
    }
  } catch (error) {
    console.error("PrivacyPolicyPage error:", error.message);
  }

  const structuredData = resolveStructuredData({
    entityType: "page",
    entity: policy,
    options: {
      path: "/privacy-policy",
      defaultTitle: policy.title || "Privacy Policy",
    },
  });

  return (
    <>
      <JsonLd data={structuredData} id="privacy-policy-ldjson" />
      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="mb-8 text-center font-display text-2xl uppercase tracking-[6px] text-[#393938] dark:text-[#ede8e1] md:text-3xl">
          {policy.title}
        </h1>
        <div
          className="prose prose-stone max-w-none dark:prose-invert font-body text-sm leading-relaxed text-[#4b433c] dark:text-[#b7ac9e]"
          dangerouslySetInnerHTML={{
            __html: policy.content || "<p>No content available.</p>",
          }}
        />
      </div>
    </>
  );
}
