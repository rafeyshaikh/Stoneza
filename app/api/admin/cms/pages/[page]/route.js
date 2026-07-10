import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidateTag } from "next/cache";

import Pages from "@/models/Pages.model";

const ALLOWED_PAGES = [
  "aboutUs",
  "contactUs",
  "privacyPolicy",
  "termsAndConditions",
];

async function getOrCreatePagesDocument() {
  let pages = await Pages.findOne();

  if (!pages) {
    pages = await Pages.create({
      aboutUs: {
        title: "About Us",
        content: "",
        images: [],
      },

      contactUs: {
        address: "",
        phone: "",
        email: "",
        mapEmbedCode: "",
      },

      privacyPolicy: {
        title: "Privacy Policy",
        content: "",
      },

      termsAndConditions: {
        title: "Terms & Conditions",
        content: "",
      },
    });
  }

  return pages;
}

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { page } = await params;

    if (!ALLOWED_PAGES.includes(page)) {
      return response(false, 404, "Invalid page");
    }

    const pages = await getOrCreatePagesDocument();

    return response(
      true,
      200,
      `${page} fetched successfully`,
      pages[page]
    );
  } catch (error) {
    console.error(error);

    return response(
      false,
      500,
      "Failed to fetch page"
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await ensureAdminApi();

    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();

    const { page } = await params;

    if (!ALLOWED_PAGES.includes(page)) {
      return response(false, 404, "Invalid page");
    }

    const body = await req.json();

    const pages = await getOrCreatePagesDocument();

    pages[page] = body;

    await pages.save();

    if (page === "contactUs") {
      revalidateTag("contact-details");
    }

    return response(
      true,
      200,
      `${page} updated successfully`,
      pages[page]
    );
  } catch (error) {
    console.error(error);

    return response(
      false,
      500,
      "Failed to update page"
    );
  }
}