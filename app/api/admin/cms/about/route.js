import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import AboutPage from "@/models/AboutPage.model";
import { defaultAboutData } from "@/lib/defaultAboutData";

export const maxDuration = 60;

async function getOrCreateAboutDocument() {
  let doc = await AboutPage.findOne();
  if (!doc) {
    doc = await AboutPage.create(defaultAboutData);
  }
  return doc;
}

export async function GET() {
  try {
    await connectDB();
    const doc = await getOrCreateAboutDocument();
    return response(true, 200, "About page CMS content fetched successfully", doc);
  } catch (error) {
    console.error("Error fetching About page CMS data:", error);
    return response(false, 500, "Failed to fetch About page CMS content");
  }
}

export async function PATCH(request) {
  try {
    const admin = await ensureAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const body = await request.json();
    const doc = await getOrCreateAboutDocument();

    if (body.hero !== undefined) doc.hero = body.hero;
    if (body.story !== undefined) {
      doc.story = body.story;
      doc.markModified("story");
    }
    if (body.stats !== undefined) {
      doc.stats = body.stats;
      doc.markModified("stats");
    }
    if (body.founders !== undefined) {
      doc.founders = body.founders;
      doc.markModified("founders");
    }
    if (body.howWeWork !== undefined) {
      doc.howWeWork = body.howWeWork;
      doc.markModified("howWeWork");
    }
    if (body.showroom !== undefined) doc.showroom = body.showroom;
    if (body.manifesto !== undefined) doc.manifesto = body.manifesto;
    if (body.cta !== undefined) doc.cta = body.cta;

    await doc.save();

    revalidateTag("about-data");
    revalidatePath("/pages/about-us");
    revalidatePath("/about");

    return response(true, 200, "About page CMS content updated successfully", doc);
  } catch (error) {
    console.error("Error updating About page CMS content:", error);
    return response(false, 500, error?.message || "Failed to update About page CMS content");
  }
}
