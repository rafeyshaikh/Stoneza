import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import Seo from "@/models/Seo.model";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pages, seo] = await Promise.all([
      Pages.findOne().lean(),
      Seo.findOne().lean(),
    ]);

    const policySeo = pages?.returnPolicy?.seo;
    const title =
      policySeo?.metaTitle?.trim() ||
      (pages?.returnPolicy?.title
        ? `${pages.returnPolicy.title} | Stoneza`
        : "Return & Cancellation Policy | Stoneza");
    const description =
      policySeo?.metaDescription?.trim() ||
      "Read the Return & Cancellation Policy for custom-cut and quarry-direct natural stone orders at Stoneza.";
    const canonicalUrl =
      policySeo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/pages/return-policy`;
    const ogImage =
      policySeo?.ogImage?.trim() ||
      seo?.ogImage ||
      "";
    const keywords = policySeo?.keywords?.trim() || "return policy, stoneza cancellation, refund policy";

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
        images: ogImage ? [{ url: ogImage }] : [],
        type: "website",
      },
    };
  } catch {
    return {
      title: "Return Policy | Stoneza",
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

  return (
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
  );
}
