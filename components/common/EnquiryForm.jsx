"use client";
import { useState } from "react";
import { enquirySchema, PROJECT_TYPES, ENQUIRER_ROLES } from "@/lib/validations/enquiry";
import { useContact } from "@/context/ContactContext";

import { Package, Ruler, ShieldCheck, UserCheck, Phone, Mail, MessageSquare, Clock } from "lucide-react";

const VALUE_PILLARS = [
  {
    icon: Package,
    title: "Free Sample Box",
    desc: "Physical cut stone swatches dispatched to your studio or site in 48 hours.",
  },
  {
    icon: Ruler,
    title: "Custom Cut & Sizes",
    desc: "Calibrated thickness, bespoke project schedules, and architectural edges.",
  },
  {
    icon: ShieldCheck,
    title: "Quarry-Direct Supply",
    desc: "Zero middle layers. Batch inspection & dry-lay crate photos before dispatch.",
  },
  {
    icon: UserCheck,
    title: "Dedicated Specialist",
    desc: "Single point of contact from drawing review to doorstep site delivery.",
  },
];

const STATS = [
  { value: "48h", label: "Sample Dispatch" },
  { value: "150+", label: "Quarried Formats" },
  { value: "100%", label: "Calibrated & Checked" },
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
  const { contactDetails } = useContact();
  const phone = contactDetails?.phone || "";
  const whatsapp = contactDetails?.whatsapp || contactDetails?.phone || "";
  const email = contactDetails?.email || "";

  const getInitialState = () => ({
    name: "",
    phone: "",
    email: "",
    role: "",
    projectType: "",
    area: "",
    city: "",
    stoneType: initialStoneType || "",
    message: "",
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

        <Field label="Email Address (Optional)" error={errors.email?.[0]}>
          <input
            type="email"
            className={fieldBase}
            placeholder="you@example.com"
            value={formData.email}
            onChange={update("email")}
          />
        </Field>

        <Field label="Your Role" error={errors.role?.[0]}>
          <select
            className={fieldBase}
            value={formData.role}
            onChange={update("role")}
          >
            <option value="" disabled>
              Select your role
            </option>
            {ENQUIRER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
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
          <Field label="Message / Project Details (Optional)" error={errors.message?.[0]}>
            <textarea
              rows={3}
              className={`${fieldBase} resize-y min-h-[72px] leading-relaxed`}
              placeholder="Tell us about specific sizes, textures, quantities, or timelines..."
              value={formData.message}
              onChange={update("message")}
            />
          </Field>
        </div>

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

          {(phone || whatsapp) && (
            <p className="mt-3 text-center font-sans text-[12px] text-[#8F8477]">
              Or call / WhatsApp directly:{" "}
              <a
                href={`tel:${(phone || whatsapp).replace(/\s+/g, "")}`}
                className="hover:underline text-[#D7CFC4]"
              >
                {phone || whatsapp}
              </a>
            </p>
          )}
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
    <section id="enquiry-form" className="mx-auto mt-15 lg:mt-2 max-w-[648px] md:max-w-[860px] lg:max-w-[1350px] md:rounded-[6px] bg-gradient-to-b from-[#2A2420] to-[#211C18] px-6 py-8 text-[#F5F1EA] md:px-10 md:py-10 lg:flex lg:items-stretch lg:gap-10 xl:gap-14 lg:px-12 lg:py-12 scroll-mt-20 lg:scroll-mt-32">
      {/* Left Column: Detailed Value Propositions & Direct Contact */}
      <div className="lg:w-1/2 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#3B3530] border border-[#54493F] text-[#C9A980] text-[10px] font-sans font-semibold uppercase tracking-[0.18em] mb-3">
            <Clock className="size-3 text-[#C9A980]" />
            <span>Procurement & Project Consultation</span>
          </div>

          <h1 className="font-serif text-[26px] md:text-[30px] xl:text-[34px] leading-[1.2] tracking-tight text-[#F5F1EA]">
            Tell us the project. Get a{" "}
            <span className="italic font-serif text-[#C9A980]">real</span> quote.
          </h1>

          <p className="mt-2.5 font-sans text-[13.5px] leading-[1.6] text-[#B7AC9E]">
            Direct quarry extraction, calibrated processing, and architectural consultation. 
            Share your project parameters to receive factory-direct estimates and physical sample boxes.
          </p>

          {/* Value Pillars 2x2 Grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {VALUE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-[4px] bg-[#2E2823]/80 border border-[#4A413A]/60 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="size-3.5 text-[#C9A980] shrink-0" />
                    <h3 className="font-sans text-[12.5px] font-semibold text-[#EDE8E1] leading-tight">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="font-sans text-[11.5px] leading-[1.45] text-[#A69B8D]">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 py-3 border-y border-[#4A413A]/60">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <span className="block font-serif text-[17px] md:text-[19px] font-semibold text-[#C9A980] leading-tight">
                  {stat.value}
                </span>
                <span className="block font-sans text-[10px] text-[#A69B8D] uppercase tracking-[0.06em] mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Banner */}
        {(phone || whatsapp || email) && (
          <div className="mt-5 pt-4 border-t border-[#4A413A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9C8D79]">
                Prefer Direct Discussion?
              </p>
              <p className="font-sans text-[12px] text-[#D7CFC4] mt-0.5">
                Speak directly with our stone specialist
              </p>
            </div>
            <div className="flex items-center gap-2">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#3B3530] hover:bg-[#4A413A] text-[#EDE8E1] text-[11.5px] font-medium transition-colors border border-[#54493F]"
                  title="Call directly"
                >
                  <Phone className="size-3 text-[#C9A980]" />
                  <span>Call</span>
                </a>
              )}
              {(whatsapp || phone) && (
                <a
                  href={`https://wa.me/91${(whatsapp || phone).replace(/\D/g, "").replace(/^91/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#1E3A2F] hover:bg-[#254A3B] text-[#D1FAE5] text-[11.5px] font-medium transition-colors border border-[#059669]/40"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="size-3 text-[#34D399]" />
                  <span>WhatsApp</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#3B3530] hover:bg-[#4A413A] text-[#EDE8E1] text-[11.5px] font-medium transition-colors border border-[#54493F]"
                  title="Send email"
                >
                  <Mail className="size-3 text-[#C9A980]" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Form */}
      <div className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col">
        <form
          className="mt-7 lg:mt-0 grid gap-x-5 gap-y-5 rounded-[6px] border border-[#4A413A] bg-[#28221D] p-5 md:grid-cols-2 md:p-6"
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

          <Field label="Email Address (Optional)" error={errors.email?.[0]}>
            <input
              type="email"
              className={fieldBase}
              placeholder="you@example.com"
              value={formData.email}
              onChange={update("email")}
            />
          </Field>

          <Field label="Your Role" error={errors.role?.[0]}>
            <select
              className={fieldBase}
              value={formData.role}
              onChange={update("role")}
            >
              <option value="" disabled>
                Select your role
              </option>
              {ENQUIRER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
            <Field label="Message / Project Details (Optional)" error={errors.message?.[0]}>
              <textarea
                rows={3}
                className={`${fieldBase} resize-y min-h-[72px] leading-relaxed`}
                placeholder="Tell us about specific sizes, textures, quantities, or timelines..."
                value={formData.message}
                onChange={update("message")}
              />
            </Field>
          </div>

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

            {(phone || whatsapp) && (
              <p className="mt-3 text-center font-sans text-[12px] text-[#8F8477]">
                Or call / WhatsApp directly:{" "}
                <a
                  href={`tel:${(phone || whatsapp).replace(/\s+/g, "")}`}
                  className="hover:underline text-[#D7CFC4]"
                >
                  {phone || whatsapp}
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}