import { getBaseUrl, stripHtml } from "./resolveMetadata.js";

/**
 * Validates whether a JSON string is syntactically valid JSON.
 * Returns { valid: boolean, error: string | null, parsed: object | null }
 */
export function validateJsonLdString(jsonString) {
  if (!jsonString || typeof jsonString !== "string" || !jsonString.trim()) {
    return { valid: false, error: "JSON-LD string is empty", parsed: null };
  }
  try {
    const parsed = JSON.parse(jsonString.trim());
    if (!parsed || (typeof parsed !== "object" && !Array.isArray(parsed))) {
      return { valid: false, error: "JSON-LD must be a JSON object or array", parsed: null };
    }
    return { valid: true, error: null, parsed };
  } catch (err) {
    return { valid: false, error: err.message || "Invalid JSON syntax", parsed: null };
  }
}

/**
 * Generates BreadcrumbList schema from item list.
 * items: Array<{ name: string, path: string }>
 */
export function generateBreadcrumbSchema(items = [], options = {}) {
  const baseUrl = options.baseUrl || getBaseUrl();
  const itemListElement = items.map((item, index) => {
    const itemUrl = item.path.startsWith("http")
      ? item.path
      : `${baseUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`;
    return {
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: itemUrl,
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Generates structured data for a Product page.
 */
export function generateProductSchema(product, options = {}) {
  if (!product) return null;
  const baseUrl = options.baseUrl || getBaseUrl();
  const productUrl = `${baseUrl}/product/${product.slug}`;

  // Extract all valid image URLs
  const images = (product.images || [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  const description =
    product.seo?.metaDescription?.trim() ||
    product.shortDescription?.trim() ||
    stripHtml(product.description || "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description || undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.sku || undefined,
    mpn: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "Stoneza",
    },
    material: product.stoneDetails?.stoneType || undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: "0",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/InvoicePrice",
        description: "Project-based pricing • Quotation on request",
      },
      availability:
        product.status === "published"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Stoneza",
      },
    },
  };

  // Optional category/collection naming
  if (product.categoryName || product.category?.name) {
    schema.category = product.categoryName || product.category?.name;
  }

  // Optional FAQs schema
  let faqSchema = null;
  if (Array.isArray(product.faqs) && product.faqs.length > 0) {
    const validFaqs = product.faqs.filter((f) => f?.question?.trim() && f?.answer?.trim());
    if (validFaqs.length > 0) {
      faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: validFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question.trim(),
          acceptedAnswer: {
            "@type": "Answer",
            text: stripHtml(faq.answer),
          },
        })),
      };
    }
  }

  // Breadcrumbs
  const breadcrumbItems = [{ name: "Home", path: "/" }];
  if (product.categoryName && product.categorySlug) {
    breadcrumbItems.push({
      name: product.categoryName,
      path: `/product-category/${product.categorySlug}`,
    });
  } else if (product.collectionName && product.collectionSlug) {
    breadcrumbItems.push({
      name: product.collectionName,
      path: `/collections/${product.collectionSlug}`,
    });
  }
  breadcrumbItems.push({ name: product.name, path: `/product/${product.slug}` });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, { baseUrl });

  const schemas = [schema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);
  return schemas;
}

/**
 * Generates structured data for a Category page.
 */
