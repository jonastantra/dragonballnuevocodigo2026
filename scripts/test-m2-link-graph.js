const fs = require("fs");
const path = require("path");

const OUT_DIR = path.resolve(__dirname, "../out");
const DATA_CAPITULOS = path.resolve(__dirname, "../data/capitulos.json");

if (!fs.existsSync(OUT_DIR)) {
  console.error("Error: out/ directory does not exist! Please run build first.");
  process.exit(1);
}

const capitulos = JSON.parse(fs.readFileSync(DATA_CAPITULOS, "utf8"));

// Helper: Recursively get all .html files in out/
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

console.log("=================================================");
console.log("   MILIESTONE 2 EMPIRICAL LINK GRAPH & DOM TEST   ");
console.log("=================================================");

const allHtmlFiles = getAllHtmlFiles(OUT_DIR);
console.log(`Total HTML files found in out/: ${allHtmlFiles.length}`);

// Map of canonical relative URLs that exist as files in out/
const existingRoutes = new Set();
for (const file of allHtmlFiles) {
  const rel = path.relative(OUT_DIR, file);
  if (rel === "index.html") {
    existingRoutes.add("/");
  } else if (rel.endsWith("/index.html")) {
    existingRoutes.add("/" + rel.replace(/\/index\.html$/, "/"));
  } else if (rel.endsWith(".html")) {
    existingRoutes.add("/" + rel);
  }
}

console.log(`Indexed ${existingRoutes.size} static route endpoints in out/`);

// -------------------------------------------------------------
// TEST 1: Full Internal Link Crawl & Inbound Link Distribution
// -------------------------------------------------------------

console.log("\n--- TEST 1: Full Internal Link Crawl & Resolvability ---");

const linkGraph = new Map(); // targetRoute -> Set of sourceRoutes
const relatedWidgetGraph = new Map(); // targetSlug -> count of appearances in related episode widgets
const brokenLinks = [];
let totalLinksChecked = 0;

const hrefRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
const breadcrumbRegex = /<nav[^>]*aria-label=["']Breadcrumb["'][^>]*>([\s\S]*?)<\/nav>/i;
const headerRegex = /<header[^>]*>([\s\S]*?)<\/header>/i;
const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;

let breadcrumbBrokenLinks = 0;
let headerBrokenLinks = 0;
let footerBrokenLinks = 0;

for (const file of allHtmlFiles) {
  const relPath = path.relative(OUT_DIR, file);
  const sourceRoute = relPath === "index.html" ? "/" : "/" + relPath.replace(/\/index\.html$/, "/");
  const html = fs.readFileSync(file, "utf8");

  // Check breadcrumbs
  const breadcrumbMatch = html.match(breadcrumbRegex);
  if (breadcrumbMatch) {
    let match;
    while ((match = hrefRegex.exec(breadcrumbMatch[1])) !== null) {
      const href = match[2];
      if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) continue;
      const cleanHref = href.split("?")[0].split("#")[0];
      if (!existingRoutes.has(cleanHref)) {
        breadcrumbBrokenLinks++;
        brokenLinks.push({ source: sourceRoute, href, type: "breadcrumb" });
      }
    }
  }

  // Check header
  const headerMatch = html.match(headerRegex);
  if (headerMatch) {
    let match;
    while ((match = hrefRegex.exec(headerMatch[1])) !== null) {
      const href = match[2];
      if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) continue;
      const cleanHref = href.split("?")[0].split("#")[0];
      if (!existingRoutes.has(cleanHref)) {
        headerBrokenLinks++;
        brokenLinks.push({ source: sourceRoute, href, type: "header" });
      }
    }
  }

  // Check footer
  const footerMatch = html.match(footerRegex);
  if (footerMatch) {
    let match;
    while ((match = hrefRegex.exec(footerMatch[1])) !== null) {
      const href = match[2];
      if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) continue;
      const cleanHref = href.split("?")[0].split("#")[0];
      if (!existingRoutes.has(cleanHref)) {
        footerBrokenLinks++;
        brokenLinks.push({ source: sourceRoute, href, type: "footer" });
      }
    }
  }

  // Check all links on the page
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    totalLinksChecked++;
    const href = match[2];
    if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
      continue;
    }
    const cleanHref = href.split("?")[0].split("#")[0];
    if (!existingRoutes.has(cleanHref)) {
      brokenLinks.push({ source: sourceRoute, href, type: "general" });
    } else {
      if (!linkGraph.has(cleanHref)) linkGraph.set(cleanHref, new Set());
      linkGraph.get(cleanHref).add(sourceRoute);
    }
  }

  // Related episodes widget specifically in episode pages
  if (sourceRoute.startsWith("/capitulo/")) {
    const relatedSectionMatch = html.match(/<section[^>]*>[\s\S]*?<h2[^>]*>Mas episodios de esta saga<\/h2>([\s\S]*?)<\/section>/i);
    if (relatedSectionMatch) {
      let rMatch;
      const rHrefRegex = /href=["']\/capitulo\/([^/]+)\/["']/g;
      while ((rMatch = rHrefRegex.exec(relatedSectionMatch[1])) !== null) {
        const targetSlug = rMatch[1];
        relatedWidgetGraph.set(targetSlug, (relatedWidgetGraph.get(targetSlug) || 0) + 1);
      }
    }
  }
}

