"use client";
import { useState } from "react";

const PROJECT_TYPES = [
  "Resort / Hotel",
  "Villa / Bungalow",
  "Apartment / Township",
  "Commercial",
  "Landscape",
  "Other",
];

const VOLUMES = [
  "Under 500 sq m",
  "500 - 2,000 sq m",
  "2,000 - 10,000 sq m",
  "10,000+ sq m",
];

const BULLETS = [
  "Factory-direct bulk pricing",
  "Free material samples to your site or studio",
  "Custom sizes, thickness & finishes",
  "Dedicated consultant for the whole project",
];

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#9C8D79]">
        {label}
      </span>
      {children}
    </div>
  );
}

const fieldBase =
  "w-full rounded-[4px] border border-[#54493F] bg-[#3B3530] px-3.5 py-[11px] text-[13.5px] leading-none text-[#EDE8E1] placeholder:text-[#8A7F73] outline-none transition-colors focus:border-[#B49A75] appearance-none";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    projectType: "",
    volume: "",
    city: "",
    stoneType: "",
  });

  const update = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = () => console.log(formData);

  return (
    <section className="mx-auto max-w-[648px] rounded-[6px] bg-gradient-to-b from-[#2A2420] to-[#211C18] px-6 py-8 text-[#F5F1EA] md:px-10 md:py-10">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9C8D79]">
        Start Your Project
      </p>

      <h1 className="mt-4 font-serif text-[26px] leading-[1.25] tracking-tight text-[#F5F1EA] md:text-[32px]">
        Tell us the project. Get a{" "}
        <span className="italic font-serif text-[#9C8D79]">real</span> quote.
      </h1>

      <p className="mt-4 max-w-[42ch] font-sans text-[14px] leading-[1.6] text-[#B7AC9E]">
        Share a few details and a Stoneza consultant responds with
        quarry-direct pricing, lead times and samples — usually same day.
      </p>

      <ul className="mt-6 space-y-3.5">
        {BULLETS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 font-sans text-[14px] leading-[1.4] text-[#D7CFC4]"
          >
            <span className="mt-[-1px] text-[#B49A75]">↳</span>
            {item}
          </li>
        ))}
      </ul>

      <form
        className="mt-7 grid gap-x-5 gap-y-5 rounded-[6px] border border-[#4A413A] bg-[#28221D] p-5 md:grid-cols-2 md:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Field label="Name">
          <input
            className={fieldBase}
            placeholder="Your name"
            value={formData.name}
            onChange={update("name")}
          />
        </Field>

        <Field label="Phone / WhatsApp">
          <input
            className={fieldBase}
            placeholder="+91"
            value={formData.phone}
            onChange={update("phone")}
          />
        </Field>

        <Field label="Project Type">
          <select
            className={fieldBase}
            value={formData.projectType}
            onChange={update("projectType")}
          >
            <option value="" disabled>
              Resort / Hotel
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Approx. Volume">
          <select
            className={fieldBase}
            value={formData.volume}
            onChange={update("volume")}
          >
            <option value="" disabled>
              Under 500 sq m
            </option>
            {VOLUMES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <Field label="City / Site">
          <input
            className={fieldBase}
            placeholder="e.g. Alibaug"
            value={formData.city}
            onChange={update("city")}
          />
        </Field>

        <Field label="Stone of Interest">
          <input
            className={fieldBase}
            placeholder="e.g. Fieldstone"
            value={formData.stoneType}
            onChange={update("stoneType")}
          />
        </Field>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="mt-1 w-full rounded-[4px] bg-[#C9A980] py-3 font-sans text-[14px] font-semibold text-[#2A2118] transition-opacity hover:opacity-90"
          >
            Get My Quote
          </button>
          <p className="mt-3 text-center font-sans text-[12px] text-[#8F8477]">
            Or call / WhatsApp directly: +91 99500 36866
          </p>
        </div>
      </form>
    </section>
  );
}