export function generateCategorySchema(category, options = {}) {
  if (!category) return null;
  const baseUrl = options.baseUrl || getBaseUrl();
  const categoryUrl = `${baseUrl}/product-category/${category.slug}`;

  const description =
    category.seo?.metaDescription?.trim() ||
    stripHtml(category.description || "") ||
    `Explore quarry-direct ${category.name} natural stone surfaces by Stoneza.`;

  const bannerUrl =
    category.bannerImage?.square?.url ||
    category.bannerImage?.wide?.url ||
    (Array.isArray(category.bannerImage?.wide) && category.bannerImage.wide[0]?.url) ||
    category.seo?.ogImage ||
    undefined;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Natural Stone`,
    description,
    url: categoryUrl,
    image: bannerUrl,
    publisher: {
      "@type": "Organization",
      name: "Stoneza",
      url: baseUrl,
    },
  };

  const breadcrumbItems = [{ name: "Home", path: "/" }];
  if (options.parentCategory?.name && options.parentCategory?.slug) {
    breadcrumbItems.push({
      name: options.parentCategory.name,
      path: `/product-category/${options.parentCategory.slug}`,
    });
  }
  breadcrumbItems.push({ name: category.name, path: `/product-category/${category.slug}` });
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, { baseUrl });

  return [collectionPageSchema, breadcrumbSchema];
}

/**
 * Generates structured data for a Collection page.
 */
export function generateCollectionSchema(collection, options = {}) {
  if (!collection) return null;
  const baseUrl = options.baseUrl || getBaseUrl();
  const collectionUrl = `${baseUrl}/collections/${collection.slug}`;

  const description =
    collection.seo?.metaDescription?.trim() ||
    stripHtml(collection.description || "") ||
    `Explore our premium ${collection.name} collection of architectural natural stones at Stoneza.`;

  const bannerUrl =
    collection.bannerImage?.square?.url ||
    (Array.isArray(collection.bannerImage?.wide) && collection.bannerImage.wide[0]?.url) ||
    collection.seo?.ogImage ||
    undefined;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.name} Collection`,
    description,
    url: collectionUrl,
    image: bannerUrl,
    publisher: {
      "@type": "Organization",
      name: "Stoneza",
      url: baseUrl,
    },
  };

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: collection.name, path: `/collections/${collection.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, { baseUrl });

  return [collectionPageSchema, breadcrumbSchema];
}

/**
 * Generates structured data for Collections Overview (/collections).
 */
export function generateCollectionsOverviewSchema(options = {}) {
  const baseUrl = options.baseUrl || getBaseUrl();
  const url = `${baseUrl}/collections`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stoneza Natural Stone Collections",
    description: "Twelve named natural stone collections for architectural facades, landscaping, and interiors.",
    url,
    publisher: {
      "@type": "Organization",
      name: "Stoneza",
      url: baseUrl,
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Collections", path: "/collections" },
    ],
    { baseUrl }
  );

  return [schema, breadcrumbSchema];
}

/**
 * Generates structured data for About Us (/about-us).
 */
export function generateAboutSchema(aboutData, options = {}) {
  const baseUrl = options.baseUrl || getBaseUrl();
  const url = `${baseUrl}/about-us`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Stoneza — Quarrying & Heritage Since 1992",
    description:
      aboutData?.story?.lead ||
      "Three generations of quarrying Bijolia sandstone, Kota stone & Asind granite with in-house processing in Bhilwara, Rajasthan.",
    url,
    mainEntity: {
      "@type": "Organization",
      name: "Stoneza",
      legalName: "Anantay Exports Pvt. Ltd.",
      foundingDate: "1992",
      url: baseUrl,
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about-us" },
    ],
    { baseUrl }
  );

  return [schema, breadcrumbSchema];
}

/**
 * Generates structured data for Contact Us (/contact).
 */
export function generateContactSchema(contactData, options = {}) {
  const baseUrl = options.baseUrl || getBaseUrl();
  const url = `${baseUrl}/contact`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Stoneza Natural Stone",
    description: "Contact Stoneza for quarry-direct natural stone quotations, samples, and architectural specification.",
    url,
    mainEntity: {
      "@type": "Organization",
      name: "Stoneza",
      telephone: contactData?.cards?.whatsappPhone || "+91 78771 08154",
      email: contactData?.cards?.emailAddress || "sales@stoneza.in",
      address: {
        "@type": "PostalAddress",
        streetAddress: contactData?.cards?.officeLocation || "F-124, RIICO Growth Centre, Hamirgarh",
        addressLocality: "Bhilwara",
        addressRegion: "Rajasthan",
        postalCode: "311025",
        addressCountry: "IN",
      },
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Contact Us", path: "/contact" },
    ],
    { baseUrl }
  );

  return [schema, breadcrumbSchema];
}

/**
 * Generates structured data for CMS WebPages (e.g. Privacy Policy, Terms, etc.)
 */
export function generateWebPageSchema(pageData, options = {}) {
  const baseUrl = options.baseUrl || getBaseUrl();
  const path = options.path || "/";
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const title = pageData?.title || options.defaultTitle || "Stoneza";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: pageData?.seo?.metaDescription || `Read ${title} from Stoneza Natural Stone.`,
    url,
    publisher: {
      "@type": "Organization",
      name: "Stoneza",
      url: baseUrl,
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: title, path },
    ],
    { baseUrl }
  );

  return [schema, breadcrumbSchema];
}

/**
 * Generates global WebSite + Organization structured data (with SearchAction potentialAction).
 */
export function generateWebsiteSchema(seoData = {}, options = {}) {
  const baseUrl = options.baseUrl || getBaseUrl();
  const orgName = seoData?.organizationName || "Stoneza";
  const orgLegalName = seoData?.organizationLegalName || "Stoneza Surfaces LLP";
  const orgLogo = seoData?.organizationLogo || `${baseUrl}/assets/logo.png`;
  const orgPhone = seoData?.organizationPhone || "+91 78771 08154";
  const orgEmail = seoData?.organizationEmail || "sales@stoneza.in";
  const socialProfiles = seoData?.socialProfiles || [];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoData?.metaTitle || "Stoneza | Natural Stone Manufacturer & Exporter",
    url: baseUrl,
    description: seoData?.metaDescription || "Quarry-direct natural stone manufacturer and exporter in India since 1992.",
    publisher: {
      "@type": "Organization",
      name: orgName,
      legalName: orgLegalName,
      url: baseUrl,
      logo: orgLogo || undefined,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: orgPhone,
        contactType: "sales",
        email: orgEmail,
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: socialProfiles.length > 0 ? socialProfiles : undefined,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/product?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgName,
    legalName: orgLegalName,
    url: baseUrl,
    logo: orgLogo || undefined,
    telephone: orgPhone,
    email: orgEmail,
    sameAs: socialProfiles.length > 0 ? socialProfiles : undefined,
  };

  return [websiteSchema, organizationSchema];
}

/**
 * High-level unified helper to resolve structured data for any entity.
 * Handles custom JSON-LD override if enabled and valid, with automatic fallback.
 */
export function resolveStructuredData({
  entityType = "page",
  entity = null,
  seo = null,
  options = {},
}) {
  const seoData = seo || entity?.seo || entity || {};

  // Check if Custom JSON-LD is enabled and valid
  if (seoData.enableCustomJsonLd && seoData.customJsonLd?.trim()) {
    const { valid, parsed, error } = validateJsonLdString(seoData.customJsonLd);
    if (valid && parsed) {
      return parsed;
    }
    console.warn("Invalid custom JSON-LD specified, falling back to auto-generated schema:", error);
  }

  // Automatic Generation by entity type
  switch (entityType) {
    case "product":
      return generateProductSchema(entity, options);
    case "category":
      return generateCategorySchema(entity, options);
    case "collection":
      return generateCollectionSchema(entity, options);
    case "collectionsOverview":
      return generateCollectionsOverviewSchema(options);
    case "about":
      return generateAboutSchema(entity, options);
    case "contact":
      return generateContactSchema(entity, options);
    case "home":
    case "website":
    case "global":
      return generateWebsiteSchema(seoData, options);
    case "page":
    default:
      return generateWebPageSchema(entity, options);
  }
}
