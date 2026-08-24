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

    const policySeo = pages?.privacyPolicy?.seo;
    const title =
      policySeo?.metaTitle?.trim() ||
      (pages?.privacyPolicy?.title
        ? `${pages.privacyPolicy.title} | Stoneza`
        : "Privacy Policy | Stoneza");
    const description =
      policySeo?.metaDescription?.trim() ||
      "Read the Privacy Policy of Stoneza Natural Stones regarding personal data handling and user privacy.";
    const canonicalUrl =
      policySeo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/pages/privacy-policy`;
    const ogImage =
      policySeo?.ogImage?.trim() ||
      seo?.ogImage ||
      "";
    const keywords = policySeo?.keywords?.trim() || "privacy policy, stoneza data policy, user terms";

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
      title: "Privacy Policy | Stoneza",
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
