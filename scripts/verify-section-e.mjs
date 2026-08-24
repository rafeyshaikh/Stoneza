async function verifySectionE() {
  try {
    const colRes = await fetch("http://localhost:3000/collections");
    const colHtml = await colRes.text();
    console.log("=== 1. /collections ===");
    console.log("Status:", colRes.status);
    console.log("Includes 'The Stoneza Collections':", colHtml.includes("The Stoneza Collections"));
    console.log("Includes 'Eighteen named stone series':", colHtml.includes("Eighteen named stone series"));
    console.log("Includes 'Loading Stoneza Collections':", colHtml.includes("Loading Stoneza Collections"));
    console.log("Includes '18':", colHtml.includes("18"));

    const catRes = await fetch("http://localhost:3000/product-category/wall-cladding");
    const catHtml = await catRes.text();
    console.log("\n=== 2. /product-category/wall-cladding ===");
    console.log("Status:", catRes.status);
    console.log("Title Tag:", /<title>([^<]+)<\/title>/.exec(catHtml)?.[1]);
    console.log("Has Canonical Tag:", /rel=["']canonical["']/.test(catHtml));
    console.log("Has og:title:", /property=["']og:title["']/.test(catHtml));
    console.log("Has B2B Specification CTA:", catHtml.includes("Specifying Wall Cladding"));
    console.log("Has Off-brand home-décor CTA:", catHtml.includes("Ready to Elevate Your Living Space"));

    const prodRes = await fetch("http://localhost:3000/product");
    const prodHtml = await prodRes.text();
    console.log("\n=== 3. /product ===");
    console.log("Status:", prodRes.status);
    console.log("Includes Cosmic Rust (273rd product):", prodHtml.includes("Cosmic Rust"));
    console.log("Includes 'Loading Products...':", prodHtml.includes("Loading Products..."));

    const homeRes = await fetch("http://localhost:3000");
    const homeHtml = await homeRes.text();
    console.log("\n=== 4. Homepage Counts ===");
    console.log("Has '3 SUB-CATEGORIES · 12 SERIES':", homeHtml.includes("3 SUB-CATEGORIES · 12 SERIES") || homeHtml.includes("3 SUB-CATEGORIES"));
    console.log("Has '4 FAMILIES · 18 SERIES':", homeHtml.includes("4 FAMILIES · 18 SERIES") || homeHtml.includes("18 SERIES"));

    process.exit(0);
  } catch (err) {
    console.error("Verification error:", err);
    process.exit(1);
  }
}

verifySectionE();
