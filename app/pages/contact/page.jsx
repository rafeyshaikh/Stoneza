import React from "react";
import EnquiryForm from "@/components/common/EnquiryForm";

export default function ContactUsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-center text-[14px] uppercase tracking-[0.18em] leading-[1.5] text-[#393938] md:text-[28px]">
          Contact Us
        </h1>
        <div className="mt-8 max-w-[700px] mx-auto text-left text-[10px] leading-[1.5] text-[#1c1c1b] md:text-[15px]">
          <table>
            <tbody>
              <tr>
                <td className="pb-5 pr-4 font-bold">Email:</td>
                <td className="pb-5">
                  <a
                    href="mailto:info@stoneza.com"
                    className="underline cursor-pointer"
                  >
                    info@stoneza.com
                  </a>
                </td>
              </tr>
              <tr>
                <td className="pb-5 pr-4 font-bold">Phone:</td>
                <td className="pb-5">
                  <a
                    href="tel:+1234567890"
                    className="underline cursor-pointer"
                  >
                    +1 (234) 567-890
                  </a>
                </td>
              </tr>
              <tr>
                <td className="pb-5 pr-4 font-bold">Address:</td>
                <td className="pb-5">123 Stoneza Street, City, State, ZIP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12">
        <EnquiryForm />
      </div>
    </div>
  );
}