console.log(`Total <a> links evaluated: ${totalLinksChecked}`);
console.log(`Total broken internal links found: ${brokenLinks.length}`);
console.log(`Breadcrumb broken links: ${breadcrumbBrokenLinks}`);
console.log(`Header broken links: ${headerBrokenLinks}`);
console.log(`Footer broken links: ${footerBrokenLinks}`);

if (brokenLinks.length > 0) {
  console.log("Broken links sample (up to 10):", brokenLinks.slice(0, 10));
}

// -------------------------------------------------------------
// TEST 2: In-Degree Distribution per Saga from Related Episodes
// -------------------------------------------------------------

console.log("\n--- TEST 2: In-Degree Distribution from Related Episodes Widget ---");

const sagas = [
  { id: "z", name: "Dragon Ball Z" },
  { id: "super", name: "Dragon Ball Super" },
  { id: "db", name: "Dragon Ball Clásico" },
  { id: "kai", name: "Dragon Ball Kai" },
  { id: "gt", name: "Dragon Ball GT" },
  { id: "peliculas", name: "Películas y Especiales" },
];

const sagaStats = {};

for (const saga of sagas) {
  const sagaEps = capitulos.filter((c) => c.saga === saga.id);
  const inDegrees = sagaEps.map((c) => relatedWidgetGraph.get(c.slug) || 0);
  
  const min = inDegrees.length > 0 ? Math.min(...inDegrees) : 0;
  const max = inDegrees.length > 0 ? Math.max(...inDegrees) : 0;
  const sum = inDegrees.reduce((a, b) => a + b, 0);
  const avg = inDegrees.length > 0 ? (sum / inDegrees.length).toFixed(2) : 0;
  
  // Count frequency of each in-degree value
  const freq = {};
  for (const deg of inDegrees) {
    freq[deg] = (freq[deg] || 0) + 1;
  }

  sagaStats[saga.id] = { count: sagaEps.length, min, max, avg, freq };
  console.log(`Saga ${saga.name} (${saga.id}): ${sagaEps.length} episodes | min=${min}, max=${max}, avg=${avg}, distribution=${JSON.stringify(freq)}`);
}

// -------------------------------------------------------------
// TEST 3: Movie Breadcrumb Verification
// -------------------------------------------------------------

console.log("\n--- TEST 3: Movie Breadcrumb Verification ---");

