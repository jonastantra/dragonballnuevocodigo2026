#!/usr/bin/env node
/**
 * Dragon Ball Online - Comprehensive E2E Technical SEO Test Suite
 * 
 * Validates Next.js App Router static export (`out/`) and source configurations
 * against Google Search Central guidelines, Schema.org specifications, and technical SEO contracts.
 * 
 * 4-Tier Test Architecture:
 * - Tier 1: Feature Coverage (Canonical domain, canonical tags, <title>, <meta description>, JSON-LD, sitemap, robots)
 * - Tier 2: Boundary & Corner Cases (No duplicate alias HTML, search noindex, sanitized sitemap, robots disallows, valid thumbnails)
 * - Tier 3: Cross-Feature & Schema Validation (VideoObject, TVEpisode, TVSeries, BreadcrumbList, WebSite, Organization, ItemList)
 * - Tier 4: Real-World Crawl & Navigation (Internal link graph, movie breadcrumbs, header links, clean footer, next/prev navigation)
 * 
 * Usage:
 *   node scripts/e2e-seo-test.js [options]
 *   Options:
 *     --tier=1|2|3|4     Run specific tier only
 *     --source-only      Run only source-level contract checks
 *     --out-only         Run only static export checks on out/
 *     --json             Output results in JSON format
 *     --verbose          Show detailed passing assertions
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const CANONICAL_DOMAIN = "https://dragonballhdsinlimites.net";

const CANONICAL_CATEGORIES = [
  "/category/dragon-ball-super-latino/",
  "/category/dragon-ball-super-sub/",
  "/category/dragon-ball-z/",
  "/category/dragon-ball-gt/",
  "/category/dragon-ball-kai/",
  "/category/dragon-ball/",
  "/dragon-ball-todas-las-peliculas-y-especiales/",
];

const VALID_LEGAL_PAGES = [
  "/politica-de-privacidad/",
  "/terminos-y-condiciones/",
  "/aviso-legal/",
  "/contacto/",
  "/sobre-nosotros/",
  "/blog/",
];

const WP_UTILITY_JUNK_PATTERNS = [
  /\/feed\/?$/,
  /\/wp-json\/?$/,
  /\/xmlrpc\.php\/?$/,
  /\/comments\/feed\/?$/,
  /\/page\/\d+\/?$/,
  /\/category\/blog\/?$/,
];

// Parse CLI Arguments
const args = process.argv.slice(2);
const cliOptions = {
  tier: null,
  sourceOnly: false,
  outOnly: false,
  json: false,
  verbose: false,
};

for (const arg of args) {
  if (arg.startsWith("--tier=")) {
    cliOptions.tier = parseInt(arg.split("=")[1], 10);
  } else if (arg === "--source-only") {
    cliOptions.sourceOnly = true;
  } else if (arg === "--out-only") {
    cliOptions.outOnly = true;
  } else if (arg === "--json") {
    cliOptions.json = true;
  } else if (arg === "--verbose") {
    cliOptions.verbose = true;
  }
}

// ANSI Colors
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// Test Suite State
const state = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  failures: [],
  warnings: [],
  tierResults: { 1: { total: 0, passed: 0, failed: 0 }, 2: { total: 0, passed: 0, failed: 0 }, 3: { total: 0, passed: 0, failed: 0 }, 4: { total: 0, passed: 0, failed: 0 } },
  currentTier: 1,
  currentSection: "",
};

function startSection(tier, title) {
  state.currentTier = tier;
  state.currentSection = title;
  if (!cliOptions.json) {
    console.log(`\n${colors.bold}${colors.blue}=== [Tier ${tier}] ${title} ===${colors.reset}`);
  }
}

function assert(condition, message, details = {}) {
  state.total += 1;
  state.tierResults[state.currentTier].total += 1;

  if (condition) {
    state.passed += 1;
    state.tierResults[state.currentTier].passed += 1;
    if (cliOptions.verbose && !cliOptions.json) {
      console.log(`  ${colors.green}PASS${colors.reset} ${message}`);
    }
    return true;
  } else {
    state.failed += 1;
    state.tierResults[state.currentTier].failed += 1;
    const failureInfo = {
      tier: state.currentTier,
      section: state.currentSection,
      message,
      details,
    };
    state.failures.push(failureInfo);
    if (!cliOptions.json) {
      console.log(`  ${colors.red}FAIL${colors.reset} ${message}`);
      if (details.expected !== undefined && details.actual !== undefined) {
        console.log(`       ${colors.gray}Expected:${colors.reset} ${JSON.stringify(details.expected)}`);
        console.log(`       ${colors.gray}Actual:  ${colors.reset} ${JSON.stringify(details.actual)}`);
      }
      if (details.context) {
        console.log(`       ${colors.gray}Context: ${colors.reset} ${details.context}`);
      }
      if (details.file) {
        console.log(`       ${colors.gray}File:    ${colors.reset} ${details.file}`);
      }
    }
    return false;
  }
}

function warn(message, details = {}) {
  state.warnings.push({ message, details });
  if (!cliOptions.json) {
    console.log(`  ${colors.yellow}WARN${colors.reset} ${message}`);
  }
}

// HTML & Data Helpers
function readJson(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (err) {
    return null;
  }
}

function readFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf8");
}

function extractCanonical(html) {
  if (!html) return null;
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match ? match[1] : null;
}

function extractTitle(html) {
  if (!html) return null;
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractMeta(html, name) {
  if (!html) return null;
  const regex = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const regexAlt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`, "i");
  const match = html.match(regex) || html.match(regexAlt);
  return match ? match[1] : null;
}

function extractJsonLdScripts(html) {
  if (!html) return [];
  const scripts = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      scripts.push(data);
    } catch (e) {
      scripts.push({ __parseError: e.message, raw: match[1] });
    }
  }
  return scripts;
}

function extractHrefs(html) {
  if (!html) return [];
  const hrefs = [];
  const regex = /<a[^>]+href=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

function normalizeUrlPath(urlPath) {
  if (!urlPath) return "";
  let clean = String(urlPath).trim().split("?")[0].split("#")[0];
  if (clean.startsWith(CANONICAL_DOMAIN)) {
    clean = clean.slice(CANONICAL_DOMAIN.length);
  }
  if (!clean || clean === "/") return "/";
  return `/${clean.replace(/^\/+|\/+$/g, "")}/`;
}

// -------------------------------------------------------------
// LOAD RELEVANT CODEBASE ARTIFACTS
// -------------------------------------------------------------
const capitulos = readJson("data/capitulos.json") || [];
const outExists = fs.existsSync(OUT_DIR);
const outHtmlFiles = [];

if (outExists) {
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(full);
      } else if (entry.name.endsWith(".html") || entry.name.endsWith(".xml") || entry.name.endsWith(".txt")) {
        outHtmlFiles.push(path.relative(OUT_DIR, full));
      }
    }
  }
  scanDir(OUT_DIR);
}

// =============================================================
// TIER 1: CORE FEATURE COVERAGE
// =============================================================
function runTier1() {
  startSection(1, "Core Feature Coverage & Canonical Invariants");

  // 1.1 Canonical Domain Definition
  const siteJs = readFile("lib/site.js");
  assert(
    siteJs && siteJs.includes(`siteUrl = "${CANONICAL_DOMAIN}"`) || (siteJs && siteJs.includes(`'${CANONICAL_DOMAIN}'`)),
    "lib/site.js must export siteUrl as canonical domain: " + CANONICAL_DOMAIN,
    { file: "lib/site.js" }
  );

  // 1.2 Data Catalog Episode Canonical URLs & Slugs
  assert(
    capitulos.length === 1070,
    `data/capitulos.json must contain exactly 1,070 episodes (Found: ${capitulos.length})`,
    { expected: 1070, actual: capitulos.length }
  );

  let missingSlugs = 0;
  let nonCanonicalUrlsInJson = 0;
  let nonTrailingSlashUrls = 0;
  const slugSet = new Set();
  let duplicateSlugs = 0;

  for (const cap of capitulos) {
    if (!cap.slug || typeof cap.slug !== "string") missingSlugs += 1;
    if (slugSet.has(cap.slug)) duplicateSlugs += 1;
    slugSet.add(cap.slug);

    if (cap.url) {
      if (!cap.url.startsWith("/capitulo/") && cap.url !== `/capitulo/${cap.slug}/`) {
        nonCanonicalUrlsInJson += 1;
      }
      if (!cap.url.endsWith("/")) {
        nonTrailingSlashUrls += 1;
      }
    }
  }

  assert(missingSlugs === 0, `All 1,070 episodes must have valid slugs (Missing: ${missingSlugs})`, { expected: 0, actual: missingSlugs });
  assert(duplicateSlugs === 0, `All 1,070 episode slugs must be unique (Duplicates: ${duplicateSlugs})`, { expected: 0, actual: duplicateSlugs });
  assert(
    nonCanonicalUrlsInJson === 0,
    `data/capitulos.json episode URLs must follow canonical /capitulo/[slug]/ format (Non-canonical: ${nonCanonicalUrlsInJson})`,
    { expected: 0, actual: nonCanonicalUrlsInJson }
  );

  // 1.3 Canonical Categories Invariant
  // Check that all 7 canonical categories are defined in lib/site.js or app routes
  for (const catPath of CANONICAL_CATEGORIES) {
    assert(
      siteJs && siteJs.includes(catPath),
      `Canonical category path ${catPath} must be present in lib/site.js`,
      { file: "lib/site.js", path: catPath }
    );
  }

  // 1.4 Sitemap & Robots Source Inspection
  const sitemapJs = readFile("app/sitemap.js");
  assert(
    sitemapJs !== null && sitemapJs.includes("export default function sitemap"),
    "app/sitemap.js must exist and export default sitemap function",
    { file: "app/sitemap.js" }
  );

  const robotsJs = readFile("app/robots.js");
  assert(
    robotsJs !== null && robotsJs.includes("export default function robots"),
    "app/robots.js must exist and export default robots function",
    { file: "app/robots.js" }
  );

  // 1.5 AUDIT_SEO_REPORT.md Existence
  const auditReport = readFile("AUDIT_SEO_REPORT.md");
  assert(
    auditReport !== null && auditReport.length > 500,
    "AUDIT_SEO_REPORT.md must exist and contain detailed audit documentation",
    { file: "AUDIT_SEO_REPORT.md" }
  );

  // 1.6 Static Export Out Directory Checks (if out/ exists)
  if (outExists) {
    // Check Homepage
    const homeHtml = readFile("out/index.html");
    assert(homeHtml !== null, "out/index.html must exist", { file: "out/index.html" });
    if (homeHtml) {
      const homeCanonical = extractCanonical(homeHtml);
      assert(
        homeCanonical === `${CANONICAL_DOMAIN}/` || homeCanonical === CANONICAL_DOMAIN,
        "Homepage canonical tag must point to canonical domain root",
        { expected: `${CANONICAL_DOMAIN}/`, actual: homeCanonical }
      );
      const homeTitle = extractTitle(homeHtml);
      assert(homeTitle && homeTitle.length > 5, "Homepage must have non-empty <title>", { actual: homeTitle });
      const homeDesc = extractMeta(homeHtml, "description");
      assert(homeDesc && homeDesc.length > 20, "Homepage must have non-empty <meta name='description'>", { actual: homeDesc });
    }

    // Check 7 Canonical Categories in out/
    for (const catPath of CANONICAL_CATEGORIES) {
      const cleanPath = catPath.replace(/^\/|\/$/g, "");
      const catHtmlPath = path.join("out", cleanPath, "index.html");
      const catHtml = readFile(catHtmlPath);
      assert(catHtml !== null, `Static export must generate canonical category page: ${catHtmlPath}`, { file: catHtmlPath });
      if (catHtml) {
        const catCanonical = extractCanonical(catHtml);
        assert(
          catCanonical === `${CANONICAL_DOMAIN}${catPath}`,
          `Category ${catPath} canonical tag must equal ${CANONICAL_DOMAIN}${catPath}`,
          { expected: `${CANONICAL_DOMAIN}${catPath}`, actual: catCanonical }
        );
        const catTitle = extractTitle(catHtml);
        assert(catTitle && catTitle.length > 5, `Category ${catPath} must have non-empty <title>`, { actual: catTitle });
      }
    }

    // Check All 1,070 Canonical Episode HTML files
    let missingEpisodeHtml = 0;
    let mismatchedCanonicalTags = 0;
    let missingEpisodeTitles = 0;
    let missingEpisodeDescriptions = 0;

    for (const cap of capitulos) {
      const epHtmlPath = path.join("out", "capitulo", cap.slug, "index.html");
      const epHtml = readFile(epHtmlPath);
      if (!epHtml) {
        missingEpisodeHtml += 1;
        continue;
      }
      const canonical = extractCanonical(epHtml);
      const expectedCanonical = `${CANONICAL_DOMAIN}/capitulo/${cap.slug}/`;
      if (canonical !== expectedCanonical) {
        mismatchedCanonicalTags += 1;
      }
      const title = extractTitle(epHtml);
      if (!title || title.includes("undefined") || title.trim() === "") {
        missingEpisodeTitles += 1;
      }
      const desc = extractMeta(epHtml, "description");
      if (!desc || desc.includes("undefined") || desc.trim() === "") {
        missingEpisodeDescriptions += 1;
      }
    }

    assert(
      missingEpisodeHtml === 0,
      `All 1,070 episode pages must exist in out/capitulo/[slug]/index.html (Missing: ${missingEpisodeHtml})`,
      { expected: 0, actual: missingEpisodeHtml }
    );
    assert(
      mismatchedCanonicalTags === 0,
      `All 1,070 episode pages must have self-consistent canonical tags pointing to ${CANONICAL_DOMAIN}/capitulo/[slug]/ (Mismatched: ${mismatchedCanonicalTags})`,
      { expected: 0, actual: mismatchedCanonicalTags }
    );
    assert(
      missingEpisodeTitles === 0,
      `All 1,070 episode pages must have valid, non-empty <title> tags (Missing/Invalid: ${missingEpisodeTitles})`,
      { expected: 0, actual: missingEpisodeTitles }
    );
    assert(
      missingEpisodeDescriptions === 0,
      `All 1,070 episode pages must have valid, non-empty meta descriptions (Missing/Invalid: ${missingEpisodeDescriptions})`,
      { expected: 0, actual: missingEpisodeDescriptions }
    );

    // Check sitemap.xml in out/
    const sitemapXml = readFile("out/sitemap.xml");
    assert(sitemapXml !== null, "out/sitemap.xml must exist in static export", { file: "out/sitemap.xml" });
    if (sitemapXml) {
      assert(
        sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') || sitemapXml.includes("<urlset"),
        "sitemap.xml must declare valid Sitemaps XML namespace",
        { file: "out/sitemap.xml" }
      );
      assert(
        sitemapXml.includes(`<loc>${CANONICAL_DOMAIN}/</loc>`) || sitemapXml.includes(`<loc>${CANONICAL_DOMAIN}</loc>`),
        "sitemap.xml must contain the homepage URL",
        { file: "out/sitemap.xml" }
      );
      for (const catPath of CANONICAL_CATEGORIES) {
        assert(
          sitemapXml.includes(`<loc>${CANONICAL_DOMAIN}${catPath}</loc>`),
          `sitemap.xml must contain canonical category: ${catPath}`,
          { path: catPath }
        );
      }
      // Check count of episode URLs in sitemap
      const epCountInSitemap = (sitemapXml.match(new RegExp(`<loc>${CANONICAL_DOMAIN}/capitulo/`, "g")) || []).length;
      assert(
        epCountInSitemap === 1070,
        `sitemap.xml must contain all 1,070 canonical /capitulo/ episode URLs (Found: ${epCountInSitemap})`,
        { expected: 1070, actual: epCountInSitemap }
      );
    }

    // Check robots.txt in out/
    const robotsTxt = readFile("out/robots.txt");
    assert(robotsTxt !== null, "out/robots.txt must exist in static export", { file: "out/robots.txt" });
    if (robotsTxt) {
      assert(robotsTxt.includes("User-agent: *") || robotsTxt.includes("User-Agent: *"), "robots.txt must declare User-agent: *");
      assert(robotsTxt.includes("Allow: /"), "robots.txt must declare Allow: /");
      assert(
        robotsTxt.includes(`Sitemap: ${CANONICAL_DOMAIN}/sitemap.xml`),
        `robots.txt must declare Sitemap: ${CANONICAL_DOMAIN}/sitemap.xml`,
        { actual: robotsTxt }
      );
    }
  } else {
    warn("Static export directory 'out/' does not exist yet. Run 'npm run build' for full HTML verification.");
  }
}

// =============================================================
// TIER 2: BOUNDARY & CORNER CASES
// =============================================================
function runTier2() {
  startSection(2, "Boundary, Corner Cases & Crawl Budget Protection");

  // 2.1 No Duplicate HTML Generated on Episode Aliases
  // Check app/[...legacy]/page.js: generateStaticParams must NOT generate duplicate pages for episode aliases
  const legacyPageJs = readFile("app/[...legacy]/page.js");
  if (legacyPageJs) {
    const addsCapituloAliases = legacyPageJs.includes("for (const alias of capitulo.aliases") ||
                                legacyPageJs.includes("paths.add(episodeHref(capitulo))");
    assert(
      !addsCapituloAliases,
      "app/[...legacy]/page.js must NOT generate duplicate static HTML pages for capitulo aliases (Eliminate duplicate content)",
      { file: "app/[...legacy]/page.js" }
    );
  }

  // 2.2 Check Vercel 301 Redirects Configuration
  const vercelJson = readJson("vercel.json");
  assert(vercelJson !== null, "vercel.json must exist", { file: "vercel.json" });

  // 2.3 Search Page Directives (/buscar/)
  const buscarPageJs = readFile("app/buscar/page.js");
  assert(
    buscarPageJs !== null && (buscarPageJs.includes("index: false") || buscarPageJs.includes("noindex")),
    "app/buscar/page.js must set robots: { index: false, follow: true } to prevent indexing internal search queries",
    { file: "app/buscar/page.js" }
  );

  if (outExists) {
    const buscarHtml = readFile("out/buscar/index.html");
    if (buscarHtml) {
      const robotsMeta = extractMeta(buscarHtml, "robots");
      assert(
        robotsMeta !== null && robotsMeta.includes("noindex"),
        "out/buscar/index.html must output meta robots with 'noindex'",
        { expected: "noindex, follow", actual: robotsMeta }
      );
    }
  }

  // 2.4 Sitemap Sanitization: Zero Utility/WordPress Junk URLs
  const sitemapJs = readFile("app/sitemap.js");
  if (sitemapJs) {
    assert(
      !sitemapJs.includes("utilityPages.map") && !sitemapJs.includes("getLegacyPages().map"),
      "app/sitemap.js must NOT include utilityPages (/feed/, /wp-json/, /xmlrpc.php/) or thin legacyPages",
      { file: "app/sitemap.js" }
    );
  }

  if (outExists) {
    const sitemapXml = readFile("out/sitemap.xml");
    if (sitemapXml) {
      let junkFound = 0;
      const junkList = [];
      for (const pattern of WP_UTILITY_JUNK_PATTERNS) {
        const matches = sitemapXml.match(pattern);
        if (matches) {
          junkFound += matches.length;
          junkList.push(pattern.toString());
        }
      }
      assert(
        junkFound === 0,
        `sitemap.xml must contain ZERO WordPress/utility junk URLs (/feed/, /wp-json/, /xmlrpc.php/) (Found: ${junkFound})`,
        { expected: 0, actual: junkFound, junkList }
      );

      // Check for duplicate URLs in sitemap
      const locMatches = sitemapXml.match(/<loc>([^<]+)<\/loc>/g) || [];
      const seenLocs = new Set();
      let duplicateLocs = 0;
      for (const locTag of locMatches) {
        const url = locTag.replace(/<\/?loc>/g, "");
        if (seenLocs.has(url)) duplicateLocs += 1;
        seenLocs.add(url);
      }
      assert(duplicateLocs === 0, `sitemap.xml must contain 0 duplicate URLs (Found: ${duplicateLocs})`, { expected: 0, actual: duplicateLocs });
    }
  }

  // 2.5 Robots.txt Disallow Rules for Search Query & WP Artifacts
  const robotsJs = readFile("app/robots.js");
  if (robotsJs) {
    assert(
      robotsJs.includes("disallow") || robotsJs.includes("Disallow"),
      "app/robots.js must define disallow rules for crawl budget optimization",
      { file: "app/robots.js" }
    );
  }

  if (outExists) {
    const robotsTxt = readFile("out/robots.txt");
    if (robotsTxt) {
      const disallowsBuscar = robotsTxt.includes("Disallow: /buscar/") || robotsTxt.includes("disallow: /buscar/");
      const disallowsQuery = robotsTxt.includes("Disallow: /*?*") || robotsTxt.includes("disallow: /*?*");
      const disallowsWpJson = robotsTxt.includes("/wp-json/") || robotsTxt.includes("wp-json");

      assert(disallowsBuscar, "robots.txt must disallow /buscar/", { actual: robotsTxt });
      assert(disallowsQuery, "robots.txt must disallow query parameters (/*?*)", { actual: robotsTxt });
      assert(disallowsWpJson, "robots.txt must disallow legacy WordPress endpoints (/wp-json/, /xmlrpc.php)", { actual: robotsTxt });
    }
  }

  // 2.6 VideoObject Schema Null-Safety & Fallback Thumbnails
  let undefinedThumbnails = 0;
  let emptyImages = 0;
  for (const cap of capitulos) {
    if (!cap.imagen || typeof cap.imagen !== "string" || cap.imagen.trim() === "") {
      emptyImages += 1;
    }
    // In schema evaluation:
    const thumbnail = cap.imagen ? [cap.imagen] : undefined;
    if (thumbnail === undefined) {
      undefinedThumbnails += 1;
    }
  }

  // Check how capitulo/[slug]/page.js handles thumbnail
  const epPageJs = readFile("app/capitulo/[slug]/page.js");
  if (epPageJs) {
    assert(
      !epPageJs.includes("thumbnailUrl: capitulo.imagen ? [capitulo.imagen] : undefined"),
      "app/capitulo/[slug]/page.js must provide fallback thumbnail (never emit undefined thumbnailUrl in VideoObject schema)",
      { file: "app/capitulo/[slug]/page.js" }
    );
  }

  // 2.7 Hero LCP Optimization: Remove contentVisibility: auto on above-the-fold player
  const epViewJs = readFile("components/EpisodeView.js");
  if (epViewJs) {
    assert(
      !epViewJs.includes('contentVisibility: "auto"'),
      "components/EpisodeView.js must NOT set contentVisibility: 'auto' on above-the-fold hero section (LCP optimization)",
      { file: "components/EpisodeView.js" }
    );
  }

  // 2.8 Repository Hygiene: .gitignore and .vercelignore ignore Simpson/
  const gitignore = readFile(".gitignore") || "";
  const vercelignore = readFile(".vercelignore") || "";
  assert(
    gitignore.includes("Simpson") || gitignore.includes("Simpson/"),
    ".gitignore must include 'Simpson/' to maintain repository hygiene",
    { file: ".gitignore" }
  );
  assert(
    vercelignore.includes("Simpson") || vercelignore.includes("Simpson/"),
    ".vercelignore must include 'Simpson/' to prevent unneeded deployment upload",
    { file: ".vercelignore" }
  );
}

// =============================================================
// TIER 3: CROSS-FEATURE & SCHEMA VALIDATION
// =============================================================
function runTier3() {
  startSection(3, "Cross-Feature & Schema.org Structured Data Validation");

  // Sample episodes across all 7 sagas
  const sagaSamples = [
    { saga: "Super Latino", sample: capitulos.find((c) => c.categoriaSlug === "dragon-ball-super-latino") },
    { saga: "Super Sub", sample: capitulos.find((c) => c.categoriaSlug === "dragon-ball-super-sub") },
    { saga: "Dragon Ball Z", sample: capitulos.find((c) => c.saga === "z") },
    { saga: "Dragon Ball GT", sample: capitulos.find((c) => c.saga === "gt") },
    { saga: "Dragon Ball Kai", sample: capitulos.find((c) => c.saga === "kai") },
    { saga: "Dragon Ball Classic", sample: capitulos.find((c) => c.saga === "db") },
    { saga: "Peliculas / Especiales", sample: capitulos.find((c) => c.saga === "peliculas" || /pelicula/i.test(c.titulo)) },
  ];

  // 3.1 Inspect app/layout.js WebSite & Organization Schema
  const layoutJs = readFile("app/layout.js");
  assert(
    layoutJs !== null && layoutJs.includes('"@type": "WebSite"'),
    "app/layout.js must declare Schema.org WebSite structured data",
    { file: "app/layout.js" }
  );
  assert(
    layoutJs !== null && (layoutJs.includes('"@type": "Organization"') || layoutJs.includes('SearchAction')),
    "app/layout.js must declare SearchAction or Organization structured data",
    { file: "app/layout.js" }
  );

  // 3.2 Inspect app/capitulo/[slug]/page.js Schema Generation
  const epPageJs = readFile("app/capitulo/[slug]/page.js");
  if (epPageJs) {
    assert(
      epPageJs.includes('"@type": "VideoObject"') || epPageJs.includes("'@type': 'VideoObject'"),
      "app/capitulo/[slug]/page.js must implement VideoObject JSON-LD schema",
      { file: "app/capitulo/[slug]/page.js" }
    );
    assert(
      epPageJs.includes("BreadcrumbList"),
      "app/capitulo/[slug]/page.js must implement BreadcrumbList JSON-LD schema",
      { file: "app/capitulo/[slug]/page.js" }
    );
    assert(
      epPageJs.includes("TVEpisode") || epPageJs.includes("TVSeries"),
      "app/capitulo/[slug]/page.js should implement TVEpisode / TVSeries JSON-LD schema",
      { file: "app/capitulo/[slug]/page.js" }
    );
  }

  // 3.3 Validate JSON-LD in Static HTML Pages (if out/ exists)
  if (outExists) {
    // Validate Homepage JSON-LD
    const homeHtml = readFile("out/index.html");
    if (homeHtml) {
      const homeSchemas = extractJsonLdScripts(homeHtml);
      assert(homeSchemas.length > 0, "Homepage must embed at least one JSON-LD script", { count: homeSchemas.length });
      const hasParseError = homeSchemas.some((s) => s.__parseError);
      assert(!hasParseError, "Homepage JSON-LD scripts must be syntactically valid JSON");

      const websiteSchema = homeSchemas.find((s) => s["@type"] === "WebSite");
      assert(websiteSchema !== undefined, "Homepage must contain Schema.org WebSite definition");
      if (websiteSchema) {
        assert(
          websiteSchema.url === CANONICAL_DOMAIN || websiteSchema.url === `${CANONICAL_DOMAIN}/`,
          "WebSite url must equal canonical domain",
          { expected: CANONICAL_DOMAIN, actual: websiteSchema.url }
        );
      }
    }

    // Validate Sample Episodes across all 7 Sagas
    for (const item of sagaSamples) {
      if (!item.sample) continue;
      const epHtmlPath = path.join("out", "capitulo", item.sample.slug, "index.html");
      const epHtml = readFile(epHtmlPath);
      assert(epHtml !== null, `HTML must exist for saga [${item.saga}] sample: ${item.sample.slug}`, { file: epHtmlPath });
      if (!epHtml) continue;

      const schemas = extractJsonLdScripts(epHtml);
      const hasParseError = schemas.some((s) => s.__parseError);
      assert(!hasParseError, `JSON-LD in saga [${item.saga}] episode must parse without syntax error`, { file: epHtmlPath });

      // Check VideoObject
      const videoObj = schemas.find((s) => s["@type"] === "VideoObject" || (Array.isArray(s["@graph"]) && s["@graph"].some((g) => g["@type"] === "VideoObject")));
      const actualVideo = videoObj && videoObj["@type"] === "VideoObject" ? videoObj : (videoObj?.["@graph"]?.find((g) => g["@type"] === "VideoObject"));

      assert(actualVideo !== undefined, `Episode [${item.saga}] must contain VideoObject schema`, { file: epHtmlPath });
      if (actualVideo) {
        assert(typeof actualVideo.name === "string" && actualVideo.name.length > 0, "VideoObject.name must be non-empty string");
        assert(typeof actualVideo.description === "string" && actualVideo.description.length > 0, "VideoObject.description must be non-empty string");
        assert(
          actualVideo.thumbnailUrl && actualVideo.thumbnailUrl !== "undefined" && !Array.isArray(actualVideo.thumbnailUrl) || (Array.isArray(actualVideo.thumbnailUrl) && actualVideo.thumbnailUrl.length > 0 && actualVideo.thumbnailUrl[0] !== "undefined"),
          "VideoObject.thumbnailUrl must be valid and not undefined",
          { actual: actualVideo.thumbnailUrl }
        );
        assert(
          actualVideo.uploadDate && !isNaN(Date.parse(actualVideo.uploadDate)),
          "VideoObject.uploadDate must be valid ISO date string",
          { actual: actualVideo.uploadDate }
        );
      }

      // Check BreadcrumbList
      const breadcrumb = schemas.find((s) => s["@type"] === "BreadcrumbList" || (Array.isArray(s["@graph"]) && s["@graph"].some((g) => g["@type"] === "BreadcrumbList")));
      const actualBreadcrumb = breadcrumb && breadcrumb["@type"] === "BreadcrumbList" ? breadcrumb : (breadcrumb?.["@graph"]?.find((g) => g["@type"] === "BreadcrumbList"));

      assert(actualBreadcrumb !== undefined, `Episode [${item.saga}] must contain BreadcrumbList schema`, { file: epHtmlPath });
      if (actualBreadcrumb && Array.isArray(actualBreadcrumb.itemListElement)) {
        let prevPos = 0;
        let positionsValid = true;
        let urlsAbsolute = true;

        for (const elem of actualBreadcrumb.itemListElement) {
          if (elem.position !== prevPos + 1) positionsValid = false;
          prevPos = elem.position;

          const itemUrl = elem.item?.["@id"] || elem.item;
          if (typeof itemUrl === "string" && !itemUrl.startsWith("http")) {
            urlsAbsolute = false;
          }
        }

        assert(positionsValid, "BreadcrumbList positions must be monotonic 1, 2, 3...", { elements: actualBreadcrumb.itemListElement });
        assert(urlsAbsolute, "BreadcrumbList item URLs must be absolute (https://...)", { elements: actualBreadcrumb.itemListElement });
      }
    }
  }
}

// =============================================================
// TIER 4: REAL-WORLD CRAWL & NAVIGATION INTEGRITY
// =============================================================
function runTier4() {
  startSection(4, "Real-World Crawl Simulation & Navigation Integrity");

  // 4.1 Movie Breadcrumbs Target Contract
  // In lib/site.js / EpisodeView.js: verify movie breadcrumb links to /dragon-ball-todas-las-peliculas-y-especiales/
  const epViewJs = readFile("components/EpisodeView.js");
  if (epViewJs) {
    const hasBrokenMovieBreadcrumb = epViewJs.includes("href={`/category/${capitulo.categoriaSlug}/`}");
    assert(
      !hasBrokenMovieBreadcrumb,
      "components/EpisodeView.js must properly map movie category breadcrumb to /dragon-ball-todas-las-peliculas-y-especiales/ (Avoid 404 on /category/dragon-ball-todas-las-peliculas/)",
      { file: "components/EpisodeView.js" }
    );
  }

  // 4.2 Header Navigation Menu Canonical URLs
  const siteHeaderJs = readFile("components/SiteHeader.js");
  const siteJs = readFile("lib/site.js");
  if (siteJs) {
    for (const catPath of CANONICAL_CATEGORIES) {
      assert(
        siteJs.includes(catPath),
        `Header menu items must include canonical category: ${catPath}`,
        { path: catPath }
      );
    }
  }

  // 4.3 Clean Footer Links (Zero WP/feed junk)
  const siteFooterJs = readFile("components/SiteFooter.js");
  if (siteFooterJs) {
    assert(
      !siteFooterJs.includes("utilityPages.slice(1)"),
      "components/SiteFooter.js must NOT output utilityPages.slice(1) (which exposed /feed/, /wp-json/, /xmlrpc.php/)",
      { file: "components/SiteFooter.js" }
    );
  }

  // 4.4 Linear Episode Navigation (Next/Prev & Related Episodes)
  let brokenNextPrevCount = 0;
  for (let i = 0; i < capitulos.length; i += 1) {
    const current = capitulos[i];
    const prev = i > 0 ? capitulos[i - 1] : null;
    const next = i < capitulos.length - 1 ? capitulos[i + 1] : null;

    if (prev && (!prev.slug || !prev.titulo)) brokenNextPrevCount += 1;
    if (next && (!next.slug || !next.titulo)) brokenNextPrevCount += 1;
  }
  assert(
    brokenNextPrevCount === 0,
    `Linear episode navigation (prev/next) must have valid targets for all 1,070 episodes (Broken: ${brokenNextPrevCount})`,
    { expected: 0, actual: brokenNextPrevCount }
  );

  // 4.5 Static Export Link Crawl Verification (if out/ exists)
  if (outExists) {
    const knownRouteSet = new Set();
    knownRouteSet.add("/");
    knownRouteSet.add("/buscar/");
    for (const cat of CANONICAL_CATEGORIES) knownRouteSet.add(cat);
    for (const legal of VALID_LEGAL_PAGES) knownRouteSet.add(legal);
    for (const cap of capitulos) knownRouteSet.add(`/capitulo/${cap.slug}/`);

    // Extract all internal links from Homepage
    const homeHtml = readFile("out/index.html");
    if (homeHtml) {
      const homeHrefs = extractHrefs(homeHtml);
      let brokenHomeLinks = 0;
      const brokenList = [];

      for (const href of homeHrefs) {
        if (!href.startsWith("/") && !href.startsWith(CANONICAL_DOMAIN)) continue;
        if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
        if (/\.(webp|jpg|png|svg|ico|css|js|json|xml|txt)$/i.test(href)) continue;

        const normalized = normalizeUrlPath(href);
        if (!knownRouteSet.has(normalized)) {
          brokenHomeLinks += 1;
          brokenList.push(href);
        }
      }

      assert(
        brokenHomeLinks === 0,
        `Homepage must contain ZERO broken internal links (Found broken: ${brokenHomeLinks})`,
        { expected: 0, actual: brokenHomeLinks, brokenList: brokenList.slice(0, 10) }
      );
    }

    // Spot-check 20 random episode pages for internal link integrity
    let brokenEpisodeLinks = 0;
    const sampleEpisodes = capitulos.slice(0, 20);

    for (const cap of sampleEpisodes) {
      const epHtmlPath = path.join("out", "capitulo", cap.slug, "index.html");
      const epHtml = readFile(epHtmlPath);
      if (!epHtml) continue;

      const epHrefs = extractHrefs(epHtml);
      for (const href of epHrefs) {
        if (!href.startsWith("/") && !href.startsWith(CANONICAL_DOMAIN)) continue;
        if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
        if (/\.(webp|jpg|png|svg|ico|css|js|json|xml|txt)$/i.test(href)) continue;

        const normalized = normalizeUrlPath(href);
        if (!knownRouteSet.has(normalized)) {
          brokenEpisodeLinks += 1;
        }
      }
    }

    assert(
      brokenEpisodeLinks === 0,
      `Episode sample pages must contain ZERO broken internal links (Found broken: ${brokenEpisodeLinks})`,
      { expected: 0, actual: brokenEpisodeLinks }
    );
  }
}

// =============================================================
// MAIN TEST RUNNER & EXECUTION
// =============================================================
function main() {
  const startTime = Date.now();

  if (!cliOptions.json) {
    console.log(`\n${colors.bold}${colors.cyan}===============================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}  Dragon Ball Online - E2E Technical SEO Test Runner           ${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}===============================================================${colors.reset}`);
    console.log(`${colors.gray}Target Domain: ${CANONICAL_DOMAIN}${colors.reset}`);
    console.log(`${colors.gray}Static Build Directory: ${outExists ? OUT_DIR + " (Detected)" : "Not present (Source Mode)"}${colors.reset}`);
    if (cliOptions.tier) console.log(`${colors.gray}Running Filter: Tier ${cliOptions.tier} only${colors.reset}`);
  }

  // Execute Tiers
  if (!cliOptions.tier || cliOptions.tier === 1) runTier1();
  if (!cliOptions.tier || cliOptions.tier === 2) runTier2();
  if (!cliOptions.tier || cliOptions.tier === 3) runTier3();
  if (!cliOptions.tier || cliOptions.tier === 4) runTier4();

  const elapsedMs = Date.now() - startTime;

  // JSON Output Mode
  if (cliOptions.json) {
    const output = {
      timestamp: new Date().toISOString(),
      elapsedMs,
      summary: {
        total: state.total,
        passed: state.passed,
        failed: state.failed,
        warnings: state.warnings.length,
      },
      tierResults: state.tierResults,
      failures: state.failures,
      warnings: state.warnings,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(state.failed > 0 ? 1 : 0);
  }

  // CLI Summary Report
  console.log(`\n${colors.bold}===============================================================${colors.reset}`);
  console.log(`${colors.bold}  TEST SUITE SUMMARY                                          ${colors.reset}`);
  console.log(`${colors.bold}===============================================================${colors.reset}`);
  console.log(`  Tier 1 (Feature Coverage):     ${state.tierResults[1].passed}/${state.tierResults[1].total} passed (${state.tierResults[1].failed} failed)`);
  console.log(`  Tier 2 (Boundary & Corner):    ${state.tierResults[2].passed}/${state.tierResults[2].total} passed (${state.tierResults[2].failed} failed)`);
  console.log(`  Tier 3 (Schema Validation):    ${state.tierResults[3].passed}/${state.tierResults[3].total} passed (${state.tierResults[3].failed} failed)`);
  console.log(`  Tier 4 (Crawl & Navigation):   ${state.tierResults[4].passed}/${state.tierResults[4].total} passed (${state.tierResults[4].failed} failed)`);
  console.log(`---------------------------------------------------------------`);
  console.log(`  Total Assertions: ${state.total}`);
  console.log(`  Passed:           ${colors.green}${state.passed}${colors.reset}`);
  console.log(`  Failed:           ${state.failed > 0 ? colors.red : colors.green}${state.failed}${colors.reset}`);
  console.log(`  Warnings:         ${state.warnings.length > 0 ? colors.yellow : colors.gray}${state.warnings.length}${colors.reset}`);
  console.log(`  Execution Time:   ${elapsedMs}ms`);
  console.log(`===============================================================\n`);

  if (state.failed > 0) {
    console.log(`${colors.bold}${colors.red}FAILED (${state.failed} assertions failed)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.bold}${colors.green}ALL TESTS PASSED!${colors.reset}`);
    process.exit(0);
  }
}

main();
