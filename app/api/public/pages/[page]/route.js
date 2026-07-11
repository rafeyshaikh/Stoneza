import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Pages from "@/models/Pages.model";

const ALLOWED_PAGES = [
  "aboutUs",
  "contactUs",
  "privacyPolicy",
  "termsAndConditions",
  "disclaimer",
  "returnPolicy",
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
        whatsapp: "",
        youtube: "",
        instagram: "",
        facebook: "",
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
      const contactData = pages.contactUs;
      return response(true, 200, `${page} fetched successfully`, {
        address: contactData.address || "",
        phone: contactData.phone || "",
        whatsapp: contactData.whatsapp || "",
        youtube: contactData.youtube || "",
        instagram: contactData.instagram || "",
        facebook: contactData.facebook || "",
        email: contactData.email || "",
        mapEmbedCode: contactData.mapEmbedCode || "",
      });
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
    console.error(`Error fetching page ${params?.page}:`, error);

    return response(
      false,
      500,
      "Failed to fetch page"
    );
  }
}