const movieEpisodes = capitulos.filter((c) => c.saga === "peliculas" || /pelicula|especial/i.test(c.titulo));
let movieBreadcrumbErrors = 0;
for (const ep of movieEpisodes) {
  const epFile = path.join(OUT_DIR, "capitulo", ep.slug, "index.html");
  if (!fs.existsSync(epFile)) {
    console.error(`Missing episode file: ${epFile}`);
    movieBreadcrumbErrors++;
    continue;
  }
  const html = fs.readFileSync(epFile, "utf8");
  const breadcrumbMatch = html.match(breadcrumbRegex);
  if (!breadcrumbMatch) {
    movieBreadcrumbErrors++;
    console.error(`No breadcrumb found in movie episode: ${ep.slug}`);
    continue;
  }
  // Check if movie breadcrumb points to /dragon-ball-todas-las-peliculas-y-especiales/
  const hasValidMovieHref = breadcrumbMatch[1].includes('href="/dragon-ball-todas-las-peliculas-y-especiales/"');
  if (!hasValidMovieHref) {
    movieBreadcrumbErrors++;
    console.error(`Invalid movie breadcrumb target in ${ep.slug}:`, breadcrumbMatch[1]);
  }
}
console.log(`Movie episodes checked: ${movieEpisodes.length}, Movie Breadcrumb Errors: ${movieBreadcrumbErrors}`);

// -------------------------------------------------------------
// TEST 4: Category DOM Content Enrichment
// -------------------------------------------------------------

console.log("\n--- TEST 4: Category DOM Content Enrichment ---");

const canonicalCategoryPaths = [
  "/category/dragon-ball-super-latino/",
  "/category/dragon-ball-super-sub/",
  "/category/dragon-ball-z/",
  "/category/dragon-ball-gt/",
  "/category/dragon-ball-kai/",
  "/category/dragon-ball/",
  "/dragon-ball-todas-las-peliculas-y-especiales/",
];

const categoryResults = [];

