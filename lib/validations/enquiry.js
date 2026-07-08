import { z } from "zod";

export const PROJECT_TYPES = [
  "Resort / Hotel",
  "Villa / Bungalow",
  "Apartment / Township",
  "Commercial",
  "Landscape",
  "Other",
];

export const enquirySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50).trim(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid phone number"),
  projectType: z.enum(PROJECT_TYPES, { errorMap: () => ({ message: "Select a project type" }) }),
  area: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    z.number({ required_error: "Area is required", invalid_type_error: "Area must be a number" })
      .positive("Area must be greater than 0")
  ),
  city: z.string().min(2, "City is required").max(60).trim(),
  stoneType: z.string().min(2, "Stone type is required").max(60).trim(),
  website: z.string().max(0, "Bot detected").optional().default(""), // honeypot
});