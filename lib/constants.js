/**
 * Central constants and single source of truth for Stoneza contact, brand, and legal details.
 */
export const COMPANY_INFO = {
  brandName: "Stoneza",
  legalEntity: "Anantay Exports Pvt. Ltd.",
  tradeName: "trading as Stoneza",
  tagline: "Quarry-direct natural stone manufacturer and exporter",
  foundedYear: "1992",

  // Contact Details
  phone: "+91 78771 08154",
  phoneRaw: "+917877108154",
  email: "sales@stoneza.in",
  whatsappNumber: "+91 78771 08154",
  whatsappUrl: "https://wa.me/917877108154",
  workingHours: "Mon–Sat, 9:30–18:30 IST",

  // Registered Address & Identification
  registeredAddress: "F-124, RIICO Growth Centre, Hamirgarh, Bhilwara, Rajasthan — 311025, India",
  displayAddress: "Bhilwara, Rajasthan — 311025",
  city: "Bhilwara",
  state: "Rajasthan",
  pincode: "311025",
  country: "India",
  cin: "U14100RJ2021PTC076892",
  gstin: "08AAWCA2095G1Z9",

  // Social Links
  socials: {
    instagram: "https://www.instagram.com/thestoneza",
    facebook: "https://www.facebook.com/thestoneza",
    youtube: "https://www.youtube.com/@thestoneza",
    linkedin: "https://www.linkedin.com/company/thestoneza",
  },

  // Map Coordinates & Embed
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115682.49392576307!2d74.57076418854448!3d25.348612140417937!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c237a505b38d%3A0xb3cf51d8b72445b2!2sBhilwara%2C%20Rajasthan%20311001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",

  // Core Stone Families
  stoneFamilies: [
    { label: "Sandstone", query: "sandstone", href: "/product?stoneType=sandstone" },
    { label: "Limestone (Kota)", query: "limestone", href: "/product?stoneType=limestone" },
    { label: "Granite", query: "granite", href: "/product?stoneType=granite" },
    { label: "Basalt", query: "basalt", href: "/product?stoneType=basalt" },
    { label: "Slate", query: "slate", href: "/product?stoneType=slate" },
  ],
};
