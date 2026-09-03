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

    const policy = pages?.returnPolicy;

    return resolveEntityMetadata({
      entityType: "page",
      entity: policy,
      seo: policy?.seo,
      path: "/return-policy",
      globalSeo: seo,
      defaultTitle: policy?.title ? `${policy.title}` : "Return & Cancellation Policy",
      defaultDescription:
        "Read the Return & Cancellation Policy for custom-cut and quarry-direct natural stone orders at Stoneza.",
    });
  } catch {
    return {
      title: "Return Policy",
      description: "Read the Return Policy of Stoneza.",
    };
  }
}

export default async function ReturnPolicyPage() {
  let policy = { title: "Return Policy", content: "" };
  try {
    await connectDB();
    const pages = await Pages.findOne().lean();
    if (pages?.returnPolicy) {
      policy = pages.returnPolicy;
    }
  } catch (error) {
    console.error("ReturnPolicyPage error:", error.message);
  }

  const structuredData = resolveStructuredData({
    entityType: "page",
    entity: policy,
    options: {
      path: "/return-policy",
      defaultTitle: policy.title || "Return Policy",
    },
  });

  return (
    <>
      <JsonLd data={structuredData} id="return-policy-ldjson" />
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