for (const catPath of canonicalCategoryPaths) {
  const cleanSeg = catPath.replace(/^\/+|\/+$/g, "");
  const catFile = path.join(OUT_DIR, cleanSeg, "index.html");
  
  if (!fs.existsSync(catFile)) {
    console.error(`Missing category file: ${catFile}`);
    categoryResults.push({ path: catPath, exists: false, error: "File missing" });
    continue;
  }

  const html = fs.readFileSync(catFile, "utf8");

  // Extract visible editorial synopsis text
  const synopsisMatch = html.match(/<h2[^>]*>Guía y Sinopsis Completa<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  const synopsisText = synopsisMatch ? synopsisMatch[1].replace(/<[^>]+>/g, "").trim() : "";
  const synopsisWordCount = synopsisText ? synopsisText.split(/\s+/).filter(Boolean).length : 0;

  // Extract full editorial section text to get total editorial word count
  const editorialSectionMatch = html.match(/<section[^>]*bg-db-panel[^>]*>([\s\S]*?)<\/section>/i);
  const totalEditorialText = editorialSectionMatch ? editorialSectionMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
  const totalEditorialWordCount = totalEditorialText ? totalEditorialText.split(/\s+/).filter(Boolean).length : 0;

  // Check saga arcs
  const hasArcsHeader = /<h2[^>]*>Arcos y Sagas Principales<\/h2>/i.test(html);
  const arcItemsMatch = html.match(/<span class="font-bold text-zinc-200">([^<]+)<\/span>/g) || [];
  const arcCount = arcItemsMatch.length;

  // Check voice cast
  const hasCastHeader = /<h3[^>]*>Elenco de Doblaje Latino<\/h3>/i.test(html);
  const castMatch = html.match(/<h3[^>]*>Elenco de Doblaje Latino<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  const castText = castMatch ? castMatch[1].trim() : "";

  // Check breadcrumb
  const hasBreadcrumb = breadcrumbRegex.test(html);

  // Check SEO title and description in DOM
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : "";
  const descMatch = html.match(/<meta[^>]+(?:name|property)=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']description["']/i);
  const metaDesc = descMatch ? descMatch[1].trim() : "";

  categoryResults.push({
    path: catPath,
    exists: true,
    pageTitle,
    metaDescLength: metaDesc.length,
    synopsisWordCount,
    totalEditorialWordCount,
    hasArcsHeader,
    arcCount,
    hasCastHeader,
    castPresent: Boolean(castText),
    hasBreadcrumb,
  });

  console.log(`\nCategory: ${catPath}`);
  console.log(`  Title: "${pageTitle}"`);
  console.log(`  Meta Desc (${metaDesc.length} chars): "${metaDesc.slice(0, 70)}..."`);
  console.log(`  Synopsis Words: ${synopsisWordCount} | Total Editorial Words: ${totalEditorialWordCount} (>200: ${totalEditorialWordCount >= 200})`);
  console.log(`  Saga Arcs: ${hasArcsHeader} (${arcCount} arcs detected)`);
  console.log(`  Voice Cast: ${hasCastHeader} (Content: "${castText.slice(0, 50)}...")`);
  console.log(`  Breadcrumb in DOM: ${hasBreadcrumb}`);
}

// -------------------------------------------------------------
// TEST 5: Legal Pages & Header Navigation 100% Resolvable
// -------------------------------------------------------------

console.log("\n--- TEST 5: Header Navigation & Legal Footer Links Resolvability ---");

const legalRoutes = [
  "/sobre-nosotros/",
  "/politica-de-privacidad/",
  "/terminos-y-condiciones/",
  "/aviso-legal/",
  "/contacto/",
];

let legalErrors = 0;
for (const lr of legalRoutes) {
  const clean = lr.replace(/^\/+|\/+$/g, "");
  const p = path.join(OUT_DIR, clean, "index.html");
  const exists = fs.existsSync(p);
  if (!exists) {
    console.error(`Legal page missing in out/: ${lr}`);
    legalErrors++;
  }
}
console.log(`Legal pages checked: ${legalRoutes.length}, Missing: ${legalErrors}`);

const headerNavRoutes = [
  "/",
  "/category/dragon-ball-super-latino/",
  "/category/dragon-ball-super-sub/",
  "/category/dragon-ball-z/",
  "/category/dragon-ball-gt/",
  "/category/dragon-ball-kai/",
  "/category/dragon-ball/",
  "/dragon-ball-todas-las-peliculas-y-especiales/",
  "/blog/",
];

let headerErrors = 0;
for (const hr of headerNavRoutes) {
  const clean = hr === "/" ? "index.html" : path.join(hr.replace(/^\/+|\/+$/g, ""), "index.html");
  const p = path.join(OUT_DIR, clean);
  const exists = fs.existsSync(p);
  if (!exists) {
    console.error(`Header nav target missing in out/: ${hr}`);
    headerErrors++;
  }
}
console.log(`Header nav routes checked: ${headerNavRoutes.length}, Missing: ${headerErrors}`);

// -------------------------------------------------------------
// SUMMARY OF TEST RESULTS
// -------------------------------------------------------------

console.log("\n=================================================");
console.log("               TEST RESULTS SUMMARY               ");
console.log("=================================================");

const passed =
  brokenLinks.length === 0 &&
  breadcrumbBrokenLinks === 0 &&
  headerBrokenLinks === 0 &&
  footerBrokenLinks === 0 &&
  movieBreadcrumbErrors === 0 &&
  legalErrors === 0 &&
  headerErrors === 0 &&
  categoryResults.every((c) => c.exists && c.totalEditorialWordCount >= 200 && c.hasArcsHeader && c.arcCount > 0 && c.hasCastHeader && c.castPresent && c.hasBreadcrumb);

console.log(`Link Crawl 0 Broken Links: ${brokenLinks.length === 0 ? "PASSED" : "FAILED"}`);
console.log(`Breadcrumbs 0 Broken Links: ${breadcrumbBrokenLinks === 0 ? "PASSED" : "FAILED"}`);
console.log(`Header Links 0 Broken Links: ${headerBrokenLinks === 0 ? "PASSED" : "FAILED"}`);
console.log(`Footer Legal Links 0 Broken Links: ${footerBrokenLinks === 0 ? "PASSED" : "FAILED"}`);
console.log(`Movie Breadcrumb Targets Valid: ${movieBreadcrumbErrors === 0 ? "PASSED" : "FAILED"}`);
console.log(`Category DOM Enrichment (>200 words, arcs, cast): ${categoryResults.every((c) => c.totalEditorialWordCount >= 200 && c.hasArcsHeader && c.hasCastHeader) ? "PASSED" : "FAILED"}`);
console.log(`\nOVERALL VERDICT: ${passed ? "APPROVE" : "REQUEST_CHANGES"}`);
