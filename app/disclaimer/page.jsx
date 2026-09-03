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

    const policy = pages?.disclaimer;

    return resolveEntityMetadata({
      entityType: "page",
      entity: policy,
      seo: policy?.seo,
      path: "/disclaimer",
      globalSeo: seo,
      defaultTitle: policy?.title ? `${policy.title}` : "Disclaimer",
      defaultDescription:
        "Read the Legal Disclaimer and natural stone variation notices of Stoneza.",
    });
  } catch {
    return {
      title: "Disclaimer",
      description: "Read the Disclaimer of Stoneza.",
    };
  }
}

export default async function DisclaimerPage() {
  let policy = { title: "Disclaimer", content: "" };
  try {
    await connectDB();
    const pages = await Pages.findOne().lean();
    if (pages?.disclaimer) {
      policy = pages.disclaimer;
    }
  } catch (error) {
    console.error("DisclaimerPage error:", error.message);
  }

  const structuredData = resolveStructuredData({
    entityType: "page",
    entity: policy,
    options: {
      path: "/disclaimer",
      defaultTitle: policy.title || "Disclaimer",
    },
  });

  return (
    <>
      <JsonLd data={structuredData} id="disclaimer-ldjson" />
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
