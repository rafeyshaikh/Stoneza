import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import { unstable_cache } from "next/cache";
import { COMPANY_INFO } from "@/lib/constants";

const DEFAULT_CONTACT_DETAILS = {
  address: COMPANY_INFO.registeredAddress,
  displayAddress: COMPANY_INFO.displayAddress,
  phone: COMPANY_INFO.phone,
  phoneRaw: COMPANY_INFO.phoneRaw,
  whatsapp: COMPANY_INFO.whatsappUrl,
  youtube: COMPANY_INFO.socials.youtube,
  instagram: COMPANY_INFO.socials.instagram,
  facebook: COMPANY_INFO.socials.facebook,
  linkedIn: COMPANY_INFO.socials.linkedin,
  email: COMPANY_INFO.email,
  workingHours: COMPANY_INFO.workingHours,
  gstin: COMPANY_INFO.gstin,
  cin: COMPANY_INFO.cin,
  mapEmbedCode: COMPANY_INFO.mapEmbedUrl,
};

const fetchContactDetailsCached = unstable_cache(
  async () => {
    await connectDB();
    const pages = await Pages.findOne().lean();

    if (!pages || !pages.contactUs) {
      return DEFAULT_CONTACT_DETAILS;
    }

    const contact = pages.contactUs || {};
    const cards = contact.cards || {};

    const phone = cards.whatsappPhone || contact.phone || DEFAULT_CONTACT_DETAILS.phone;
    const email = cards.emailAddress || contact.email || DEFAULT_CONTACT_DETAILS.email;
    const address = cards.officeLocation || contact.address || DEFAULT_CONTACT_DETAILS.address;
    const whatsapp =
      cards.whatsappHref ||
      (cards.whatsappPhone ? `https://wa.me/${cards.whatsappPhone.replace(/\D/g, "")}` : "") ||
      contact.whatsapp ||
      DEFAULT_CONTACT_DETAILS.whatsapp;
    const workingHours = cards.workingHours || DEFAULT_CONTACT_DETAILS.workingHours;
    const mapEmbedCode = contact.location?.mapEmbedUrl || contact.mapEmbedCode || DEFAULT_CONTACT_DETAILS.mapEmbedCode;

    return {
      address,
      displayAddress: DEFAULT_CONTACT_DETAILS.displayAddress,
      phone,
      phoneRaw: phone.replace(/\s+/g, ""),
      whatsapp,
      youtube: contact.youtube || DEFAULT_CONTACT_DETAILS.youtube,
      instagram: contact.instagram || DEFAULT_CONTACT_DETAILS.instagram,
      facebook: contact.facebook || DEFAULT_CONTACT_DETAILS.facebook,
      linkedIn: contact.linkedIn || DEFAULT_CONTACT_DETAILS.linkedIn,
      email,
      workingHours,
      gstin: DEFAULT_CONTACT_DETAILS.gstin,
      cin: DEFAULT_CONTACT_DETAILS.cin,
      mapEmbedCode,
      cards: contact.cards,
      people: contact.peopleSection?.people || [],
      hero: contact.hero || {},
    };
  },
  ["contact-details-cache"],
  {
    revalidate: 86400, // 24 hours fallback
    tags: ["contact-details"],
  }
);

export const getContactDetails = async () => {
  try {
    return await fetchContactDetailsCached();
  } catch (error) {
    console.error("getContactDetails error:", error);
    return DEFAULT_CONTACT_DETAILS;
  }
};
