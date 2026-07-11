import { connectDB } from "@/lib/databaseConnection";
import Pages from "@/models/Pages.model";
import { unstable_cache } from "next/cache";

export const getContactDetails = unstable_cache(
  async () => {
    try {
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
  },
  ["contact-details-cache"],
  {
    revalidate: 86400, // 24 hours fallback
    tags: ["contact-details"],
  }
);
