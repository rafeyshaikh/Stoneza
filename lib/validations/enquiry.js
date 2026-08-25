import { z } from "zod";

export const PROJECT_TYPES = [
  "Resort / Hotel",
  "Villa / Bungalow",
  "Apartment / Township",
  "Commercial",
  "Landscape",
  "Other",
];

export const ENQUIRER_ROLES = [
  "Architect / Designer",
  "PMC / Project manager",
  "Developer / Hotel group",
  "Contractor",
  "Homeowner",
  "Dealer / Distributor",
  "Export buyer",
  "Other",
];

export const enquirySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(70, "Name cannot exceed 70 characters")
    .trim(),

  phone: z.preprocess(
    (val) => {
      if (typeof val !== "string") return val;
      let cleaned = val.trim().replace(/[\s\-\(\)]/g, "");
      if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
      else if (cleaned.startsWith("91") && cleaned.length === 12) cleaned = cleaned.slice(2);
      else if (cleaned.startsWith("0") && cleaned.length === 11) cleaned = cleaned.slice(1);
      return cleaned;
    },
    z
      .string({ required_error: "Phone number is required" })
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
  ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  role: z.preprocess(
    (val) => (!val || typeof val !== "string" || !val.trim() ? "Other" : val.trim()),
    z.enum(ENQUIRER_ROLES, { errorMap: () => ({ message: "Select a valid role" }) })
  ),

  projectType: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.enum(PROJECT_TYPES, { errorMap: () => ({ message: "Please select a project type" }) })
  ),

  area: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    z
      .number({ invalid_type_error: "Area must be a number" })
      .positive("Area must be greater than 0")
      .nullable()
      .optional()
  ),

  city: z
    .string({ required_error: "City is required" })
    .min(2, "City / Site is required")
    .max(100)
    .trim(),

  stoneType: z.preprocess(
    (val) =>
      typeof val === "string" && val.trim()
        ? val.trim()
        : "Natural Stone / General Enquiry",
    z.string().min(2, "Stone of interest is required").max(100)
  ),

  message: z
    .string()
    .max(2000, "Message cannot exceed 2000 characters")
    .optional()
    .default(""),

  website: z.string().max(0, "Bot detected").optional().default(""), // honeypot
});