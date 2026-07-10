import Container from "./Container";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import {redirectToWhatsApp} from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { FaPlay } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#C5B9AB] border-t border-[#ddd4c8] text-[#4b433c] pt-10">
      <div className="text-[22px] md:text-[28px] py-2 px-4 text-center text-[#393938] font-display">
        BE IN THE KNOW
      </div>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-10 lg:gap-12 py-12 lg:py-16">
          {/* WHO WE ARE */}
          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              WHO WE ARE
            </h3>

            <p className="text-[13px] leading-7 text-left md:text-justify">
              Address Home is India&apos;s iconic luxury home decor destination
              that creates and curates world-class premium home decorative
              collections for the discerning lifestyle enthusiast. From
              cushions, bed linen, crockery and dinnerware to sculptures,
              furniture and statement decor pieces, every collection is crafted
              with global design sensibilities and timeless elegance.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              QUICK LINKS
            </h3>

            <ul className="space-y-3 text-[13px]">
              <li>
                <Link
                  href="/pages/about-us"
                  className="transition-colors cursor-pointer"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/pages/contact"
                  className="transition-colors cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/pages/terms-and-conditions"
                  className="transition-colors cursor-pointer"
                >
                  Terms of Use
                </Link>
              </li>

              <li>
                <Link
                  href="/pages/return-policy"
                  className="transition-colors cursor-pointer"
                >
                  Return & Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className="transition-colors cursor-pointer"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* HELPDESK */}
          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              SHOP BY STONE TYPE
            </h3>

            <ul className="space-y-3 text-[13px]">
              <li>
                <Link
                  href="/products?stoneType=marble"
                  className="transition-colors cursor-pointer"
                >
                  Marble
                </Link>
              </li>
              <li>
                <Link
                  href="/products?stoneType=granite"
                  className="transition-colors cursor-pointer"
                >
                  Granite
                </Link>
              </li>
              <li>
                <Link
                  href="/products?stoneType=slate"
                  className="transition-colors cursor-pointer"
                >
                  Slate
                </Link>
              </li>
              <li>
                <Link
                  href="/products?stoneType=limestone"
                  className="transition-colors cursor-pointer"
                >
                  Limestone
                </Link>
              </li>
              <li>
                <Link
                  href="/products?stoneType=cobbles"
                  className="transition-colors cursor-pointer"
                >
                  Cobbles
                </Link>
              </li>
            </ul>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              CONNECT
            </h3>

            <div className="space-y-3 text-[13px]">
              <p className="font-medium">
                <a href="tel:+918287263306">+91 8287263306</a>
              </p>

              <p>
                (Mon-Sat 10am-7pm)
                <br />
                support@addresshome.com
              </p>
            </div>

            <div className="mt-6 flex items-center gap-5">
              <a
                href="https://www.facebook.com/addresshomedecor"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#b39463]"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://www.instagram.com/addresshomedecor"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#b39463]"
              >
                <FaInstagram size={18} />
              </a>

              <p
                onClick={()=>{redirectToWhatsApp()}}
                className="transition-colors hover:text-[#b39463]"
              >
                <FaWhatsapp size={18} />
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#ddd4c8] py-6 text-[11px] md:text-[12px] text-center md:text-left">
          <p>© 2026 Stoneza Retail Pvt. Ltd. | All Rights Reserved.</p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              href="/pages/privacy-policy"
              className="transition-colors hover:text-[#b39463]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/pages/disclaimer"
              className="transition-colors hover:text-[#b39463]"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
