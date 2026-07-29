import { connectDB } from "@/lib/databaseConnection";
import AboutPage from "@/models/AboutPage.model";
import { defaultAboutData } from "@/lib/defaultAboutData";
import { unstable_cache } from "next/cache";

export const getAboutData = unstable_cache(
  async () => {
    try {
      await connectDB();
      const doc = await AboutPage.findOne().lean();
      if (!doc) {
        return defaultAboutData;
      }
      const data = JSON.parse(JSON.stringify(doc));
      return {
        hero: data.hero || defaultAboutData.hero,
        story: data.story || defaultAboutData.story,
        stats: data.stats?.length ? data.stats : defaultAboutData.stats,
        founders: data.founders || defaultAboutData.founders,
        howWeWork: data.howWeWork || defaultAboutData.howWeWork,
        showroom: data.showroom || defaultAboutData.showroom,
        manifesto: data.manifesto || defaultAboutData.manifesto,
        cta: data.cta || defaultAboutData.cta,
      };
    } catch (error) {
      console.error("getAboutData error:", error);
      return defaultAboutData;
    }
  },
  ["about-data-cache"],
  {
    revalidate: 86400, // 24 hours
    tags: ["about-data"],
  }
);
