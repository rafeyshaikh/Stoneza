import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import Seo from "@/models/Seo.model";
import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pages, seo] = await Promise.all([
      Pages.findOne().lean(),
      Seo.findOne().lean(),
    ]);

    const policySeo = pages?.termsAndConditions?.seo;
    const title =
      policySeo?.metaTitle?.trim() ||
      (pages?.termsAndConditions?.title
        ? `${pages.termsAndConditions.title} | Stoneza`
        : "Terms & Conditions | Stoneza");
    const description =
      policySeo?.metaDescription?.trim() ||
      "Read the website Terms & Conditions for browsing, requesting specifications, and accessing architectural stone resources at Stoneza.";
    const canonicalUrl =
      policySeo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/terms-and-conditions`;
    const ogImage =
      policySeo?.ogImage?.trim() ||
      seo?.ogImage ||
      "";
    const keywords =
      policySeo?.keywords?.trim() || "terms and conditions, website terms of use, stoneza legal";

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
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return {
      title: "Terms & Conditions | Stoneza",
      description: "Read the Terms & Conditions of Stoneza.",
    };
  }
}

export default async function TermsAndConditionsPage() {
  let policy = { title: "Terms & Conditions", content: "" };
  try {
    await connectDB();
    const pages = await Pages.findOne().lean();
    if (pages?.termsAndConditions) {
      policy = pages.termsAndConditions;
    }
  } catch (error) {
    console.error("TermsAndConditionsPage error:", error.message);
  }

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing, browsing, or using this website (stoneza.in) and associated digital services operated by Anantay Exports Pvt. Ltd. (trading as Stoneza), you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions, our Privacy Policy, and any other notices published on the site. If you do not agree, please discontinue using this website.",
    },
    {
      title: "2. Intellectual Property Rights",
      content:
        "All content, high-resolution stone photography, 3D texture renders, architectural CAD profiles, product specifications, brand names, logos, and website design are the exclusive intellectual property of Anantay Exports Pvt. Ltd. or its licensors. You may not copy, reproduce, scrape, republish, distribute, or create derivative works without prior written consent from Stoneza.",
    },
    {
      title: "3. Product Information & Visual Representation",
      content:
        "Stoneza strives to provide accurate technical data, surface finish descriptions, dimensional options, and representative photographs across our product catalog. However, natural stone is an organic geological material; physical variations in coloration, veining, crystal structure, and surface texture are natural and to be expected. Digital depictions on screens serve as general guides and cannot replicate complete quarry variations.",
    },
    {
      title: "4. Technical Enquiries & Sample Requests",
      content:
        "When submitting specification forms, sample box requests, or project BOQ inquiries through our website, you agree to provide true, accurate, and current information. Stoneza reserves the right to verify project credentials before dispatching physical curated sample collections.",
    },
    {
      title: "5. User Conduct & Security",
      content:
        "You agree not to misuse this website, introduce malicious software, attempt unauthorized access to our servers, or interfere with website performance and security. Any unauthorized use will immediately terminate the permission granted by Stoneza and may result in legal proceedings.",
    },
    {
      title: "6. Commercial Supply Policy",
      content:
        "Commercial purchase orders, quotations, stone extraction schedules, crating, transit breakage allowances, and dispute resolution are governed by our independent, comprehensive Terms of Supply agreement.",
    },
    {
      title: "7. Disclaimer of Warranties",
      content:
        "This website and its content are provided on an 'as is' and 'as available' basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular architectural application, or uninterrupted service.",
    },
    {
      title: "8. Limitation of Liability",
      content:
        "In no event shall Stoneza, its directors, employees, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from your access to or inability to access this website or reliance on any information contained herein.",
    },
    {
      title: "9. Governing Law & Jurisdiction",
      content:
        "These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with the use of this website shall be subject to the exclusive jurisdiction of the courts located in Bhilwara, Rajasthan, India.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[#E4DDD3] bg-[#F2EDE4]/60 py-6 sm:py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#78716C]">
            <Link href="/" className="hover:text-[#26221E] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#9A4A2E] font-semibold">Terms &amp; Conditions</span>
          </nav>

          <Link
            href="/terms-of-supply"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#9A4A2E] hover:underline font-semibold"
          >
            <ShieldCheck className="size-3.5" />
            Terms of Supply (Commercial Policy) →
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20">
        {/* Header Intro */}
        <div className="mb-10 text-center sm:text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-[#9A4A2E] font-semibold block mb-2">
            Legal Terms of Service
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-[3px] sm:tracking-[4px] text-[#26221E] mb-4">
            {policy.title || "Terms & Conditions"}
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl">
            Anantay Exports Pvt. Ltd. (trading as Stoneza) — Bhilwara, Rajasthan, India.
          </p>
        </div>

        {/* Commercial Terms Notice Banner */}
        <div className="mb-12 rounded-sm border border-[#C5B9AB] bg-[#F2EDE4] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <FileText className="size-5 text-[#9A4A2E] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-serif font-bold text-sm sm:text-base text-[#26221E]">
                Looking for B2B Stone Procurement &amp; Supply Terms?
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5 leading-relaxed">
                For commercial quotations, tolerances, crating, ISPM-15, dry-lay protocol, and transit damage policies, please consult our independent Terms of Supply agreement.
              </p>
            </div>
          </div>
          <Link
            href="/terms-of-supply"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9A4A2E] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded hover:bg-[#7D3820] transition-colors shrink-0 shadow-xs"
          >
            View Terms of Supply <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* CMS Content if present, otherwise default clauses */}
        {policy.content ? (
          <div
            className="prose prose-stone max-w-none font-body text-sm sm:text-base leading-relaxed text-[#4B433C] bg-white border border-[#E4DDD3] p-6 sm:p-10 rounded-sm shadow-xs"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        ) : (
          <div className="bg-white border border-[#E4DDD3] p-6 sm:p-10 rounded-sm shadow-xs space-y-8 divide-y divide-[#E4DDD3]">
            {sections.map((sec, idx) => (
              <div key={idx} className={idx > 0 ? "pt-6" : ""}>
                <h2 className="font-serif font-bold text-base sm:text-lg text-[#26221E] mb-2">
                  {sec.title}
                </h2>
                <p className="font-body text-sm text-[#4B433C] leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Contact info footer */}
        <div className="mt-12 pt-6 border-t border-[#E4DDD3] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#78716C]">
          <span>Last Updated: February 2026</span>
          <a href="mailto:legal@stoneza.in" className="text-[#9A4A2E] hover:underline font-semibold">
            legal@stoneza.in
          </a>
        </div>
      </div>
    </div>
  );
}
