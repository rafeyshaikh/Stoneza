import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import { unstable_cache } from "next/cache";

const DEFAULT_CONTACT_DETAILS = {
  address: "Bhilwara, Rajasthan",
  phone: "+91 78771 08154",
  whatsapp: "https://wa.me/917877108154",
  youtube: "https://www.youtube.com/@thestoneza",
  instagram: "https://www.instagram.com/thestoneza",
  facebook: "https://www.facebook.com/thestoneza",
  email: "sales@stoneza.in",
  workingHours: "Mon–Sat, 9:30–18:30 IST",
  mapEmbedCode:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115682.49392576307!2d74.57076418854448!3d25.348612140417937!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c237a505b38d%3A0xb3cf51d8b72445b2!2sBhilwara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
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
      phone,
      whatsapp,
      youtube: contact.youtube || DEFAULT_CONTACT_DETAILS.youtube,
      instagram: contact.instagram || DEFAULT_CONTACT_DETAILS.instagram,
      facebook: contact.facebook || DEFAULT_CONTACT_DETAILS.facebook,
      email,
      workingHours,
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
