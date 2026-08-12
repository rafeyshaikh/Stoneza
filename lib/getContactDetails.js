import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import { unstable_cache } from "next/cache";

const fetchContactDetailsCached = unstable_cache(
  async () => {
    await connectDB();
    const pages = await Pages.findOne().lean();

    if (!pages || !pages.contactUs) {
      return {
        address: "",
        phone: "",
        whatsapp: "",
        youtube: "",
        instagram: "",
        facebook: "",
        email: "",
        mapEmbedCode: "",
      };
    }

    return {
      address: pages.contactUs.address || "",
      phone: pages.contactUs.phone || "",
      whatsapp: pages.contactUs.whatsapp || "",
      youtube: pages.contactUs.youtube || "",
      instagram: pages.contactUs.instagram || "",
      facebook: pages.contactUs.facebook || "",
      email: pages.contactUs.email || "",
      mapEmbedCode: pages.contactUs.mapEmbedCode || "",
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
    return {
      address: "",
      phone: "",
      whatsapp: "",
      youtube: "",
      instagram: "",
      facebook: "",
      email: "",
      mapEmbedCode: "",
    };
  }
};
