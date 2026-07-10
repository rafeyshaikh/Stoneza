"use client";
import { useState } from "react";
import { enquirySchema, PROJECT_TYPES } from "@/lib/validations/enquiry"; // adjust path

const BULLETS = [
  "Factory-direct bulk pricing",
  "Free material samples to your site or studio",
  "Custom sizes, thickness & finishes",
  "Dedicated consultant for the whole project",
];

function Field({ label, children, error }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#9C8D79]">
        {label}
      </span>
      {children}
      {error && (
        <span className="font-sans text-[11.5px] text-[#E29578]">{error}</span>
      )}
    </div>
  );
}

const fieldBase =
  "w-full rounded-[4px] border border-[#54493F] bg-[#3B3530] px-3.5 py-[11px] text-[13.5px] leading-none text-[#EDE8E1] placeholder:text-[#8A7F73] outline-none transition-colors focus:border-[#B49A75] appearance-none";

export default function EnquiryForm({ initialStoneType = "", compact = false }) {
  const getInitialState = () => ({
    name: "",
    phone: "",
    projectType: "",
    area: "",
    city: "",
    stoneType: initialStoneType || "",
    website: "", // honeypot, must stay empty
  });

  const [formData, setFormData] = useState(getInitialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState("");

  const update = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerMessage("");

    const result = enquirySchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        setServerMessage(data.message || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData(getInitialState());
    } catch (err) {
      setServerMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (compact) {
    if (status === "success") {
      return (
        <div className="text-center py-8 text-[#F5F1EA]">
          <h2 className="font-serif text-[24px] text-[#F5F1EA]">Thank you!</h2>
          <p className="mt-3 font-sans text-[14px] text-[#B7AC9E]">
            A Stoneza consultant will reach out shortly with pricing and samples.
          </p>
        </div>
      );
    }

    return (
      <form
        className="grid gap-x-5 gap-y-5 rounded-[6px] border border-[#4A413A] bg-[#28221D] p-5 md:grid-cols-2 md:p-6 text-[#F5F1EA]"
        onSubmit={onSubmit}
        noValidate
      >
        {/* Honeypot — hidden from real users, off-screen not display:none */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={update("website")}
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        <Field label="Name" error={errors.name?.[0]}>
          <input
            className={fieldBase}
            placeholder="Your name"
            value={formData.name}
            onChange={update("name")}
          />
        </Field>

        <Field label="Phone / WhatsApp" error={errors.phone?.[0]}>
          <input
            className={fieldBase}
            placeholder="+91"
            value={formData.phone}
            onChange={update("phone")}
          />
        </Field>

        <Field label="Project Type" error={errors.projectType?.[0]}>
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

        <Field label="Approx. Area (sq m)" error={errors.area?.[0]}>
          <input
            type="number"
            className={`${fieldBase} no-spinner`}
            placeholder="e.g. 500"
            value={formData.area}
            onChange={update("area")}
          />
        </Field>

        <Field label="City / Site" error={errors.city?.[0]}>
          <input
            className={fieldBase}
            placeholder="e.g. Alibaug"
            value={formData.city}
            onChange={update("city")}
          />
        </Field>

        <Field label="Stone of Interest" error={errors.stoneType?.[0]}>
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
            disabled={status === "submitting"}
            className="mt-1 w-full rounded-[4px] bg-[#C9A980] py-3 font-sans text-[14px] font-semibold text-[#2A2118] transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {status === "submitting" ? "Submitting..." : "Get My Quote"}
          </button>

          {status === "error" && serverMessage && (
            <p className="mt-3 text-center font-sans text-[12.5px] text-[#E29578]">
              {serverMessage}
            </p>
          )}

          <p className="mt-3 text-center font-sans text-[12px] text-[#8F8477]">
            Or call / WhatsApp directly: +91 99500 36866
          </p>
        </div>
      </form>
    );
  }

  if (status === "success") {
    return (
      <section id="enquiry-form" className="mx-auto max-w-[648px] rounded-[6px] bg-gradient-to-b from-[#2A2420] to-[#211C18] px-6 py-10 text-center text-[#F5F1EA] scroll-mt-20 lg:scroll-mt-32">
        <h2 className="font-serif text-[24px] text-[#F5F1EA]">Thank you!</h2>
        <p className="mt-3 font-sans text-[14px] text-[#B7AC9E]">
          A Stoneza consultant will reach out shortly with pricing and samples.
        </p>
      </section>
    );
  }

  return (
    <section id="enquiry-form" className="mx-auto mt-15 lg:mt-2 max-w-[648px] md:max-w-[860px] lg:max-w-[1350px] md:rounded-[6px] bg-gradient-to-b from-[#2A2420] to-[#211C18] px-6 py-8 text-[#F5F1EA] md:px-10 md:py-10 lg:flex lg:justify-between lg:px-12 lg:py-12 scroll-mt-20 lg:scroll-mt-32">
      <div className="basis-5/11">
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
      </div>

      <div className="mt-8 lg:mt-0 lg:max-w-[600px] basis-6/11">
        <form
          className="mt-7 grid gap-x-5 gap-y-5 rounded-[6px] border border-[#4A413A] bg-[#28221D] p-5 md:grid-cols-2 md:p-6"
          onSubmit={onSubmit}
          noValidate
        >
          {/* Honeypot — hidden from real users, off-screen not display:none */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={update("website")}
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <Field label="Name" error={errors.name?.[0]}>
            <input
              className={fieldBase}
              placeholder="Your name"
              value={formData.name}
              onChange={update("name")}
            />
          </Field>

          <Field label="Phone / WhatsApp" error={errors.phone?.[0]}>
            <input
              className={fieldBase}
              placeholder="+91"
              value={formData.phone}
              onChange={update("phone")}
            />
          </Field>

          <Field label="Project Type" error={errors.projectType?.[0]}>
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

          <Field label="Approx. Area (sq m)" error={errors.area?.[0]}>
            <input
              type="number"
              className={`${fieldBase} no-spinner`}
              placeholder="e.g. 500"
              value={formData.area}
              onChange={update("area")}
            />
          </Field>

          <Field label="City / Site" error={errors.city?.[0]}>
            <input
              className={fieldBase}
              placeholder="e.g. Alibaug"
              value={formData.city}
              onChange={update("city")}
            />
          </Field>

          <Field label="Stone of Interest" error={errors.stoneType?.[0]}>
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
              disabled={status === "submitting"}
              className="mt-1 w-full rounded-[4px] bg-[#C9A980] py-3 font-sans text-[14px] font-semibold text-[#2A2118] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "submitting" ? "Submitting..." : "Get My Quote"}
            </button>

            {status === "error" && serverMessage && (
              <p className="mt-3 text-center font-sans text-[12.5px] text-[#E29578]">
                {serverMessage}
              </p>
            )}

            <p className="mt-3 text-center font-sans text-[12px] text-[#8F8477]">
              Or call / WhatsApp directly: +91 99500 36866
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}