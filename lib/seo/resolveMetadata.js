/**
 * Central SEO Metadata Resolver for Next.js App Router.
 * Resolves standard Next.js Metadata objects with strict hierarchical fallbacks.
 */

const DEFAULT_SITE_NAME = "Stoneza";
const DEFAULT_FALLBACK_IMAGE =
  "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

/**
 * Strips HTML tags and normalizes whitespace for text snippets.
 */
export function stripHtml(str = "") {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Resolves base URL for the site without trailing slash.
 */
export function getBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://stoneza.in";
  return url.replace(/\/+$/, "");
}

/**
 * Extracts a valid primary image URL from an entity or image field.
 */
export function extractEntityPrimaryImage(entity) {
  if (!entity) return "";

  // 1. Direct image string
  if (typeof entity.image === "string" && entity.image) return entity.image;
  if (entity.image?.url) return entity.image.url;

  // 2. Images array (e.g. Products, Projects)
  if (Array.isArray(entity.images) && entity.images.length > 0) {
    const first = entity.images[0];
    if (typeof first === "string" && first) return first;
    if (first?.url) return first.url;
  }

  // 3. BannerImage (e.g. Categories, Collections)
  if (entity.bannerImage) {
    if (typeof entity.bannerImage === "string") return entity.bannerImage;
    if (entity.bannerImage?.square?.url) return entity.bannerImage.square.url;
    if (entity.bannerImage?.wide?.url) return entity.bannerImage.wide.url;
    if (Array.isArray(entity.bannerImage?.wide) && entity.bannerImage.wide[0]?.url) {
      return entity.bannerImage.wide[0].url;
    }
    if (entity.bannerImage?.url) return entity.bannerImage.url;
  }

  // 4. Hero image
  if (entity.hero?.image?.url) return entity.hero.image.url;
  if (typeof entity.hero?.image === "string") return entity.hero.image;
  if (entity.hero?.bgImage) return entity.hero.bgImage;

  return "";
}

/**
 * Resolve full metadata object for Next.js App Router generateMetadata().
 *
 * @param {Object} params
 * @param {string} params.entityType - 'product' | 'category' | 'collection' | 'page' | 'blog' | 'project'
 * @param {Object} [params.entity] - The raw database document or entity object
 * @param {Object} [params.seo] - Explicit SEO subdocument (defaults to entity.seo if available)
 * @param {string} [params.path] - Relative public route path, e.g. '/product/stone-slate'
 * @param {Object} [params.globalSeo] - Optional Global SEO document from Seo.model
 * @param {string} [params.defaultTitle] - Entity-specific default title fallback
 * @param {string} [params.defaultDescription] - Entity-specific default description fallback
 * @param {string} [params.defaultImage] - Entity-specific default image fallback
 * @returns {import('next').Metadata}
 */
export function resolveEntityMetadata({
  entityType = "page",
  entity = {},
  seo = null,
  path = "",
  globalSeo = null,
  defaultTitle = "",
  defaultDescription = "",
  defaultImage = "",
}) {
  const seoData = seo || entity?.seo || {};
  const baseUrl = getBaseUrl();

  // 1. Resolve Path and Canonical URL
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const autoCanonicalUrl = `${baseUrl}${normalizedPath === "/" ? "" : normalizedPath}`;
  const canonicalUrl = seoData.canonicalUrl?.trim() || autoCanonicalUrl;

  // 2. Resolve Title
  const entityName =
    entity?.name || entity?.title || defaultTitle || "Natural Stone";
  let title = seoData.metaTitle?.trim();
  if (!title) {
    if (entityType === "product") {
      const stoneType = entity?.stoneDetails?.stoneType || "Natural Stone";
      title = `${entityName} — ${stoneType}`;
    } else if (entityType === "category") {
      title = `${entityName} — Natural Stone`;
    } else if (entityType === "collection") {
      title = `${entityName} Collection`;
    } else {
      title = defaultTitle || entityName;
    }
  }

  // Clean trailing branding duplication if template will be applied
  const cleanTitle = title
    .replace(/\s*\|\s*Stoneza.*$/i, "")
    .replace(/\s*—\s*Stoneza.*$/i, "")
    .trim();

  // 3. Resolve Description
  const entityDesc =
    entity?.shortDescription?.trim() ||
    entity?.excerpt?.trim() ||
    stripHtml(entity?.description || "")?.slice(0, 160) ||
    defaultDescription ||
    globalSeo?.metaDescription ||
    "Quarry-direct natural stone manufacturer and exporter in India since 1992.";
  const description = seoData.metaDescription?.trim() || entityDesc;

  // 4. Resolve Primary Image
  const entityPrimaryImage =
    extractEntityPrimaryImage(entity) ||
    defaultImage ||
    globalSeo?.ogImage ||
    DEFAULT_FALLBACK_IMAGE;

  // 5. Resolve Open Graph fields
  const ogTitle = seoData.ogTitle?.trim() || cleanTitle || entityName;
  const ogDescription = seoData.ogDescription?.trim() || description;
  const ogImage = seoData.ogImage?.trim() || entityPrimaryImage;
  const ogUrl = seoData.ogUrl?.trim() || canonicalUrl;
  const ogType = seoData.ogType?.trim() || (entityType === "blog" ? "article" : "website");

  // 6. Resolve Twitter fields
  const twitterCard = seoData.twitterCard?.trim() || "summary_large_image";
  const twitterTitle = seoData.twitterTitle?.trim() || ogTitle;
  const twitterDescription = seoData.twitterDescription?.trim() || ogDescription;
  const twitterImage = seoData.twitterImage?.trim() || ogImage;

  // 7. Resolve Robots (Index & Follow)
  const robotsIndex = seoData.robotsIndex !== false;
  const robotsFollow = seoData.robotsFollow !== false;

  // 8. Resolve Keywords
  let keywords = seoData.keywords;
  if (!keywords || (Array.isArray(keywords) && keywords.length === 0)) {
    if (Array.isArray(entity?.tags) && entity.tags.length > 0) {
      keywords = entity.tags;
    } else if (globalSeo?.keywords) {
      keywords = globalSeo.keywords;
    } else {
      keywords = [entityName, "natural stone", "Stoneza"].filter(Boolean);
    }
  }
  const formattedKeywords = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  return {
    title: cleanTitle,
    description,
    keywords: formattedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      siteName: DEFAULT_SITE_NAME,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: ogTitle || entityName,
            },
          ]
        : [],
      type: ogType,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : [],
    },
  };
}
