import { connectDB } from "@/lib/databaseConnection";
import { ensureAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import { revalidateTag } from "next/cache";
import { COMPANY_INFO } from "@/lib/constants";

import Pages from "@/models/Pages.model";

const ALLOWED_PAGES = [
  "contactUs",
  "collectionsOverview",
  "privacyPolicy",
  "termsAndConditions",
  "termsOfSupply",
  "disclaimer",
  "returnPolicy",
];

async function getOrCreatePagesDocument() {
  let pages = await Pages.findOne();

  if (!pages) {
    pages = await Pages.create({
      contactUs: {
        legal: {
          legalEntity: COMPANY_INFO.legalEntity,
          tradeName: COMPANY_INFO.tradeName,
          cin: COMPANY_INFO.cin,
          gstin: COMPANY_INFO.gstin,
          registeredAddress: COMPANY_INFO.registeredAddress,
          displayAddress: COMPANY_INFO.displayAddress,
        },
        cards: {
          whatsappPhone: COMPANY_INFO.phone,
          whatsappHref: COMPANY_INFO.whatsappUrl,
          emailAddress: COMPANY_INFO.email,
          officeLocation: COMPANY_INFO.registeredAddress,
          workingHours: COMPANY_INFO.workingHours,
          gstin: COMPANY_INFO.gstin,
          cin: COMPANY_INFO.cin,
        },
        socials: {
          instagram: COMPANY_INFO.socials.instagram,
          facebook: COMPANY_INFO.socials.facebook,
          youtube: COMPANY_INFO.socials.youtube,
          linkedin: COMPANY_INFO.socials.linkedin,
        },
        location: {
          mapEmbedUrl: COMPANY_INFO.mapEmbedUrl,
        },
        address: COMPANY_INFO.registeredAddress,
        phone: COMPANY_INFO.phone,
        whatsapp: COMPANY_INFO.whatsappUrl,
        youtube: COMPANY_INFO.socials.youtube,
        instagram: COMPANY_INFO.socials.instagram,
        facebook: COMPANY_INFO.socials.facebook,
        linkedIn: COMPANY_INFO.socials.linkedin,
        email: COMPANY_INFO.email,
        gstin: COMPANY_INFO.gstin,
        cin: COMPANY_INFO.cin,
        registeredAddress: COMPANY_INFO.registeredAddress,
        mapEmbedCode: COMPANY_INFO.mapEmbedUrl,
      },

      privacyPolicy: {
        title: "Privacy Policy",
        content: "",
      },

      termsAndConditions: {
        title: "Terms & Conditions",
        content: "",
      },

      termsOfSupply: {
        title: "Terms of Supply",
        content: "",
      },

      disclaimer: {
        title: "Disclaimer",
        content: "",
      },

      returnPolicy: {
        title: "Return Policy",
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

    if (page === "contactUs" && pages.contactUs) {
      return response(true, 200, `${page} fetched successfully`, pages.contactUs);
    }

    const pageData = pages[page] || {
      title: page === "disclaimer" ? "Disclaimer" : page === "returnPolicy" ? "Return Policy" : "",
      content: ""
    };

    return response(
      true,
      200,
      `${page} fetched successfully`,
      pageData
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