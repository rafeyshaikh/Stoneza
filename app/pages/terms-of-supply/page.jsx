import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import Seo from "@/models/Seo.model";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Phone, FileText } from "lucide-react";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pages, seo] = await Promise.all([
      Pages.findOne().lean(),
      Seo.findOne().lean(),
    ]);

    const policySeo = pages?.termsOfSupply?.seo;
    const title =
      policySeo?.metaTitle?.trim() ||
      (pages?.termsOfSupply?.title
        ? `${pages.termsOfSupply.title} | Stoneza`
        : "Terms of Supply | Stoneza Natural Stone");
    const description =
      policySeo?.metaDescription?.trim() ||
      "Standard commercial Terms of Supply for quarry-direct natural stone orders, calibrated slabs, packing, tolerances, transit, and claims at Stoneza.";
    const canonicalUrl =
      policySeo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/pages/terms-of-supply`;
    const ogImage =
      policySeo?.ogImage?.trim() ||
      seo?.ogImage ||
      "";
    const keywords =
      policySeo?.keywords?.trim() ||
      "terms of supply, stoneza commercial policy, stone order terms, quarry supply agreement, natural stone dispatch terms";

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
      title: "Terms of Supply | Stoneza",
      description: "Standard commercial Terms of Supply for natural stone orders at Stoneza.",
    };
  }
}

export default async function TermsOfSupplyPage() {
  let policy = { title: "Terms of Supply", content: "" };
  try {
    await connectDB();
    const pages = await Pages.findOne().lean();
    if (pages?.termsOfSupply) {
      policy = pages.termsOfSupply;
    }
  } catch (error) {
    console.error("TermsOfSupplyPage error:", error.message);
  }

  const clauses = [
    {
      num: "1",
      title: "Scope & Legal Entity",
      content:
        "All supplies, quotations, purchase orders, invoices, and logistics agreements are contracted directly with Anantay Exports Pvt. Ltd. (CIN: U14100RJ2021PTC076892, GSTIN: 08AAWCA2095G1Z9), trading under the registered brand name Stoneza. Placing an order signifies unconditional acceptance of these terms.",
    },
    {
      num: "2",
      title: "Quotation Validity & Price Basis",
      content:
        "Formal quotations issued by Stoneza are valid for 30 calendar days from the date of issue unless stated otherwise in writing. Prices are quoted Ex-Works (Quarry / Processing Unit, Bhilwara / Bijolia / Kota) unless FOR destination or FOB/CIF export terms are explicitly agreed upon. Applicable GST, export customs duties, and statutory levies are charged at actuals.",
    },
    {
      num: "3",
      title: "Natural Geological Variation",
      content:
        "Natural stone is an organic product quarried from the earth. Inherent variations in tone, vein patterns, grain texture, mineral inclusions, natural pitting, and cleft variation are intrinsic characteristics of natural stone and do not constitute manufacturing defects. Physical samples provided represent general characteristics; delivered production batches will exhibit authentic natural nuances.",
    },
    {
      num: "4",
      title: "Dimensional & Thickness Tolerances",
      content:
        "Unless customized architectural precision tolerances are stipulated in writing:\n• Calibrated & Machine-Cut Slabs/Tiles: Thickness tolerance of ±1.5mm to ±2mm; length and width tolerance of ±1mm.\n• Natural Cleft & Hand-Chiseled Stones (Cobbles, Crazy Paving, Fieldstone, Walling): Thickness tolerance of ±4mm to ±6mm according to standard quarry extraction norms.",
    },
    {
      num: "5",
      title: "Order Confirmation & Payment Milestones",
      content:
        "Orders are formally confirmed only upon receipt of a signed Purchase Order (PO) or written specification approval, accompanied by the agreed mobilization advance (standard 50% advance for custom fabrication, with 100% balance cleared prior to material dispatch). Credit terms are subject to formal underwriting and corporate guarantees.",
    },
    {
      num: "6",
      title: "Packaging, Palletizing & Export Fumigation",
      content:
        "All materials are packed in heavy-duty, reinforced wooden crates or A-frame pallets lined with protective foam, corner guards, and high-tensile plastic banding. For international exports, all timber packaging strictly complies with ISPM-15 heat treatment and fumigation standards.",
    },
    {
      num: "7",
      title: "Transit Insurance & Logistics Management",
      content:
        "Where transport logistics are coordinated by Stoneza on behalf of the buyer, shipments are booked through vetted freight carriers. Comprehensive transit insurance must be requested prior to dispatch if not covered under the buyer's open Marine/Transit policy. Risk transfers to the buyer upon handover to the freight carrier.",
    },
    {
      num: "8",
      title: "Site Delivery & Unloading Responsibilities",
      content:
        "Unless specifically contracted for crane or tailgate offloading, offloading at the project site is the sole responsibility of the buyer/consignee. The buyer must ensure suitable road access and clearances for heavy multi-axle freight vehicles.",
    },
    {
      num: "9",
      title: "Pre-Installation Inspection & Dry-Lay Protocol",
      content:
        "IMPORTANT: Natural stone must be unpacked, cleaned, inspected, and dry-laid across the project surface prior to adhesive fixing or mortar application. Installation constitutes final acceptance of the stone. No claims regarding color blending, surface finish, or visible dimensional variance will be entertained once the stone is cut, fixed, or grouted.",
    },
    {
      num: "10",
      title: "Transit Breakage & Wastage Allowance",
      content:
        "Due to the nature of natural stone transit over long distances, a standard industry transit breakage and edge chipping allowance of up to 3% to 5% is customary and factored into project estimates. Specifiers and contractors are advised to order 7% to 10% extra over net area to accommodate site cuts, waste, and pattern alignment.",
    },
    {
      num: "11",
      title: "Damage Claims & Inspection Window",
      content:
        "Any transit damage, crate breakage, or quantity discrepancy must be endorsed clearly on the transporter's Lorry Receipt (LR) upon delivery and notified to Stoneza in writing with high-resolution photographic evidence within 48 hours of delivery.",
    },
    {
      num: "12",
      title: "Sealing, Adhesives & Chemical Compatibility",
      content:
        "Natural stone surfaces are porous and susceptible to staining from acids, oils, organic debris, and efflorescence if left unsealed. Stoneza recommends performing a sample patch test with the intended sealer and stone adhesive prior to full site application. Stoneza is not liable for staining resulting from improper installation or unapproved sealers.",
    },
    {
      num: "13",
      title: "Custom Fabrication & CNC Cut-to-Size Orders",
      content:
        "Bespoke dimensional cuts, curved copings, carved stone Jaalis, fluted wall panels, and custom-profiled architectural stone pieces are manufactured to approved CAD shop drawings. Once quarry cutting or CNC processing commences, custom orders are strictly non-cancellable and non-refundable.",
    },
    {
      num: "14",
      title: "Title & Retention of Ownership",
      content:
        "Title and legal ownership of supplied stone materials remain with Anantay Exports Pvt. Ltd. until full invoice payment has been realized in bank accounts. Risk of loss or damage passes to the buyer upon delivery.",
    },
    {
      num: "15",
      title: "Force Majeure",
      content:
        "Stoneza shall not be held liable for failure or delay in supply caused by events beyond reasonable control, including quarry flooding, severe monsoon disruptions, government mining moratoriums, statutory bans, transport strikes, or port embargoes.",
    },
    {
      num: "16",
      title: "Limitation of Liability",
      content:
        "Stoneza's maximum aggregate liability for any verified defect or breach of contract shall strictly not exceed the invoice value of the defective batch of material supplied. Under no circumstances shall Stoneza be liable for consequential losses, site delays, liquid damages, or re-installation labor costs.",
    },
    {
      num: "17",
      title: "Governing Law & Dispute Resolution",
      content:
        "All contracts, purchase orders, and supply transactions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with supply contracts shall be subject to the exclusive jurisdiction of the competent courts in Bhilwara, Rajasthan, India.",
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
            <span className="text-[#9A4A2E] font-semibold">Terms of Supply</span>
          </nav>

          <Link
            href="/pages/terms-and-conditions"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#78716C] hover:text-[#26221E] transition-colors"
          >
            <FileText className="size-3.5" />
            Website Terms of Use →
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20">
        {/* Header Intro */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9A4A2E]/10 text-[#9A4A2E] rounded-full text-xs font-mono uppercase tracking-wider mb-4">
            <ShieldCheck className="size-3.5" />
            Commercial Supply Agreement v2.0
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-[3px] sm:tracking-[4px] text-[#26221E] mb-4">
            {policy.title || "Terms of Supply"}
          </h1>
          <p className="text-sm sm:text-base text-[#78716C] leading-relaxed max-w-2xl">
            These commercial terms govern all quotations, purchase orders (PO), quarry extraction schedules, custom architectural fabrications, and shipments executed by <strong>Anantay Exports Pvt. Ltd.</strong> (trading as <strong>Stoneza</strong>).
          </p>
        </div>

        {/* Custom CMS Content (if populated) or Default 17 Clauses */}
        {policy.content ? (
          <div
            className="prose prose-stone max-w-none font-body text-sm sm:text-base leading-relaxed text-[#4B433C] bg-white border border-[#E4DDD3] p-6 sm:p-10 rounded-sm shadow-xs mb-12"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        ) : (
          <div className="space-y-6 mb-16">
            {clauses.map((c) => (
              <div
                key={c.num}
                id={`clause-${c.num}`}
                className="bg-white border border-[#E4DDD3] hover:border-[#9A4A2E]/50 transition-colors p-6 sm:p-8 rounded-sm shadow-2xs"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-[#9A4A2E] bg-[#F2EDE4] px-2 py-0.5 rounded-xs shrink-0">
                    § {c.num}
                  </span>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[#26221E]">
                    {c.title}
                  </h2>
                </div>
                <div className="font-body text-sm text-[#4B433C] leading-relaxed whitespace-pre-line pl-0 sm:pl-9 mt-2">
                  {c.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commercial Inquiry Callout Box */}
        <div className="rounded-sm border-2 border-[#D6CEC3] bg-[#FAF8F5] p-6 sm:p-10 text-[#26221E]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9A4A2E] font-semibold block mb-1">
                Quarry Direct Specifier Support
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-[#26221E] mb-2">
                Have specific BOQ or packaging requirements?
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] max-w-lg">
                For custom ASTM testing certifications, ISPM-15 crating schedules, or project-specific billing milestones, contact our commercial sales team directly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="mailto:sales@stoneza.in?subject=Commercial%20Terms%20of%20Supply%20Inquiry"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#9A4A2E] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded hover:bg-[#7D3820] transition-colors shadow-xs"
              >
                <Mail className="size-4" />
                Contact Sales
              </a>
              <Link
                href="/pages/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#26221E] text-[#26221E] text-xs font-mono uppercase tracking-wider font-semibold rounded hover:bg-[#26221E] hover:text-white transition-colors"
              >
                Reach Us
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#E4DDD3] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#78716C]">
            <span>Ref: STZ-TOS-V2.0</span>
            <span>Registered in Rajasthan, India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
