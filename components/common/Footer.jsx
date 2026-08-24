import Container from "./Container";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { redirectToWhatsApp } from "@/lib/whatsapp";
import { useContact } from "@/context/ContactContext";
import { COMPANY_INFO } from "@/lib/constants";

export default function Footer() {
  const { contactDetails } = useContact();
  const phone = contactDetails?.phone || COMPANY_INFO.phone;
  const phoneClean = phone.replace(/\s+/g, "");
  const email = contactDetails?.email || COMPANY_INFO.email;
  const workingHours = contactDetails?.workingHours || COMPANY_INFO.workingHours;
  const address = contactDetails?.address || COMPANY_INFO.registeredAddress;
  const gstin = contactDetails?.gstin || COMPANY_INFO.gstin;
  const cin = contactDetails?.cin || COMPANY_INFO.cin;

  return (
    <footer className="bg-[#26221e] border-t border-[#696258] text-[#B2A99E] pt-10">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.1fr_1.9fr] gap-10 lg:gap-12 py-12 lg:py-16">
          {/* WHO WE ARE */}
          <div className="space-y-4">
            <h3 className="text-[11px] text-white font-semibold uppercase tracking-[0.18em]">
              WHO WE ARE
            </h3>

            <p className="text-[13px] leading-7 text-left">
              Stoneza is a quarry-direct natural stone manufacturer and exporter operating from Bhilwara, Rajasthan since 1992. We own mines at Bijolia, Kota and Asind, and supply architects, PMC firms, resort developers and landscape designers across India and worldwide.
            </p>

            <div className="pt-2 text-[12px] leading-relaxed text-[#8E857B]">
              <p className="font-semibold text-[#D4CDC5] uppercase tracking-wider text-[10.5px]">Works &amp; Headquarters:</p>
              <p>{address}</p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-[11px] text-white font-semibold uppercase tracking-[0.18em]">
              QUICK LINKS
            </h3>

            <ul className="space-y-3 text-[13px]">
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/about-us"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/contact"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/terms-and-conditions"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/terms-and-conditions#terms-of-supply"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  Terms of Supply
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/return-policy"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="transition-colors hover:text-white cursor-pointer"
                >
                  The Journal (Blogs)
                </Link>
              </li>
            </ul>
          </div>

          {/* SHOP BY STONE TYPE */}
          <div>
            <h3 className="mb-5 text-[11px] font-semibold text-white uppercase tracking-[0.18em]">
              SHOP BY STONE TYPE
            </h3>

            <ul className="space-y-3 text-[13px]">
              {COMPANY_INFO.stoneFamilies.map((st) => (
                <li key={st.query}>
                  <Link
                    href={st.href}
                    className="transition-colors hover:text-white cursor-pointer"
                  >
                    {st.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="mb-5 text-[11px] font-semibold text-white uppercase tracking-[0.18em]">
              CONNECT
            </h3>

            <div className="space-y-3 text-[13px]">
              <p className="font-medium">
                <a
                  href={`tel:${phoneClean}`}
                  className="text-[#EDE8E1] hover:text-white hover:underline transition-colors"
                >
                  {phone}
                </a>
              </p>

              <p className="text-[12.5px] leading-relaxed">
                <span className="text-[#8E857B]">Hours:</span> {workingHours}
                <br />
                <a
                  href={`mailto:${email}`}
                  className="text-[#C9A980] hover:underline transition-colors font-medium mt-1 inline-block"
                >
                  {email}
                </a>
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-4 text-[#B2A99E]">
              <a
                href={contactDetails?.instagram || COMPANY_INFO.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#36302B] hover:bg-[#9A4A2E] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={15} />
              </a>

              <a
                href={contactDetails?.linkedIn || COMPANY_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#36302B] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={14} />
              </a>

              <a
                href={contactDetails?.facebook || COMPANY_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#36302B] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={13} />
              </a>

              <a
                href={contactDetails?.youtube || COMPANY_INFO.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#36302B] hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={15} />
              </a>

              <a
                href={contactDetails?.whatsapp || COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#36302B] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#443E38] py-6 text-[11px] md:text-[12px] text-center md:text-left text-[#8E857B]">
          <div className="space-y-1">
            <p>© 2026 {COMPANY_INFO.legalEntity} — {COMPANY_INFO.tradeName}. All rights reserved.</p>
            <p className="text-[10px] font-mono tracking-wider opacity-80">
              CIN: {cin} &nbsp;|&nbsp; GSTIN: {gstin}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[12px]">
            <Link
              href="/pages/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/pages/disclaimer"
              className="transition-colors hover:text-white"
            >
              Disclaimer
            </Link>

            <Link
              href="/pages/terms-and-conditions#terms-of-supply"
              className="transition-colors hover:text-white"
            >
              Terms of Supply
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
