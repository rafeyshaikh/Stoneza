import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
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
    console.error(`Error fetching page ${params?.page}:`, error);

    return response(
      false,
      500,
      "Failed to fetch page"
    );
  }
}
