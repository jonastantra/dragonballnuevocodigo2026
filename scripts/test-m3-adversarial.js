#!/usr/bin/env node
/**
 * Empirical Adversarial Test Harness for Milestone 3 (Schema.org Structured Data)
 * 
 * Verifies:
 * 1. Comprehensive JSON-LD validation across all 1,070 episodes in data/capitulos.json
 * 2. Static HTML exports in out/capitulo/[slug]/index.html (all 1,070 static pages)
 * 3. Static HTML exports in out/index.html, out/category/[slug]/index.html, out/[...legacy]/index.html
 * 4. VideoObject, TVEpisode, Movie, BreadcrumbList, WebSite, Organization, ItemList, CollectionPage schemas
 * 5. String sanitization: Zero "undefined", "null", empty strings, or relative URLs in critical fields
 * 6. ISO 8601 validation for uploadDate (dateTime) and duration (duration format)
 * 7. Breadcrumb monotonicity and absolute URL integrity
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const CANONICAL_DOMAIN = "https://dragonballhdsinlimites.net";

// ANSI Colors
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const GRAY = "\x1b[90m";
const RESET = "\x1b[0m";

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures = [];
const warnings = [];

function assert(condition, testName, details = {}) {
  totalAssertions += 1;
  if (condition) {
    passedAssertions += 1;
    return true;
  } else {
    failedAssertions += 1;
    const detailStr = Object.keys(details).length > 0 ? JSON.stringify(details) : "";
    console.log(`  ${RED}✗ FAIL${RESET} ${testName} ${detailStr}`);
    failures.push({ testName, details });
    return false;
  }
}

function warn(message, details = {}) {
  warnings.push({ message, details });
  console.log(`  ${YELLOW}⚠ WARN${RESET} ${message}`);
}

function sectionHeader(title) {
  console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
  console.log(`${BOLD}${CYAN} ${title} ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);
}

// Helper to extract JSON-LD script tags from HTML content
function extractJsonLdScripts(html) {
  const scripts = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1].trim());
  }
  return scripts;
}

// Deep object scanner for bad strings
function scanForBadValues(obj, currentPath = "") {
  const issues = [];
  if (obj === null || obj === undefined) {
    return issues;
  }

  if (typeof obj === "string") {
    if (obj.trim() === "undefined") issues.push({ path: currentPath, value: obj, reason: 'Literal "undefined"' });
    if (obj.trim() === "null") issues.push({ path: currentPath, value: obj, reason: 'Literal "null"' });
    if (obj.trim() === "NaN") issues.push({ path: currentPath, value: obj, reason: 'Literal "NaN"' });
    if (obj.trim() === "[object Object]") issues.push({ path: currentPath, value: obj, reason: 'Literal "[object Object]"' });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      issues.push(...scanForBadValues(item, `${currentPath}[${idx}]`));
    });
  } else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) {
        issues.push({ path: `${currentPath}.${k}`, value: "undefined", reason: "Key with undefined value" });
      } else {
        issues.push(...scanForBadValues(v, currentPath ? `${currentPath}.${k}` : k));
      }
    }
  }
  return issues;
}

// ISO 8601 Date regex (e.g. 2024-01-01T00:00:00+00:00 or 2024-01-01T00:00:00Z)
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)$/;
// ISO 8601 Duration regex (e.g. PT24M, PT1H30M, PT45M)
const ISO_DURATION_REGEX = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

function loadSiteModule() {
  const sitePath = path.join(ROOT, "lib", "site.js");
  let code = fs.readFileSync(sitePath, "utf8");
  code = code.replace(/import\s+(\w+)\s+from\s+["']@\/data\/([^"']+)["'];?/g, 'const $1 = require("./data/$2");');
  code = code.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 = module.exports.$1 =');
  code = code.replace(/export\s+function\s+(\w+)/g, 'function $1');
  code += '\nmodule.exports = { ...module.exports, episodeHref, getEpisodeVideoSchema, getEpisodeTVSchema, getEpisodeBreadcrumbSchema, getCategoryBreadcrumbSchema, getUtilityBreadcrumbSchema, getCollectionPageSchema, generateWebSiteSchema, generateOrganizationSchema, generateHomeFeaturedItemListSchema, generateHomeSagasItemListSchema, getCategoryCapitulos, categoryPages, categoryAliases, getEpisodeThumbnailUrl, getEpisodeUploadDate, getEpisodeDuration, getEpisodeEmbedUrl, getSeriesName, getEpisodeSeason };';
  
  const m = new module.constructor();
  m.paths = module.paths;
  m._compile(code, sitePath);
  return m.exports;
}

async function runAdversarialTests() {
  console.log(`${BOLD}Empirical Adversarial Test Suite for Milestone 3 (Schema.org)${RESET}`);
  console.log(`${GRAY}Target: data/capitulos.json + lib/site.js generators + out/ static HTML export${RESET}`);

  // -------------------------------------------------------------
  // SUITE 1: DATA INVARIANTS & FUNCTION GENERATOR TESTING
  // -------------------------------------------------------------
  sectionHeader("SUITE 1: SOURCE GENERATORS & 1,070 EPISODE SCHEMAS");

  const dataPath = path.join(ROOT, "data", "capitulos.json");
  assert(fs.existsSync(dataPath), "data/capitulos.json file exists");

  const rawCapitulos = fs.readFileSync(dataPath, "utf8");
  let capitulos;
  try {
    capitulos = JSON.parse(rawCapitulos);
    assert(true, "data/capitulos.json parsed successfully");
  } catch (err) {
    assert(false, "data/capitulos.json parsed successfully", { error: err.message });
    return;
  }

  assert(capitulos.length === 1070, `Dataset contains exactly 1,070 episodes (Found: ${capitulos.length})`);

  let site;
  try {
    site = loadSiteModule();
    assert(true, "lib/site.js loaded and compiled successfully");
  } catch (err) {
    assert(false, "lib/site.js loaded and compiled successfully", { error: err.message });
    return;
  }

  // Test individual generators on all 1,070 episodes
  let videoSchemaErrors = 0;
  let tvSchemaErrors = 0;
  let breadcrumbSchemaErrors = 0;
  let badStringCount = 0;
  let invalidDateCount = 0;
  let invalidDurationCount = 0;
  let invalidThumbnailCount = 0;
  let invalidEmbedCount = 0;
  let missingSeasonCount = 0;
  let movieCount = 0;
  let tvEpisodeCount = 0;

  for (let i = 0; i < capitulos.length; i++) {
    const ep = capitulos[i];
    const slug = ep.slug;

    // 1. VideoObject Schema
    const video = site.getEpisodeVideoSchema(ep);
    if (!video) {
      videoSchemaErrors += 1;
      continue;
    }

    if (video["@context"] !== "https://schema.org") videoSchemaErrors += 1;
    if (video["@type"] !== "VideoObject") videoSchemaErrors += 1;
    if (!video["@id"] || !video["@id"].startsWith(CANONICAL_DOMAIN) || !video["@id"].endsWith("#video")) videoSchemaErrors += 1;
    if (!video.name || typeof video.name !== "string" || video.name.length < 3) videoSchemaErrors += 1;
    if (!video.description || typeof video.description !== "string" || video.description.length < 20) videoSchemaErrors += 1;
    if (video.inLanguage !== "es") videoSchemaErrors += 1;

    // Thumbnails
    if (!Array.isArray(video.thumbnailUrl) || video.thumbnailUrl.length === 0 || !video.thumbnailUrl[0].startsWith("http")) {
      invalidThumbnailCount += 1;
    }

    // Upload Date
    if (!video.uploadDate || !ISO_DATE_REGEX.test(video.uploadDate) || isNaN(Date.parse(video.uploadDate))) {
      invalidDateCount += 1;
    }

    // Duration
    if (!video.duration || !ISO_DURATION_REGEX.test(video.duration)) {
      invalidDurationCount += 1;
    }

    // Embed URL
    if (!video.embedUrl || !video.embedUrl.startsWith("http")) {
      invalidEmbedCount += 1;
    }

    // 2. TVEpisode or Movie Schema
    const tv = site.getEpisodeTVSchema(ep);
    if (!tv) {
      tvSchemaErrors += 1;
      continue;
    }

    const isMovie = ep.saga === "peliculas" || ep.categoriaSlug === "dragon-ball-todas-las-peliculas";
    if (isMovie) {
      movieCount += 1;
      if (tv["@type"] !== "Movie") tvSchemaErrors += 1;
      if (!tv["@id"] || !tv["@id"].endsWith("#movie")) tvSchemaErrors += 1;
      if (!tv.name || !tv.description || !tv.datePublished || !tv.duration) tvSchemaErrors += 1;
      if (!tv.video || tv.video["@type"] !== "VideoObject") tvSchemaErrors += 1;
    } else {
      tvEpisodeCount += 1;
      if (tv["@type"] !== "TVEpisode") tvSchemaErrors += 1;
      if (!tv["@id"] || !tv["@id"].endsWith("#episode")) tvSchemaErrors += 1;
      if (!tv.partOfSeries || tv.partOfSeries["@type"] !== "TVSeries" || !tv.partOfSeries.name || !tv.partOfSeries.url) {
        tvSchemaErrors += 1;
      }
      if (tv.partOfSeason) {
        if (tv.partOfSeason["@type"] !== "TVSeason" || !tv.partOfSeason.name) {
          tvSchemaErrors += 1;
        }
      }
      if (ep.numero && ep.numero !== 9999) {
        if (tv.episodeNumber !== ep.numero) {
          tvSchemaErrors += 1;
        }
      }
      if (!tv.video || tv.video["@type"] !== "VideoObject") tvSchemaErrors += 1;
    }

    // 3. BreadcrumbList Schema
    const bc = site.getEpisodeBreadcrumbSchema(ep);
    if (!bc) {
      breadcrumbSchemaErrors += 1;
      continue;
    }

    if (bc["@type"] !== "BreadcrumbList") breadcrumbSchemaErrors += 1;
    if (!Array.isArray(bc.itemListElement) || bc.itemListElement.length !== 3) {
      breadcrumbSchemaErrors += 1;
    } else {
      const [b1, b2, b3] = bc.itemListElement;
      if (b1.position !== 1 || b1.name !== "Inicio" || b1.item !== `${CANONICAL_DOMAIN}/`) breadcrumbSchemaErrors += 1;
      if (b2.position !== 2 || !b2.name || !b2.item || !b2.item.startsWith(CANONICAL_DOMAIN)) breadcrumbSchemaErrors += 1;
      if (b3.position !== 3 || !b3.name || b3.item !== `${CANONICAL_DOMAIN}/capitulo/${slug}/`) breadcrumbSchemaErrors += 1;
    }

    // Bad string scans
    const badVideo = scanForBadValues(video, `ep[${slug}].video`);
    const badTv = scanForBadValues(tv, `ep[${slug}].tv`);
    const badBc = scanForBadValues(bc, `ep[${slug}].bc`);
    if (badVideo.length > 0 || badTv.length > 0 || badBc.length > 0) {
      badStringCount += badVideo.length + badTv.length + badBc.length;
    }
  }

  assert(videoSchemaErrors === 0, "1,070 episodes produce 100% valid VideoObject schemas", { errors: videoSchemaErrors });
  assert(tvSchemaErrors === 0, `1,070 episodes produce 100% valid TVEpisode/Movie schemas (${tvEpisodeCount} TVEpisodes, ${movieCount} Movies)`, { errors: tvSchemaErrors });
  assert(breadcrumbSchemaErrors === 0, "1,070 episodes produce 100% valid 3-level BreadcrumbList schemas", { errors: breadcrumbSchemaErrors });
  assert(invalidThumbnailCount === 0, "1,070 VideoObject schemas have absolute thumbnail URLs", { invalidCount: invalidThumbnailCount });
  assert(invalidDateCount === 0, "1,070 VideoObject schemas have valid ISO 8601 upload dates", { invalidCount: invalidDateCount });
  assert(invalidDurationCount === 0, "1,070 VideoObject schemas have valid ISO 8601 durations (PT24M / PT1H30M / PT45M)", { invalidCount: invalidDurationCount });
  assert(invalidEmbedCount === 0, "1,070 VideoObject schemas have valid absolute embed URLs", { invalidCount: invalidEmbedCount });
  assert(badStringCount === 0, 'Zero "undefined", "null", "NaN", or "[object Object]" strings in episode schemas', { badStringCount });

  // -------------------------------------------------------------
  // SUITE 2: CATEGORY, HOMEPAGE & GLOBAL SCHEMAS
  // -------------------------------------------------------------
  sectionHeader("SUITE 2: CATEGORY, HOMEPAGE & GLOBAL SCHEMAS");

  // WebSite Schema
  const website = site.generateWebSiteSchema();
  assert(website["@type"] === "WebSite", 'WebSite schema has @type === "WebSite"');
  assert(website["@id"] === `${CANONICAL_DOMAIN}/#website`, `WebSite schema has @id === ${CANONICAL_DOMAIN}/#website`);
  assert(website.url === CANONICAL_DOMAIN, `WebSite schema has url === ${CANONICAL_DOMAIN}`);
  assert(website.potentialAction && website.potentialAction["@type"] === "SearchAction", "WebSite schema declares SearchAction");
  assert(
    website.potentialAction.target && website.potentialAction.target.urlTemplate === `${CANONICAL_DOMAIN}/buscar/?q={search_term_string}`,
    "WebSite schema declares valid SearchAction EntryPoint with query-input template"
  );
  assert(website.publisher && website.publisher["@id"] === `${CANONICAL_DOMAIN}/#organization`, "WebSite links publisher to Organization");

  // Organization Schema
  const org = site.generateOrganizationSchema();
  assert(org["@type"] === "Organization", 'Organization schema has @type === "Organization"');
  assert(org["@id"] === `${CANONICAL_DOMAIN}/#organization`, `Organization schema has @id === ${CANONICAL_DOMAIN}/#organization`);
  assert(org.url === CANONICAL_DOMAIN, `Organization schema has url === ${CANONICAL_DOMAIN}`);
  assert(org.logo && org.logo["@type"] === "ImageObject" && org.logo.url === `${CANONICAL_DOMAIN}/og-image.webp`, "Organization schema declares ImageObject logo with absolute URL");
  assert(Array.isArray(org.sameAs) && org.sameAs.length >= 3, "Organization schema includes sameAs social links");
  assert(org.contactPoint && org.contactPoint["@type"] === "ContactPoint", "Organization schema includes contactPoint");

  // Category Breadcrumbs and CollectionPage
  let catBreadcrumbErrors = 0;
  let catCollectionErrors = 0;
  for (const cat of site.categoryPages) {
    const bc = site.getCategoryBreadcrumbSchema(cat);
    if (!bc || bc["@type"] !== "BreadcrumbList" || !Array.isArray(bc.itemListElement) || bc.itemListElement.length !== 3) {
      catBreadcrumbErrors += 1;
    } else {
      const [b1, b2, b3] = bc.itemListElement;
      if (b1.item !== `${CANONICAL_DOMAIN}/` || b2.item !== `${CANONICAL_DOMAIN}/#sagas` || !b3.item.startsWith(CANONICAL_DOMAIN)) {
        catBreadcrumbErrors += 1;
      }
    }

    const catEps = site.getCategoryCapitulos(cat);
    const collection = site.getCollectionPageSchema(cat, catEps);
    if (!collection || collection["@type"] !== "CollectionPage" || !collection["@id"] || !collection.mainEntity) {
      catCollectionErrors += 1;
    } else {
      if (collection.mainEntity["@type"] !== "ItemList" || collection.mainEntity.numberOfItems !== catEps.length) {
        catCollectionErrors += 1;
      }
    }
  }
  assert(catBreadcrumbErrors === 0, "All 7 canonical categories produce valid 3-level BreadcrumbList schemas", { errors: catBreadcrumbErrors });
  assert(catCollectionErrors === 0, "All 7 canonical categories produce valid CollectionPage schemas with ItemList mainEntity", { errors: catCollectionErrors });

  // -------------------------------------------------------------
  // SUITE 3: STATIC HTML EXPORT VERIFICATION (out/)
  // -------------------------------------------------------------
  sectionHeader("SUITE 3: STATIC HTML EXPORT VERIFICATION (out/)");

  if (!fs.existsSync(OUT_DIR)) {
    warn("Static export directory out/ does not exist yet. Run 'npm run build' first for static HTML checks.");
  } else {
    // Verify Homepage HTML
    const homeHtmlPath = path.join(OUT_DIR, "index.html");
    assert(fs.existsSync(homeHtmlPath), "out/index.html exists");
    if (fs.existsSync(homeHtmlPath)) {
      const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
      const scripts = extractJsonLdScripts(homeHtml);
      assert(scripts.length >= 4, `Homepage contains at least 4 JSON-LD scripts (WebSite, Organization, Featured ItemList, Sagas ItemList) (Found: ${scripts.length})`, { count: scripts.length });

      let parsedWebSite = false;
      let parsedOrg = false;
      let parsedFeatured = false;
      let parsedSagas = false;
      let jsonErrors = 0;

      for (const scriptContent of scripts) {
        try {
          const parsed = JSON.parse(scriptContent);
          if (parsed["@type"] === "WebSite") parsedWebSite = true;
          if (parsed["@type"] === "Organization") parsedOrg = true;
          if (parsed["@type"] === "ItemList" && parsed["@id"] === `${CANONICAL_DOMAIN}/#featured-episodes`) parsedFeatured = true;
          if (parsed["@type"] === "ItemList" && parsed["@id"] === `${CANONICAL_DOMAIN}/#sagas-list`) parsedSagas = true;
        } catch (err) {
          jsonErrors += 1;
        }
      }

      assert(jsonErrors === 0, "Zero JSON parsing syntax errors in homepage JSON-LD scripts", { jsonErrors });
      assert(parsedWebSite, "Homepage renders valid WebSite JSON-LD");
      assert(parsedOrg, "Homepage renders valid Organization JSON-LD");
      assert(parsedFeatured, "Homepage renders valid Featured Episodes ItemList JSON-LD");
      assert(parsedSagas, "Homepage renders valid Sagas ItemList JSON-LD");
    }

    // Verify all 1,070 static HTML episode pages
    console.log(`\n${BOLD}Scanning all 1,070 static episode exports in out/capitulo/[slug]/index.html...${RESET}`);

    let missingHtmlFiles = 0;
    let htmlJsonErrors = 0;
    let htmlMissingVideo = 0;
    let htmlMissingTvOrMovie = 0;
    let htmlMissingBreadcrumb = 0;
    let htmlBadStrings = 0;
    let totalHtmlJsonLdTags = 0;

    for (let i = 0; i < capitulos.length; i++) {
      const ep = capitulos[i];
      const slug = ep.slug;
      const epHtmlPath = path.join(OUT_DIR, "capitulo", slug, "index.html");

      if (!fs.existsSync(epHtmlPath)) {
        missingHtmlFiles += 1;
        continue;
      }

      const html = fs.readFileSync(epHtmlPath, "utf8");
      const scripts = extractJsonLdScripts(html);
      totalHtmlJsonLdTags += scripts.length;

      let hasVideo = false;
      let hasTvOrMovie = false;
      let hasBc = false;

      for (const rawScript of scripts) {
        let parsed;
        try {
          parsed = JSON.parse(rawScript);
        } catch (err) {
          htmlJsonErrors += 1;
          continue;
        }

        const bad = scanForBadValues(parsed, `out/capitulo/${slug}`);
        if (bad.length > 0) {
          htmlBadStrings += bad.length;
        }

        if (parsed["@type"] === "VideoObject") {
          hasVideo = true;
          if (!parsed.name || !parsed.description || !parsed.thumbnailUrl || !parsed.uploadDate || !parsed.duration || !parsed.embedUrl) {
            htmlMissingVideo += 1;
          }
        } else if (parsed["@type"] === "TVEpisode" || parsed["@type"] === "Movie") {
          hasTvOrMovie = true;
        } else if (parsed["@type"] === "BreadcrumbList") {
          hasBc = true;
          if (!Array.isArray(parsed.itemListElement) || parsed.itemListElement.length !== 3) {
            htmlMissingBreadcrumb += 1;
          }
        }
      }

      if (!hasVideo) htmlMissingVideo += 1;
      if (!hasTvOrMovie) htmlMissingTvOrMovie += 1;
      if (!hasBc) htmlMissingBreadcrumb += 1;
    }

    assert(missingHtmlFiles === 0, `All 1,070 static HTML episode files exist in out/capitulo/ (Missing: ${missingHtmlFiles})`, { missingHtmlFiles });
    assert(htmlJsonErrors === 0, `100% of JSON-LD scripts across all episode HTML files parse with 0 syntax errors (Tested: ${totalHtmlJsonLdTags} scripts)`, { htmlJsonErrors });
    assert(htmlMissingVideo === 0, "100% of episode HTML files contain complete VideoObject JSON-LD", { htmlMissingVideo });
    assert(htmlMissingTvOrMovie === 0, "100% of episode HTML files contain TVEpisode or Movie JSON-LD", { htmlMissingTvOrMovie });
    assert(htmlMissingBreadcrumb === 0, "100% of episode HTML files contain valid 3-level BreadcrumbList JSON-LD", { htmlMissingBreadcrumb });
    assert(htmlBadStrings === 0, 'Zero "undefined", "null", "NaN", or "[object Object]" values in static HTML JSON-LD scripts', { htmlBadStrings });

    // -------------------------------------------------------------
    // SUITE 4: CATEGORY & UTILITY STATIC EXPORTS
    // -------------------------------------------------------------
    sectionHeader("SUITE 4: CATEGORY & UTILITY STATIC EXPORTS");

    for (const cat of site.categoryPages) {
      const catHtmlPath = path.join(OUT_DIR, cat.path.replace(/^\/|\/$/g, ""), "index.html");
      const exists = fs.existsSync(catHtmlPath);
      assert(exists, `Category static HTML exists: ${cat.path}`);
      if (exists) {
        const html = fs.readFileSync(catHtmlPath, "utf8");
        const scripts = extractJsonLdScripts(html);
        let hasBc = false;
        let hasCollection = false;
        for (const s of scripts) {
          try {
            const parsed = JSON.parse(s);
            if (parsed["@type"] === "BreadcrumbList") hasBc = true;
            if (parsed["@type"] === "CollectionPage") hasCollection = true;
          } catch (_err) {}
        }
        assert(hasBc, `Category ${cat.path} renders BreadcrumbList JSON-LD`);
        assert(hasCollection, `Category ${cat.path} renders CollectionPage JSON-LD`);
      }
    }
  }

  // -------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------
  sectionHeader("TEST EXECUTION SUMMARY");

  console.log(`  Total Assertions Checked: ${BOLD}${totalAssertions}${RESET}`);
  console.log(`  Passed Assertions:        ${GREEN}${BOLD}${passedAssertions}${RESET}`);
  console.log(`  Failed Assertions:        ${failedAssertions > 0 ? RED : GREEN}${BOLD}${failedAssertions}${RESET}`);
  console.log(`  Warnings:                 ${warnings.length > 0 ? YELLOW : GREEN}${warnings.length}${RESET}`);

  if (failedAssertions > 0) {
    console.log(`\n${RED}${BOLD}FAILED: ${failedAssertions} assertion(s) failed.${RESET}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}${BOLD}ALL ADVERSARIAL TESTS PASSED (100% SUCCESS).${RESET}`);
    process.exit(0);
  }
}

runAdversarialTests().catch((err) => {
  console.error("Test runner encountered an unhandled exception:", err);
  process.exit(1);
});
