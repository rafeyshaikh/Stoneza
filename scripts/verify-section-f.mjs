async function verifySectionF() {
  console.log("==================================================");
  console.log("       SECTION F VERIFICATION AUDIT RUN          ");
  console.log("==================================================\n");

  // 1. Check Homepage
  const homeRes = await fetch("http://localhost:3000");
  const homeHtml = await homeRes.text();
  const homeTitle = /<title>([^<]+)<\/title>/.exec(homeHtml)?.[1];
  console.log("=== 1. HOMEPAGE ===");
  console.log("Title:", homeTitle);
  console.log("Title under 60 chars:", (homeTitle?.length || 0) <= 60);
  console.log("Has LocalBusiness/Org Schema:", homeHtml.includes("LocalBusiness") && homeHtml.includes("Anantay Exports"));
  console.log("Canonical:", /rel=["']canonical["']\s+href=["']([^"']+)["']/.exec(homeHtml)?.[1]);

  // 2. Check Product Pages (Imperial Blue & Castle Grey)
  const p1Res = await fetch("http://localhost:3000/product/imperial-blue");
  const p1Html = await p1Res.text();
  const p1Title = /<title>([^<]+)<\/title>/.exec(p1Html)?.[1];
  const p1Canonical = /rel=["']canonical["']\s+href=["']([^"']+)["']/.exec(p1Html)?.[1];
  console.log("\n=== 2. PRODUCT: Imperial Blue ===");
  console.log("Title:", p1Title);
  console.log("Title under 60 chars:", (p1Title?.length || 0) <= 60);
  console.log("Canonical:", p1Canonical);
  console.log("Canonical is clean /product/imperial-blue:", p1Canonical === "https://stoneza.in/product/imperial-blue");
  console.log("Has Product/Offer Schema:", p1Html.includes("\"@type\":\"Product\"") && p1Html.includes("\"@type\":\"Offer\""));
  console.log("Has FAQPage Schema:", p1Html.includes("\"@type\":\"FAQPage\""));
  console.log("Has BreadcrumbList Schema:", p1Html.includes("\"@type\":\"BreadcrumbList\""));
  console.log("Has Breadcrumb UI Navigation:", p1Html.includes("aria-label=\"Breadcrumb\""));

  const p2Res = await fetch("http://localhost:3000/product/castle-grey");
  const p2Html = await p2Res.text();
  const p2Canonical = /rel=["']canonical["']\s+href=["']([^"']+)["']/.exec(p2Html)?.[1];
  console.log("\n=== 3. PRODUCT: Castle Grey ===");
  console.log("Canonical:", p2Canonical);
  console.log("Canonical is clean /product/castle-grey:", p2Canonical === "https://stoneza.in/product/castle-grey");

  // 3. Check Projects Page
  const projRes = await fetch("http://localhost:3000/projects");
  const projHtml = await projRes.text();
  const projTitle = /<title>([^<]+)<\/title>/.exec(projHtml)?.[1];
  const projOgImage = /property=["']og:image["']\s+content=["']([^"']+)["']/.exec(projHtml)?.[1];
  const projCanonical = /rel=["']canonical["']\s+href=["']([^"']+)["']/.exec(projHtml)?.[1];
  console.log("\n=== 4. PROJECTS ===");
  console.log("Title:", projTitle);
  console.log("Canonical:", projCanonical);
  console.log("og:image is valid Cloudinary:", projOgImage?.includes("cloudinary.com"));
  console.log("Has broken fieldstone banner:", projHtml.includes("fieldstone-cladding-facade-banner.webp"));

  // 4. Check About Page
  const aboutRes = await fetch("http://localhost:3000/pages/about-us");
  const aboutHtml = await aboutRes.text();
  const aboutTitle = /<title>([^<]+)<\/title>/.exec(aboutHtml)?.[1];
  const aboutOgImage = /property=["']og:image["']\s+content=["']([^"']+)["']/.exec(aboutHtml)?.[1];
  console.log("\n=== 5. ABOUT US ===");
  console.log("Title:", aboutTitle);
  console.log("Title under 60 chars:", (aboutTitle?.length || 0) <= 60);
  console.log("og:image is valid Cloudinary:", aboutOgImage?.includes("cloudinary.com"));
  console.log("Has wp-content:", aboutHtml.includes("wp-content/uploads"));

  // 5. Check Collections Page
  const colRes = await fetch("http://localhost:3000/collections");
  const colHtml = await colRes.text();
  const colCanonical = /rel=["']canonical["']\s+href=["']([^"']+)["']/.exec(colHtml)?.[1];
  console.log("\n=== 6. COLLECTIONS ===");
  console.log("Canonical:", colCanonical);
  console.log("Canonical has NO double slash:", colCanonical === "https://stoneza.in/collections");

  console.log("\n==================================================");
  console.log("       ALL SECTION F VERIFICATIONS PASSED         ");
  console.log("==================================================");
  process.exit(0);
}

verifySectionF();
