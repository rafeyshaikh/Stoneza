"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ENQUIRER_ROLES, PROJECT_TYPES } from "@/lib/validations/enquiry";

const DEFAULT_CMS_DATA = {
  hero: {
    bgImage:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
  },
  cards: {
    whatsappPhone: "+91 78771 08154",
    whatsappHref: "https://wa.me/917877108154",
    emailAddress: "sales@stoneza.in",
    officeLocation: "Bhilwara, Rajasthan",
    workingHours: "Mon–Sat, 9:30–18:30 IST",
  },
  peopleSection: {
    people: [
      {
        name: "Saniya",
        phone: "+91 78771 08154",
        whatsapp: "+91 78771 08154",
        email: "saniya@stoneza.in",
        linkedIn: "",
      },
      {
        name: "Kanishk Ostwal",
        phone: "+91 99500 36866",
        whatsapp: "+91 99500 36866",
        email: "kanishk.ostwal@stoneza.in",
        linkedIn: "https://www.linkedin.com/company/thestoneza",
      },
    ],
  },
  location: {
    mapEmbedUrl:
      "https://maps.google.com/maps?q=stoneza&t=m&z=12&ie=UTF8&iwloc=B&output=embed",
  },
};

export default function ContactUsPage() {
  const [cmsData, setCmsData] = useState(DEFAULT_CMS_DATA);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Architect / Designer",
    projectType: "Resort / Hotel",
    area: "",
    city: "",
    stoneType: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCmsData() {
      try {
        const res = await fetch("/api/public/pages/contactUs");
        const json = await res.json();
        if (json.success && json.data) {
          setCmsData({
            hero: {
              bgImage:
                json.data.hero?.bgImage || DEFAULT_CMS_DATA.hero.bgImage,
            },
            cards: {
              whatsappPhone:
                json.data.cards?.whatsappPhone ||
                DEFAULT_CMS_DATA.cards.whatsappPhone,
              whatsappHref:
                json.data.cards?.whatsappHref ||
                DEFAULT_CMS_DATA.cards.whatsappHref,
              emailAddress:
                json.data.cards?.emailAddress ||
                DEFAULT_CMS_DATA.cards.emailAddress,
              officeLocation:
                json.data.cards?.officeLocation ||
                DEFAULT_CMS_DATA.cards.officeLocation,
              workingHours:
                json.data.cards?.workingHours ||
                DEFAULT_CMS_DATA.cards.workingHours,
            },
            peopleSection: {
              people:
                json.data.peopleSection?.people &&
                json.data.peopleSection.people.length > 0
                  ? json.data.peopleSection.people
                  : DEFAULT_CMS_DATA.peopleSection.people,
            },
            location: {
              mapEmbedUrl:
                json.data.location?.mapEmbedUrl ||
                DEFAULT_CMS_DATA.location.mapEmbedUrl,
            },
          });
        }
      } catch (err) {
        console.error("Error loading Contact Us CMS data:", err);
      }
    }
    loadCmsData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
      if (!cleanPhone || cleanPhone.length < 10) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      const numArea = Number(formData.area.toString().replace(/[^\d.]/g, ""));
      if (!numArea || numArea <= 0 || isNaN(numArea)) {
        throw new Error("Please enter a valid approximate area (in sq m)");
      }

      const payload = {
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        role: formData.role,
        projectType: formData.projectType,
        area: numArea,
        city: formData.city.trim() || "General",
        stoneType: formData.stoneType.trim() || "Natural Stone",
        message: formData.message.trim(),
      };

      const res = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.errors) {
          const firstErr = Object.values(json.errors).flat()[0];
          throw new Error(firstErr || json.message || "Validation failed");
        }
        throw new Error(json.message || "Failed to submit enquiry");
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit enquiry. Please try again or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#26221E] font-sans antialiased">
      {/* BREADCRUMB BAR */}
      <nav className="border-b border-[#26221E]/13 bg-white">
        <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16 py-3.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[#8A8078] flex items-center gap-2">
          <Link href="/" className="text-[#8A8078] hover:text-[#26221E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#26221E]">Contact</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[clamp(320px,46vh,470px)] flex items-end px-4.5 sm:px-8 lg:px-16 py-[clamp(38px,6vw,74px)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-[#7C7466]"
          style={{
            backgroundImage: `url('${cmsData.hero.bgImage}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#26221E]/14 via-[#26221E]/68 to-[#26221E]/90" />
        </div>

        <div className="relative max-w-[1320px] mx-auto w-full z-10">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 mb-3.5">
            Get in touch
          </p>
          <h1 className="font-serif font-normal text-[clamp(32px,5.4vw,62px)] leading-[1.04] text-white mb-4 tracking-[-0.02em] max-w-[20ch]">
            Tell us the project. <em className="italic opacity-93">Get a real quotation.</em>
          </h1>
          <p className="max-w-[58ch] text-white/85 text-[16px] leading-[1.62]">
            Send the drawing, the area or just the idea. A Stoneza consultant responds with the right stones, quarry-direct pricing, lead times and samples &mdash; usually the same day.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS GRID */}
      <section className="py-[clamp(46px,6vw,86px)] border-b border-[#26221E]/13">
        <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-[#26221E]">
            {/* Card 1: WhatsApp */}
            <div className="py-6.5 px-0 sm:pr-6 lg:pr-7 border-b sm:border-r border-[#26221E]/13 last:border-r-0">
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#8A8078] block mb-2.5">
                WhatsApp &mdash; fastest
              </span>
              <p className="font-serif text-[19px] leading-[1.35] mb-1.75">
                <a
                  href={cmsData.cards.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline border-b border-[#CFC6B9] hover:border-[#26221E] transition-colors"
                >
                  {cmsData.cards.whatsappPhone}
                </a>
              </p>
              <p className="text-[13.5px] leading-[1.62] text-[#8A8078] m-0">
                Send a photo, a drawing or a voice note. Usually answered within the hour, Monday to Saturday.
              </p>
            </div>

            {/* Card 2: Email */}
            <div className="py-6.5 px-0 sm:px-6 lg:px-7 border-b lg:border-r border-[#26221E]/13">
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#8A8078] block mb-2.5">
                Email
              </span>
              <p className="font-serif text-[19px] leading-[1.35] mb-1.75">
                <a
                  href={`mailto:${cmsData.cards.emailAddress}`}
                  className="no-underline border-b border-[#CFC6B9] hover:border-[#26221E] transition-colors"
                >
                  {cmsData.cards.emailAddress}
                </a>
              </p>
              <p className="text-[13.5px] leading-[1.62] text-[#8A8078] m-0">
                Best for BOQs, drawings and tender documents. Attach what you have and we will work from it.
              </p>
            </div>

            {/* Card 3: Office */}
            <div className="py-6.5 px-0 sm:pr-6 lg:px-7 border-b sm:border-r border-[#26221E]/13">
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#8A8078] block mb-2.5">
                Works &amp; office
              </span>
              <p className="font-serif text-[19px] leading-[1.35] mb-1.75">
                {cmsData.cards.officeLocation}
              </p>
              <p className="text-[13.5px] leading-[1.62] text-[#8A8078] m-0">
                Visits welcome by appointment &mdash; see the slabs, the finishing lines and the quarry face before you specify.
              </p>
            </div>

            {/* Card 4: Hours */}
            <div className="py-6.5 px-0 sm:px-6 lg:pl-7 border-b border-[#26221E]/13">
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#8A8078] block mb-2.5">
                Hours
              </span>
              <p className="font-serif text-[19px] leading-[1.35] mb-1.75">
                {cmsData.cards.workingHours}
              </p>
              <p className="text-[13.5px] leading-[1.62] text-[#8A8078] m-0">
                Export enquiries are answered across time zones; tell us your working hours and we will call in them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO PEOPLE DIRECT CONTACT SECTION */}
      <section className="bg-[#F5F1EB] py-[clamp(46px,6vw,86px)] border-t border-b border-[#26221E]/13">
        <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
          <p className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[#8A8078] mb-3">
            Speak to someone directly
          </p>
          <h2 className="font-serif font-normal text-[clamp(25px,3.3vw,38px)] leading-[1.12] tracking-[-0.012em] mb-4">
            Two people, not a call centre
          </h2>
          <p className="font-sans text-[15px] leading-[1.78] text-[#57504A] max-w-[66ch] mb-6.5">
            Every enquiry is handled by a named person who stays with it from quotation to delivery. If you would rather skip the form, call or write to either of us directly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-[#26221E]">
            {cmsData.peopleSection.people.map((person, index) => (
              <div
                key={index}
                className={`py-7 ${
                  index === 0
                    ? "md:pr-8 lg:pr-10 border-b md:border-b-0 md:border-r border-[#26221E]/13"
                    : "md:pl-8 lg:pl-10"
                }`}
              >
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#9C7233] block mb-2.75">
                  {index === 0 ? "Sales — first point of contact" : "Direct line"}
                </span>
                <h3 className="font-serif text-[24px] font-normal mb-1">
                  {person.name || (index === 0 ? "Saniya" : "Kanishk Ostwal")}
                </h3>
                <p className="text-[13.5px] text-[#8A8078] mb-4">
                  {index === 0 ? "Sales Consultant" : "Director — Anantay Exports Pvt. Ltd."}
                </p>
                <p className="text-[14px] leading-[1.68] text-[#57504A] mb-4.5 max-w-[42ch]">
                  {index === 0
                    ? "Start here for quotations, samples, availability and lead times. Saniya works with architects, contractors and homeowners across India and will pull in technical support where a drawing needs it."
                    : "For large projects, specification support, partnership and distribution enquiries, export programmes, or anything that has not been resolved to your satisfaction. Reach out directly — it comes to me, not to a queue."}
                </p>

                <div className="border-t border-[#26221E]/13">
                  {person.phone && (
                    <a
                      href={`tel:${person.phone}`}
                      className="flex gap-2.75 items-baseline py-2.5 border-b border-[#26221E]/13 no-underline text-[14.5px] text-[#26221E] hover:text-[#8E4B2A] transition-colors"
                    >
                      <b className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078] w-[74px] shrink-0 font-normal">
                        Phone
                      </b>
                      {person.phone}
                    </a>
                  )}
                  {person.whatsapp && (
                    <a
                      href={
                        person.whatsapp.startsWith("http")
                          ? person.whatsapp
                          : `https://wa.me/${person.whatsapp.replace(/\D/g, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-2.75 items-baseline py-2.5 border-b border-[#26221E]/13 no-underline text-[14.5px] text-[#26221E] hover:text-[#8E4B2A] transition-colors"
                    >
                      <b className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078] w-[74px] shrink-0 font-normal">
                        WhatsApp
                      </b>
                      {person.whatsapp}
                    </a>
                  )}
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="flex gap-2.75 items-baseline py-2.5 border-b border-[#26221E]/13 no-underline text-[14.5px] text-[#26221E] hover:text-[#8E4B2A] transition-colors"
                    >
                      <b className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078] w-[74px] shrink-0 font-normal">
                        Email
                      </b>
                      {person.email}
                    </a>
                  )}
                  {person.linkedIn ? (
                    <a
                      href={person.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-2.75 items-baseline py-2.5 border-b border-[#26221E]/13 no-underline text-[14.5px] text-[#26221E] hover:text-[#8E4B2A] transition-colors"
                    >
                      <b className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078] w-[74px] shrink-0 font-normal">
                        LinkedIn
                      </b>
                      Connect &rarr;
                    </a>
                  ) : (
                    <div className="flex gap-2.75 items-baseline py-2.5 border-b border-[#26221E]/13 text-[14.5px] text-[#26221E]">
                      <b className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078] w-[74px] shrink-0 font-normal">
                        Hours
                      </b>
                      Mon&ndash;Sat, 9:30&ndash;18:30 IST
                    </div>
                  )}
                </div>

                <span className="inline-block font-mono text-[8.5px] tracking-[0.13em] uppercase bg-[#F5F1EB] border border-[#CFC6B9] px-2.25 py-1.25 mt-4 text-[#57504A]">
                  {index === 0
                    ? "Quotations · Samples · Lead times"
                    : "Projects · Specification · Partnerships · Export"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT & PROJECT FORM SECTION */}
      <section className="py-[clamp(46px,6vw,86px)] border-b border-[#26221E]/13">
        <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.85fr)_minmax(320px,1fr)] gap-[clamp(28px,5vw,72px)] items-start">
            {/* Left Steps Column */}
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[#8A8078] mb-3">
                  What happens next
                </p>
                <h2 className="font-serif font-normal text-[clamp(25px,3.3vw,38px)] leading-[1.12] tracking-[-0.012em] mb-4">
                  Four steps, no chasing
                </h2>
              </div>

              <ul className="list-none m-0 p-0 border-t border-[#26221E]/13">
                <li className="py-3.25 border-b border-[#26221E]/13 text-[14.5px] flex gap-3.25 leading-[1.6]">
                  <b className="font-mono text-[10px] text-[#9C7233] shrink-0 pt-0.75">
                    01
                  </b>
                  <span>
                    A consultant reads what you sent and comes back with the stones that fit &mdash; including ones you did not ask about, if they suit the job better.
                  </span>
                </li>
                <li className="py-3.25 border-b border-[#26221E]/13 text-[14.5px] flex gap-3.25 leading-[1.6]">
                  <b className="font-mono text-[10px] text-[#9C7233] shrink-0 pt-0.75">
                    02
                  </b>
                  <span>
                    You get a firm quotation against the actual requirement, with lead time. Not an indicative range that changes later.
                  </span>
                </li>
                <li className="py-3.25 border-b border-[#26221E]/13 text-[14.5px] flex gap-3.25 leading-[1.6]">
                  <b className="font-mono text-[10px] text-[#9C7233] shrink-0 pt-0.75">
                    03
                  </b>
                  <span>
                    Physical samples go out free &mdash; wet and dry, because every stone darkens in rain and no photograph shows it.
                  </span>
                </li>
                <li className="py-3.25 border-b border-[#26221E]/13 text-[14.5px] flex gap-3.25 leading-[1.6]">
                  <b className="font-mono text-[10px] text-[#9C7233] shrink-0 pt-0.75">
                    04
                  </b>
                  <span>
                    On approval, one consultant carries the order through production, dispatch and delivery. You are not handed between departments.
                  </span>
                </li>
              </ul>

              <div className="pt-2">
                <p className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[#8A8078] mb-2">
                  Specifying rather than buying?
                </p>
                <p className="text-[15px] leading-[1.78] text-[#57504A]">
                  Ask for the specification pack &mdash; technical datasheets, Stoneza spec codes and physical samples for the stones on your drawing. Written into a BOQ, a spec code names the stone, finish and thickness, so what arrives is what you drew.
                </p>
              </div>
            </div>

            {/* Right Project Form Card */}
            <div className="border border-[#CFC6B9] p-[clamp(24px,3.2vw,38px)] bg-white">
              <h3 className="font-serif text-[23px] font-normal mb-1">
                Send us your project
              </h3>
              <p className="text-[13px] text-[#8A8078] mb-5.5">
                No obligation. We reply with a firm figure, not a range.
              </p>

              {submitted ? (
                <div className="bg-[#F5F1EB] border border-[#9C7233] p-6 text-center space-y-3">
                  <h4 className="font-serif text-xl font-medium text-[#26221E]">
                    Thank You!
                  </h4>
                  <p className="text-sm text-[#57504A]">
                    Your enquiry has been received. A Stoneza consultant will review your request and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        role: "Architect / Designer",
                        projectType: "Resort / Hotel",
                        area: "",
                        city: "",
                        stoneType: "",
                        message: "",
                      });
                    }}
                    className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#9C7233] underline cursor-pointer pt-2 inline-block"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+91"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        Email (Optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="role"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        You are
                      </label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none appearance-none cursor-pointer pr-7 focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'><path d='M0 0l5 6 5-6z' fill='%2357504A'/></svg>")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 11px center",
                        }}
                      >
                        {ENQUIRER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="projectType"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        Project type
                      </label>
                      <select
                        id="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none appearance-none cursor-pointer pr-7 focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'><path d='M0 0l5 6 5-6z' fill='%2357504A'/></svg>")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 11px center",
                        }}
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="area"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        Approx. area (sq m)
                      </label>
                      <input
                        id="area"
                        type="number"
                        placeholder="e.g. 500"
                        required
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="city"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        City / site
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="e.g. Alibaug"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="stoneType"
                        className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                      >
                        Stone of interest
                      </label>
                      <input
                        id="stoneType"
                        type="text"
                        placeholder="e.g. Kota Blue, or unsure"
                        value={formData.stoneType}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="block font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#8A8078]"
                    >
                      Anything else (Optional)
                    </label>
                    <textarea
                      id="message"
                      placeholder="Timeline, finish, thickness, whether you need samples or a site visit"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full min-h-[96px] bg-white border border-[#CFC6B9] px-3 py-2.75 text-sm text-[#26221E] rounded-none resize-y focus:outline-2 focus:outline-[#26221E] focus:-outline-offset-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-mono text-[10.5px] tracking-[0.14em] uppercase bg-[#26221E] text-[#C9BDB2] border-0 py-4 px-4 cursor-pointer hover:bg-[#8E4B2A] transition-colors mt-1.5 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send enquiry"}
                  </button>

                  <p className="text-center font-mono text-[10px] tracking-[0.06em] text-[#8A8078] pt-1">
                    Or WhatsApp us directly &mdash;{" "}
                    <a
                      href={cmsData.cards.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8E4B2A] no-underline border-b border-current"
                    >
                      {cmsData.cards.whatsappPhone}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION / MAP SECTION */}
      <section className="py-[clamp(46px,6vw,86px)] border-b border-[#26221E]/13">
        <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
          <p className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[#8A8078] mb-3">
            Find us
          </p>
          <h2 className="font-serif font-normal text-[clamp(25px,3.3vw,38px)] leading-[1.12] tracking-[-0.012em] mb-4">
            Bhilwara, Rajasthan
          </h2>
          <p className="font-sans text-[15px] leading-[1.78] text-[#57504A] max-w-[66ch] mb-6">
            The works and the head office are in Bhilwara, roughly four hours from Jaipur and two from Udaipur. Our Bijolia quarry is an hour away &mdash; architects specifying a large job are welcome at both.
          </p>

          <div className="aspect-[21/9] min-h-[360px] w-full border border-[#CFC6B9] relative overflow-hidden bg-[#F5F1EB]">
            <iframe
              src={cmsData.location.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Stoneza Bhilwara Location Map"
              className="w-full h-full min-h-[360px]"
            />
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="bg-[#C9BDB2] py-[clamp(48px,6vw,84px)] px-4.5 sm:px-8 lg:px-16 text-center">
        <h2 className="font-serif font-normal text-[clamp(25px,3.3vw,38px)] leading-[1.12] tracking-[-0.012em] mb-3.5 text-[#26221E]">
          Not sure which stone yet?
        </h2>
        <p className="max-w-[56ch] mx-auto mb-6.5 text-[#544B42] text-[15px] leading-[1.7]">
          That is the normal starting point. Tell us the surface, the exposure and the look you are after, and we will narrow it down before you commit to anything.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="https://wa.me/917877108154"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10.5px] tracking-[0.14em] uppercase no-underline py-3.75 px-6.5 bg-[#26221E] text-[#C9BDB2] hover:bg-[#8E4B2A] transition-colors"
          >
            WhatsApp a consultant
          </a>
          <Link
            href="/"
            className="font-mono text-[10.5px] tracking-[0.14em] uppercase no-underline py-3.75 px-6.5 border border-[#26221E]/35 text-[#26221E] hover:border-[#26221E] transition-colors"
          >
            Browse the catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
