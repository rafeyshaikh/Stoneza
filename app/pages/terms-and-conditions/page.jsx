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

    const policySeo = pages?.termsAndConditions?.seo;
    const title =
      policySeo?.metaTitle?.trim() ||
      (pages?.termsAndConditions?.title
        ? `${pages.termsAndConditions.title} | Stoneza`
        : "Terms & Conditions | Stoneza");
    const description =
      policySeo?.metaDescription?.trim() ||
      "Read the Terms and Conditions for purchasing, specifying, and ordering natural stone products from Stoneza.";
    const canonicalUrl =
      policySeo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/pages/terms-and-conditions`;
    const ogImage =
      policySeo?.ogImage?.trim() ||
      seo?.ogImage ||
      "";
    const keywords = policySeo?.keywords?.trim() || "terms and conditions, stoneza terms, quarry orders";

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

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-[#9A4A2E] block mb-2">
          Legal Documentation &amp; Commercial Policy
        </span>
        <h1 className="font-display text-3xl md:text-4xl uppercase tracking-[4px] text-[#26221E] mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs md:text-sm text-[#78716C] max-w-xl mx-auto">
          Anantay Exports Pvt. Ltd. (trading as Stoneza) — Quarry Operator &amp; Natural Stone Exporter, Bhilwara, Rajasthan.
        </p>

        {/* Quick Nav Anchors */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono text-xs">
          <a
            href="#terms-of-use"
            className="px-4 py-2 bg-[#F2EDE4] hover:bg-[#26221E] hover:text-white rounded transition-colors text-[#26221E] font-medium"
          >
            1. Website Terms of Use
          </a>
          <a
            href="#terms-of-supply"
            className="px-4 py-2 bg-[#9A4A2E] text-white rounded hover:bg-[#7D3820] transition-colors font-medium shadow-xs"
          >
            2. Commercial Terms of Supply (17 Clauses) ↓
          </a>
        </div>
      </div>

      {/* Part 1: Terms of Use */}
      <section id="terms-of-use" className="mb-16 scroll-mt-24 bg-white border border-[#E4DDD3] p-6 sm:p-10 rounded-sm">
        <h2 className="font-display text-xl sm:text-2xl text-[#26221E] mb-6 pb-3 border-b border-[#E4DDD3]">
          General Terms of Use
        </h2>
        <div
          className="prose prose-stone max-w-none font-body text-sm leading-relaxed text-[#4B433C]"
          dangerouslySetInnerHTML={{
            __html:
              policy.content ||
              "<p>Welcome to Stoneza (stoneza.in). By browsing our catalog, requesting technical specifications, or submitting sample requests, you agree to comply with our general terms of service, privacy practices, and intellectual property guidelines.</p>",
          }}
        />
      </section>

      {/* Part 2: Terms of Supply (17 Commercial Clauses) */}
      <section
        id="terms-of-supply"
        className="scroll-mt-24 bg-[#FAF8F5] border-2 border-[#D6CEC3] p-6 sm:p-10 rounded-sm space-y-8"
      >
        <div className="border-b border-[#D6CEC3] pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#9A4A2E] font-semibold block mb-1">
            Standard Commercial Policy v2.0
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-[#26221E]">
            Terms of Supply for Natural Stone Orders
          </h2>
          <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
            These terms govern all quotations, purchase orders (PO), custom quarry fabrications, and dispatches executed by Anantay Exports Pvt. Ltd. (trading as Stoneza).
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#4B433C] leading-relaxed divide-y divide-[#E4DDD3]">
          <div className="pt-4 first:pt-0">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              1. Scope &amp; Legal Entity
            </h3>
            <p>
              All supplies, invoices, and logistics agreements are contracted directly with <strong>Anantay Exports Pvt. Ltd.</strong> (CIN: U14100RJ2021PTC076892, GSTIN: 08AAWCA2095G1Z9), trading under the registered brand name <strong>Stoneza</strong>.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              2. Quotation Validity &amp; Price Basis
            </h3>
            <p>
              Formal quotations issued by Stoneza are valid for a period of <strong>30 calendar days</strong> from the date of issue unless specified otherwise. Prices are quoted Ex-Works (Quarry / Processing Unit, Bhilwara / Bijolia / Kota) unless FOR (Free On Road) destination or FOB/CIF export ports are explicitly stipulated. Applicable GST and statutory levies are charged extra at actuals.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              3. Natural Geological Variation
            </h3>
            <p>
              Natural stone is an organic product of the earth. Inherent variations in colour shade, background tone, veining, grain structure, mineral deposits, and textural pitting are natural characteristics and do not constitute manufacturing defects. Samples provided represent general character; full production batches may exhibit organic nuances.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              4. Dimensional &amp; Thickness Tolerances
            </h3>
            <p>
              Unless customized precision tolerances are agreed upon in writing:
              <br />
              • <strong>Calibrated &amp; Machine-Cut Slabs/Tiles:</strong> Thickness tolerance of ±1.5mm to ±2mm; length and width tolerance of ±1mm.
              <br />
              • <strong>Natural Cleft &amp; Hand-Chiseled Stones (Cobbles, Crazy Paving, Fieldstone):</strong> Thickness tolerance of ±4mm to ±6mm according to standard quarry extraction norms.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              5. Order Confirmation &amp; Advance Deposits
            </h3>
            <p>
              An order is formally confirmed only upon receipt of a signed Purchase Order (PO) or written specification approval, accompanied by the agreed mobilization advance (standard 50% advance for custom fabrication, balance prior to dispatch).
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              6. Packaging, Crating &amp; Export Fumigation
            </h3>
            <p>
              Material is securely packed in reinforced, palletized wooden crates with corner protectors and plastic banding. For international exports, all wooden packaging complies with <strong>ISPM-15 fumigation standards</strong>.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              7. Transit Insurance &amp; Logistics
            </h3>
            <p>
              Where freight is arranged by Stoneza on behalf of the buyer, goods are dispatched through vetted freight carriers. Comprehensive transit insurance must be requested prior to dispatch if not covered under the buyer&apos;s open Marine/Transit policy.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              8. Site Delivery &amp; Unloading Obligations
            </h3>
            <p>
              Unless specifically contracted for crane/tailgate unloading, unloading at the project site is the sole responsibility of the buyer/consignee. The buyer must ensure suitable access for heavy multi-axle freight vehicles.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              9. Pre-Installation Inspection &amp; Dry-Lay Protocol
            </h3>
            <p>
              <strong>Crucial:</strong> Natural stone must be unpacked, inspected, and dry-laid on site prior to adhesive or mortar fixing. <strong>Installation constitutes acceptance of the stone.</strong> No claims regarding color blending, surface finish, or visible dimensional variance will be entertained once the stone is cut, fixed, or grouted.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              10. Transit Breakage Allowance
            </h3>
            <p>
              Due to the nature of natural stone transport across regional roads, a standard industry transit breakage/chipping allowance of <strong>up to 3% to 5%</strong> is customary and factored into project wastage estimations. Buyers are advised to order 7%–10% extra over net area for cutting and tile alignment.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              11. Damage Claims &amp; Reporting Window
            </h3>
            <p>
              Any severe in-transit damages, crate breakage, or quantity shortfalls must be endorsed on the transporter&apos;s Lorry Receipt (LR) upon delivery and notified to Stoneza in writing with supporting high-resolution photographs within <strong>48 hours of delivery</strong>.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              12. Sealing &amp; Chemical Compatibility
            </h3>
            <p>
              Natural stones are porous and susceptible to staining from acidic substances, organic debris, and efflorescence if left unsealed. Stoneza recommends testing a sample with the intended stone sealer and adhesive prior to full application.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              13. Custom Fabrications &amp; CNC Cut-to-Size Orders
            </h3>
            <p>
              Custom-profiled stones, carved Jaalis, fluted wall panels, and bespoke dimensional cuts are non-refundable and non-returnable once extraction or processing has commenced based on approved shop drawings.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              14. Title &amp; Ownership of Goods
            </h3>
            <p>
              Title and ownership of the supplied goods remain with Anantay Exports Pvt. Ltd. until full invoice payment has been realized. Risk transfers to the buyer upon delivery to the carrier or site.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              15. Force Majeure
            </h3>
            <p>
              Stoneza shall not be liable for delayed shipments caused by circumstances beyond reasonable control, including but not limited to quarry flooding/monsoon disruptions, government royalty moratoriums, statutory mining bans, transport strikes, or port blockades.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              16. Limitation of Liability
            </h3>
            <p>
              Stoneza&apos;s maximum cumulative liability for any verified defect or breach of contract shall strictly not exceed the invoice value of the specific defective batch of material supplied. Under no circumstances shall Stoneza be liable for consequential losses, site delays, or re-installation labor costs.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-bold text-base text-[#26221E] mb-1.5">
              17. Governing Law &amp; Jurisdiction
            </h3>
            <p>
              All contracts and transactions shall be construed in accordance with the laws of India. Any disputes arising under or in connection with supply contracts shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bhilwara, Rajasthan, India</strong>.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#D6CEC3] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#78716C]">
          <p>Document Ref: STZ-TOS-V2.0</p>
          <a
            href="mailto:sales@stoneza.in?subject=Terms%20of%20Supply%20Inquiry"
            className="text-[#9A4A2E] hover:underline font-semibold"
          >
            Questions? Contact sales@stoneza.in →
          </a>
        </div>
      </section>
    </div>
  );
}
