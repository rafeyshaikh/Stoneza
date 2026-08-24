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

export default function ContactClientView({ initialData = null }) {
  const [cmsData, setCmsData] = useState(() => {
    if (!initialData) return DEFAULT_CMS_DATA;
    return {
      hero: {
        bgImage: initialData.hero?.bgImage || DEFAULT_CMS_DATA.hero.bgImage,
      },
      cards: {
        whatsappPhone: initialData.cards?.whatsappPhone || DEFAULT_CMS_DATA.cards.whatsappPhone,
        whatsappHref: initialData.cards?.whatsappHref || DEFAULT_CMS_DATA.cards.whatsappHref,
        emailAddress: initialData.cards?.emailAddress || DEFAULT_CMS_DATA.cards.emailAddress,
        officeLocation: initialData.cards?.officeLocation || DEFAULT_CMS_DATA.cards.officeLocation,
        workingHours: initialData.cards?.workingHours || DEFAULT_CMS_DATA.cards.workingHours,
      },
      peopleSection: {
        people:
          initialData.peopleSection?.people && initialData.peopleSection.people.length > 0
            ? initialData.peopleSection.people
            : DEFAULT_CMS_DATA.peopleSection.people,
      },
      location: {
        mapEmbedUrl: initialData.location?.mapEmbedUrl || DEFAULT_CMS_DATA.location.mapEmbedUrl,
      },
    };
  });

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
    if (initialData) return;
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
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(
          data.error ||
            data.message ||
            "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#26221E] font-sans antialiased min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[460px] md:min-h-[520px] flex items-end bg-[#1C1714] text-[#FAF7F2] overflow-hidden pt-32 pb-16 px-6 md:px-12 lg:px-20 border-b border-[#FAF7F2]/10">
        {/* Background Image with Cinematic Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{
            backgroundImage: `url('${cmsData.hero.bgImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#1C1714]/80 to-[#1C1714]/40" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C25E3E]/20 text-[#E07A5F] border border-[#C25E3E]/30 rounded-full font-mono text-xs uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse"></span>
              Direct From Quarry to Site
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight mb-6 text-balance">
              Let’s talk about your stone.
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-[#FAF7F2]/80 font-light leading-relaxed max-w-2xl">
              Whether you need 20,000 sq ft of custom-split sandstone for a
              resort, cut-to-size cladding panels for a facade, or a single
              sample box to confirm a finish — we’re here.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <nav className="border-b border-[#26221E]/10 bg-white/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-3.5 font-mono text-[11px] tracking-wider uppercase text-[#8A8078] flex items-center gap-2">
          <Link
            href="/"
            className="hover:text-[#26221E] transition-colors flex items-center gap-1"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-[#26221E] font-medium">Contact</span>
        </div>
      </nav>

      {/* 2. DIRECT ACTION CHANNELS (4 Pillars) */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Channel 1: WhatsApp */}
          <div className="bg-white border border-[#26221E]/10 p-7 flex flex-col justify-between hover:border-[#25D366]/40 hover:shadow-md transition-all duration-300 group rounded-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8078]">
                  Fastest
                </span>
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.058.376-.058c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.125.556 4.12 1.528 5.86l-1.621 5.922 6.079-1.595c1.7 1.002 3.673 1.577 5.787 1.577 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-xl font-medium mb-1">
                WhatsApp Desk
              </h3>
              <p className="text-xs text-[#8A8078] leading-relaxed mb-4">
                Average reply in 15 mins. Send site plans, BOQs, or photos.
              </p>
            </div>
            <a
              href={cmsData.cards.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-[#26221E] group-hover:text-[#25D366] transition-colors"
            >
              <span>{cmsData.cards.whatsappPhone}</span>
              <span className="text-sm">→</span>
            </a>
          </div>

          {/* Channel 2: Email */}
          <div className="bg-white border border-[#26221E]/10 p-7 flex flex-col justify-between hover:border-[#26221E]/40 hover:shadow-md transition-all duration-300 group rounded-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8078]">
                  Formal BOQ
                </span>
                <div className="w-8 h-8 rounded-full bg-[#26221E]/5 flex items-center justify-center text-[#26221E]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-xl font-medium mb-1">
                Direct Email
              </h3>
              <p className="text-xs text-[#8A8078] leading-relaxed mb-4">
                Send tender files, specification sheets, and project estimates.
              </p>
            </div>
            <a
              href={`mailto:${cmsData.cards.emailAddress}`}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-[#26221E] group-hover:text-[#C25E3E] transition-colors"
            >
              <span>{cmsData.cards.emailAddress}</span>
              <span className="text-sm">→</span>
            </a>
          </div>

          {/* Channel 3: Sample Box */}
          <div className="bg-[#EFEAE2] border border-[#26221E]/10 p-7 flex flex-col justify-between hover:border-[#C25E3E]/50 hover:shadow-md transition-all duration-300 group rounded-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C25E3E]">
                  Complimentary
                </span>
                <div className="w-8 h-8 rounded-full bg-[#C25E3E]/10 flex items-center justify-center text-[#C25E3E]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-xl font-medium mb-1">
                Sample Kit
              </h3>
              <p className="text-xs text-[#6B635B] leading-relaxed mb-4">
                Delivered across India and worldwide. 4–6 stone cuts in your
                finishes.
              </p>
            </div>
            <a
              href="#enquiry-form"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-[#C25E3E] group-hover:translate-x-1 transition-transform"
            >
              <span>Request Sample Box</span>
              <span className="text-sm">↓</span>
            </a>
          </div>

          {/* Channel 4: HQ & Yard Visit */}
          <div className="bg-white border border-[#26221E]/10 p-7 flex flex-col justify-between hover:border-[#26221E]/40 hover:shadow-md transition-all duration-300 group rounded-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8078]">
                  Yard & Processing
                </span>
                <div className="w-8 h-8 rounded-full bg-[#26221E]/5 flex items-center justify-center text-[#26221E]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-xl font-medium mb-1">
                {cmsData.cards.officeLocation}
              </h3>
              <p className="text-xs text-[#8A8078] leading-relaxed mb-4">
                {cmsData.cards.workingHours}. Yard visits by appointment.
              </p>
            </div>
            <a
              href="#location-map"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-[#26221E] group-hover:text-[#C25E3E] transition-colors"
            >
              <span>View Map & Directions</span>
              <span className="text-sm">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. MAIN INTERACTION SECTION: FORM & WHO YOU ARE TALKING TO */}
      <section
        id="enquiry-form"
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: The Comprehensive Specification Form */}
          <div className="lg:col-span-7 bg-white border border-[#26221E]/10 p-8 sm:p-10 md:p-12 rounded-sm shadow-xs">
            <div className="mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[#C25E3E] block mb-2">
                Project Specification
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-[#1C1714]">
                Tell us what your site requires.
              </h2>
              <p className="text-sm text-[#6B635B] mt-2 font-light">
                Fill what you know. We’ll calculate sq ft, wastage, jointing,
                and crate weight for you.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#FAF7F2] border border-[#25D366]/30 p-8 rounded-sm text-center">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-[#1C1714] mb-2">
                  Enquiry Dispatched.
                </h3>
                <p className="text-sm text-[#6B635B] max-w-md mx-auto mb-6">
                  Thank you, {formData.name}. Our stone team in Bhilwara has
                  received your specification. You will hear back via WhatsApp /
                  Email shortly.
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
                  className="px-6 py-2.5 border border-[#26221E]/20 font-mono text-xs uppercase tracking-wider text-[#26221E] hover:bg-[#26221E] hover:text-white transition-colors"
                >
                  Send another specification
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                {/* Row 1: Contact Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Full Name <span className="text-[#C25E3E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Phone / WhatsApp <span className="text-[#C25E3E]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Email Address <span className="text-[#C25E3E]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="rahul@studio.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Site / Delivery City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Udaipur, Bangalore, Dubai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: Role & Project Type Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      I am specifying as
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all text-[#26221E]"
                    >
                      {ENQUIRER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all text-[#26221E]"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Quantity and Stone Requirement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Approximate Area / Quantity
                    </label>
                    <input
                      type="text"
                      name="area"
                      placeholder="e.g. 5,000 sq ft or 2 crates"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                      Stone / Collection of Interest
                    </label>
                    <input
                      type="text"
                      name="stoneType"
                      placeholder="e.g. Bhilwara Sandstone, Kota, EarthSkin"
                      value={formData.stoneType}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Row 5: Specification Details / Message */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#26221E] mb-2">
                    Project Notes / Custom Cutting Specs
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Mention custom thicknesses, edge profiles (tumbled, sawn, hand-cut), delivery timeline, or sample requests..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F2]/60 border border-[#26221E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C25E3E] focus:bg-white transition-all resize-y"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 bg-[#C25E3E] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#A94F33] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Transmitting to Quarry Desk...
                      </>
                    ) : (
                      <>
                        Submit Specification for Quotation
                        <span>→</span>
                      </>
                    )}
                  </button>
                  <p className="font-mono text-[11px] text-[#8A8078] mt-3">
                    Direct quarry pricing • Zero middlemen • Non-binding
                    estimates
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Team Contacts + Process Guarantees */}
          <div className="lg:col-span-5 space-y-8">
            {/* The Specific People You Talk To */}
            <div className="bg-white border border-[#26221E]/10 p-8 rounded-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-[#8A8078] block mb-1">
                The Quarry & Project Team
              </span>
              <h3 className="font-display text-2xl text-[#1C1714] mb-6">
                You speak directly to stone specialists.
              </h3>

              <div className="space-y-6 divide-y divide-[#26221E]/10">
                {cmsData.peopleSection.people.map((person, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-6" : ""}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-lg font-medium text-[#1C1714]">
                          {person.name}
                        </h4>
                        <p className="font-mono text-xs text-[#C25E3E] uppercase tracking-wider mt-0.5">
                          Technical & Project Lead
                        </p>
                      </div>
                      {person.linkedIn && (
                        <a
                          href={person.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8A8078] hover:text-[#0077b5] transition-colors"
                          title="LinkedIn Profile"
                        >
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#6B635B]">
                      {person.phone && (
                        <a
                          href={`tel:${person.phone}`}
                          className="hover:text-[#26221E] transition-colors flex items-center gap-1.5"
                        >
                          <span>TEL:</span> {person.phone}
                        </a>
                      )}
                      {person.whatsapp && (
                        <a
                          href={`https://wa.me/${person.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:underline flex items-center gap-1.5"
                        >
                          <span>WA:</span> {person.whatsapp}
                        </a>
                      )}
                      {person.email && (
                        <a
                          href={`mailto:${person.email}`}
                          className="hover:text-[#26221E] transition-colors flex items-center gap-1.5"
                        >
                          <span>EMAIL:</span> {person.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Specification Guarantees */}
            <div className="bg-[#FAF7F2] border border-[#26221E]/10 p-8 rounded-sm space-y-5">
              <span className="font-mono text-xs uppercase tracking-widest text-[#8A8078] block">
                How We Deliver
              </span>

              <div className="space-y-4 text-xs font-sans text-[#6B635B] leading-relaxed">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C25E3E]/10 text-[#C25E3E] font-mono flex items-center justify-center shrink-0 text-[10px]">
                    01
                  </div>
                  <div>
                    <strong className="text-[#1C1714] font-medium block mb-0.5">
                      Direct Quarry Invoicing & Dispatch
                    </strong>
                    Dispatched on full trucks or container loads directly from
                    our extraction units in Rajasthan.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C25E3E]/10 text-[#C25E3E] font-mono flex items-center justify-center shrink-0 text-[10px]">
                    02
                  </div>
                  <div>
                    <strong className="text-[#1C1714] font-medium block mb-0.5">
                      Palletized & Corner-Protected Crates
                    </strong>
                    Fumigated wooden boxes built for transport without edge
                    chipping or in-transit breakages.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C25E3E]/10 text-[#C25E3E] font-mono flex items-center justify-center shrink-0 text-[10px]">
                    03
                  </div>
                  <div>
                    <strong className="text-[#1C1714] font-medium block mb-0.5">
                      On-Site Dry Lays Before Shipping
                    </strong>
                    For large project batches, we dry-lay and share high-res video
                    footage for tone confirmation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PHYSICAL ADDRESS & GOOGLE MAP EMBED */}
      <section
        id="location-map"
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12 border-t border-[#26221E]/10 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C25E3E] block mb-2">
              Extraction & Office Location
            </span>
            <h2 className="font-display text-3xl font-normal text-[#1C1714]">
              Stoneza Natural Stones HQ
            </h2>
            <p className="text-sm text-[#6B635B] mt-2 font-light max-w-lg">
              Bhilwara, Rajasthan, India — the epicenter of sandstone and
              quartzite extraction in North-Western India.
            </p>
          </div>
          <div className="lg:col-span-6 flex lg:justify-end gap-4 font-mono text-xs">
            <div className="px-5 py-3 bg-white border border-[#26221E]/10">
              <span className="text-[#8A8078] block">Hours:</span>
              <strong className="text-[#26221E]">
                {cmsData.cards.workingHours}
              </strong>
            </div>
            <div className="px-5 py-3 bg-white border border-[#26221E]/10">
              <span className="text-[#8A8078] block">Visits:</span>
              <strong className="text-[#26221E]">By Appointment</strong>
            </div>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="w-full h-[420px] rounded-sm overflow-hidden border border-[#26221E]/15 shadow-inner bg-[#EFEAE2] relative">
          <iframe
            src={cmsData.location.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Stoneza HQ Location Map"
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>
    </div>
  );
}
