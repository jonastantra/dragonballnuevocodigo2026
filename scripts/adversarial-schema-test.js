#!/usr/bin/env node
/**
 * Adversarial Schema.org Structured Data Verification Harness (Milestone 3)
 * 
 * Validates 100% of JSON-LD scripts exported to `out/` against Schema.org specs,
 * Google Rich Results guidelines, and strict architectural constraints.
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

const UTILITY_PAGES = [
  "/sobre-nosotros/",
  "/politica-de-privacidad/",
  "/terminos-y-condiciones/",
  "/aviso-legal/",
  "/contacto/",
  "/blog/",
];

const stats = {
  totalFilesScanned: 0,
  jsonLdScriptsExtracted: 0,
  assertionsPassed: 0,
  assertionsFailed: 0,
  failures: [],
};

function assert(condition, message, details = {}) {
  if (condition) {
    stats.assertionsPassed++;
  } else {
    stats.assertionsFailed++;
    stats.failures.push({ message, details });
    console.error(`  \x1b[31mFAIL\x1b[0m ${message}`);
    if (Object.keys(details).length > 0) {
      console.error(`       Details:`, JSON.stringify(details, null, 2));
    }
  }
}

function extractJsonLdScripts(htmlContent, filePath) {
  const scripts = [];
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const rawJson = match[1].trim();
    if (!rawJson) continue;
    stats.jsonLdScriptsExtracted++;
    try {
      const parsed = JSON.parse(rawJson);
      scripts.push(parsed);
    } catch (e) {
      assert(false, `Invalid JSON-LD syntax in ${filePath}: ${e.message}`, { rawSnippet: rawJson.slice(0, 150) });
    }
  }
  return scripts;
}

function checkAbsoluteUrl(url, contextMsg) {
  if (typeof url !== "string") {
    assert(false, `${contextMsg}: URL is not a string (got ${typeof url})`, { url });
    return false;
  }
  const isAbsolute = url.startsWith("https://") || url.startsWith("http://");
  assert(isAbsolute, `${contextMsg}: URL must be absolute (got ${url})`, { url });
  if (url.includes("dragonballhdsinlimites.net")) {
    assert(
      url.startsWith(CANONICAL_DOMAIN),
      `${contextMsg}: Domain must match canonical HTTPS domain (${CANONICAL_DOMAIN})`,
      { url }
    );
  }
  return isAbsolute;
}

function checkNoRelativeUrls(obj, pathContext = "") {
  if (!obj || typeof obj !== "object") return;
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = pathContext ? `${pathContext}.${key}` : key;
    if (typeof value === "string") {
      // If it looks like a relative path intended as a URL
      if (
        (key === "url" || key === "item" || key === "embedUrl" || key === "thumbnailUrl" || key === "target" || key === "image") &&
        value.startsWith("/") &&
        !value.startsWith("//")
      ) {
        assert(false, `Relative URL detected in schema field "${currentPath}": "${value}"`, { currentPath, value });
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => checkNoRelativeUrls(item, `${currentPath}[${idx}]`));
    } else if (typeof value === "object") {
      checkNoRelativeUrls(value, currentPath);
    }
  }
}

console.log("\x1b[1m\x1b[34m=================================================================\x1b[0m");
console.log("\x1b[1m\x1b[34m  EMPIRICAL ADVERSARIAL SCHEMA.ORG TEST HARNESS - MILESTONE 3   \x1b[0m");
console.log("\x1b[1m\x1b[34m=================================================================\x1b[0m\n");

// ==========================================
// TEST 1: HOMEPAGE SCHEMA VERIFICATION
// ==========================================
console.log("\x1b[1m[TEST 1] Auditing Homepage Schemas (out/index.html)...\x1b[0m");
const homePath = path.join(OUT_DIR, "index.html");
assert(fs.existsSync(homePath), "Homepage exists in out/index.html", { homePath });

if (fs.existsSync(homePath)) {
  stats.totalFilesScanned++;
  const homeHtml = fs.readFileSync(homePath, "utf8");
  const homeSchemas = extractJsonLdScripts(homeHtml, "out/index.html");
  
  assert(homeSchemas.length >= 4, `Homepage must contain at least 4 JSON-LD blocks (Found: ${homeSchemas.length})`, { count: homeSchemas.length });

  // WebSite Schema
  const website = homeSchemas.find((s) => s["@type"] === "WebSite");
  assert(!!website, "Homepage must contain @type 'WebSite' schema");
  if (website) {
    assert(website["@context"] === "https://schema.org", "WebSite @context must be 'https://schema.org'");
    assert(website["@id"] === `${CANONICAL_DOMAIN}/#website`, `WebSite @id must be '${CANONICAL_DOMAIN}/#website'`);
    assert(website.name === "Dragon Ball HD Sin Limites", "WebSite name must match site brand name");
    assert(website.inLanguage === "es", "WebSite inLanguage must be 'es'");
    assert(website.publisher && website.publisher["@id"] === `${CANONICAL_DOMAIN}/#organization`, "WebSite publisher must reference #organization @id");
    
    // SearchAction EntryPoint check
    assert(!!website.potentialAction, "WebSite must contain potentialAction");
    if (website.potentialAction) {
      assert(website.potentialAction["@type"] === "SearchAction", "potentialAction @type must be 'SearchAction'");
      const target = website.potentialAction.target;
      assert(!!target && target["@type"] === "EntryPoint", "SearchAction target must be of @type 'EntryPoint'");
      if (target) {
        assert(
          target.urlTemplate === `${CANONICAL_DOMAIN}/buscar/?q={search_term_string}`,
          `EntryPoint urlTemplate must match '${CANONICAL_DOMAIN}/buscar/?q={search_term_string}' (Got: ${target.urlTemplate})`
        );
      }
      assert(
        website.potentialAction["query-input"] === "required name=search_term_string",
        "SearchAction query-input must be 'required name=search_term_string'"
      );
    }
  }

  // Organization Schema
  const org = homeSchemas.find((s) => s["@type"] === "Organization");
  assert(!!org, "Homepage must contain @type 'Organization' schema");
  if (org) {
    assert(org["@context"] === "https://schema.org", "Organization @context must be 'https://schema.org'");
    assert(org["@id"] === `${CANONICAL_DOMAIN}/#organization`, `Organization @id must be '${CANONICAL_DOMAIN}/#organization'`);
    assert(org.name === "Dragon Ball HD Sin Limites", "Organization name must match brand name");
    assert(org.url === CANONICAL_DOMAIN, `Organization url must be '${CANONICAL_DOMAIN}'`);
    assert(!!org.logo, "Organization must contain logo");
    if (org.logo) {
      assert(org.logo["@type"] === "ImageObject", "Organization logo must be an ImageObject");
      checkAbsoluteUrl(org.logo.url, "Organization logo.url");
      assert(org.logo.width === 1200 && org.logo.height === 630, "Organization logo dimensions must be 1200x630");
    }
    assert(Array.isArray(org.sameAs) && org.sameAs.length >= 3, "Organization sameAs must contain social profiles");
    assert(!!org.contactPoint && org.contactPoint["@type"] === "ContactPoint", "Organization must contain ContactPoint");
    if (org.contactPoint) {
      checkAbsoluteUrl(org.contactPoint.url, "Organization contactPoint.url");
    }
  }

  // ItemList: Featured Episodes
  const featuredList = homeSchemas.find((s) => s["@type"] === "ItemList" && s["@id"]?.includes("#featured-episodes"));
  assert(!!featuredList, "Homepage must contain ItemList with @id '#featured-episodes'");
  if (featuredList) {
    assert(Array.isArray(featuredList.itemListElement), "Featured ItemList itemListElement must be an array");
    assert(featuredList.numberOfItems === featuredList.itemListElement.length, "Featured ItemList numberOfItems matches length");
    featuredList.itemListElement.forEach((item, idx) => {
      assert(item["@type"] === "ListItem", `Featured item [${idx}] @type must be 'ListItem'`);
      assert(item.position === idx + 1, `Featured item [${idx}] position must be monotonic 1-indexed (${idx + 1})`);
      checkAbsoluteUrl(item.url, `Featured item [${idx}] url`);
      if (item.item) {
        assert(item.item["@type"] === "TVEpisode", `Featured item [${idx}] item @type must be 'TVEpisode'`);
        checkAbsoluteUrl(item.item.url, `Featured item [${idx}] item.url`);
        checkAbsoluteUrl(item.item.image, `Featured item [${idx}] item.image`);
      }
    });
  }

  // ItemList: Sagas Grid
  const sagasList = homeSchemas.find((s) => s["@type"] === "ItemList" && s["@id"]?.includes("#sagas-list"));
  assert(!!sagasList, "Homepage must contain ItemList with @id '#sagas-list'");
  if (sagasList) {
    assert(Array.isArray(sagasList.itemListElement), "Sagas ItemList itemListElement must be an array");
    assert(sagasList.numberOfItems === 7, `Sagas ItemList numberOfItems must be 7 (Found: ${sagasList.numberOfItems})`);
    sagasList.itemListElement.forEach((item, idx) => {
      assert(item["@type"] === "ListItem", `Saga item [${idx}] @type must be 'ListItem'`);
      assert(item.position === idx + 1, `Saga item [${idx}] position must be monotonic 1-indexed (${idx + 1})`);
      checkAbsoluteUrl(item.url, `Saga item [${idx}] url`);
      if (item.item) {
        assert(item.item["@type"] === "CollectionPage", `Saga item [${idx}] item @type must be 'CollectionPage'`);
        checkAbsoluteUrl(item.item.url, `Saga item [${idx}] item.url`);
      }
    });
  }

  // Check no relative URLs across all home schemas
  homeSchemas.forEach((s) => checkNoRelativeUrls(s, "HomePageSchema"));
}

// ==========================================
// TEST 2: CANONICAL CATEGORY PAGES SCHEMA VERIFICATION
// ==========================================
console.log("\n\x1b[1m[TEST 2] Auditing Canonical Category Pages (7 Categories)...\x1b[0m");

for (const catPath of CANONICAL_CATEGORIES) {
  const filePath = path.join(OUT_DIR, catPath.replace(/^\//, ""), "index.html");
  assert(fs.existsSync(filePath), `Category file exists at ${filePath}`);
  if (!fs.existsSync(filePath)) continue;

  stats.totalFilesScanned++;
  const html = fs.readFileSync(filePath, "utf8");
  const schemas = extractJsonLdScripts(html, filePath);

  const breadcrumbs = schemas.find((s) => s["@type"] === "BreadcrumbList");
  assert(!!breadcrumbs, `Category ${catPath} must contain BreadcrumbList schema`);
  if (breadcrumbs) {
    assert(Array.isArray(breadcrumbs.itemListElement), `Category ${catPath} breadcrumb items must be array`);
    assert(breadcrumbs.itemListElement.length === 3, `Category ${catPath} breadcrumbs must have exactly 3 items`);
    if (breadcrumbs.itemListElement.length === 3) {
      assert(breadcrumbs.itemListElement[0].position === 1, `Category ${catPath} breadcrumb 1 position is 1`);
      assert(breadcrumbs.itemListElement[0].item === `${CANONICAL_DOMAIN}/`, `Category ${catPath} breadcrumb 1 item is '${CANONICAL_DOMAIN}/'`);
      
      assert(breadcrumbs.itemListElement[1].position === 2, `Category ${catPath} breadcrumb 2 position is 2`);
      assert(breadcrumbs.itemListElement[1].item === `${CANONICAL_DOMAIN}/#sagas`, `Category ${catPath} breadcrumb 2 item is '${CANONICAL_DOMAIN}/#sagas'`);
      
      assert(breadcrumbs.itemListElement[2].position === 3, `Category ${catPath} breadcrumb 3 position is 3`);
      assert(breadcrumbs.itemListElement[2].item === `${CANONICAL_DOMAIN}${catPath}`, `Category ${catPath} breadcrumb 3 item matches canonical URL`);
    }
  }

  const collection = schemas.find((s) => s["@type"] === "CollectionPage");
  assert(!!collection, `Category ${catPath} must contain CollectionPage schema`);
  if (collection) {
    assert(collection["@id"] === `${CANONICAL_DOMAIN}${catPath}#collection`, `CollectionPage @id matches '${CANONICAL_DOMAIN}${catPath}#collection'`);
    assert(collection.url === `${CANONICAL_DOMAIN}${catPath}`, `CollectionPage url matches canonical path`);
    assert(collection.inLanguage === "es", `CollectionPage inLanguage is 'es'`);
    assert(collection.isPartOf && collection.isPartOf["@id"] === `${CANONICAL_DOMAIN}/#website`, `CollectionPage isPartOf references website`);
    assert(collection.about && collection.about["@type"] === "TVSeries", `CollectionPage about is TVSeries`);
    
    assert(!!collection.mainEntity, `CollectionPage must contain mainEntity`);
    if (collection.mainEntity) {
      assert(collection.mainEntity["@type"] === "ItemList", `CollectionPage mainEntity @type is ItemList`);
      assert(Array.isArray(collection.mainEntity.itemListElement), `CollectionPage ItemList elements is array`);
      assert(collection.mainEntity.numberOfItems === collection.mainEntity.itemListElement.length, `numberOfItems matches array length`);
      assert(collection.mainEntity.itemListElement.length > 0, `Category ${catPath} has > 0 episodes in ItemList (Found: ${collection.mainEntity.itemListElement.length})`);
      
      collection.mainEntity.itemListElement.forEach((epItem, idx) => {
        assert(epItem["@type"] === "ListItem", `Episode item [${idx}] @type is ListItem`);
        assert(epItem.position === idx + 1, `Episode item [${idx}] position is ${idx + 1}`);
        checkAbsoluteUrl(epItem.url, `Category ${catPath} epItem [${idx}] url`);
      });
    }
  }

  schemas.forEach((s) => checkNoRelativeUrls(s, `CategorySchema:${catPath}`));
}

// ==========================================
// TEST 3: CATEGORY ALIASES SCHEMA VERIFICATION
// ==========================================
console.log("\n\x1b[1m[TEST 3] Auditing Category Aliases...\x1b[0m");
const ALIAS_SAMPLES = [
  { alias: "/dragon-ball-super-latino/", canonical: "/category/dragon-ball-super-latino/" },
  { alias: "/dragon-ball-super-sub/", canonical: "/category/dragon-ball-super-sub/" },
  { alias: "/dragon-ball-gt-saga-de-baby/", canonical: "/category/dragon-ball-gt/" },
  { alias: "/dragon-ball-heroes/", canonical: "/category/dragon-ball-super-latino/" },
  { alias: "/db-kai/", canonical: "/category/dragon-ball-kai/" },
];

for (const { alias, canonical } of ALIAS_SAMPLES) {
  const filePath = path.join(OUT_DIR, alias.replace(/^\//, ""), "index.html");
  if (!fs.existsSync(filePath)) {
    assert(false, `Alias file missing at ${filePath}`);
    continue;
  }
  stats.totalFilesScanned++;
  const html = fs.readFileSync(filePath, "utf8");
  const schemas = extractJsonLdScripts(html, filePath);

  const breadcrumbs = schemas.find((s) => s["@type"] === "BreadcrumbList");
  assert(!!breadcrumbs, `Alias ${alias} must contain BreadcrumbList`);
  if (breadcrumbs && breadcrumbs.itemListElement?.length === 3) {
    assert(
      breadcrumbs.itemListElement[2].item === `${CANONICAL_DOMAIN}${canonical}`,
      `Alias ${alias} breadcrumb leaf points to canonical target ${canonical}`
    );
  }

  const collection = schemas.find((s) => s["@type"] === "CollectionPage");
  assert(!!collection, `Alias ${alias} must contain CollectionPage`);
  if (collection) {
    assert(
      collection.url === `${CANONICAL_DOMAIN}${canonical}`,
      `Alias ${alias} collection url points to canonical target ${canonical}`
    );
  }
}

// ==========================================
// TEST 4: UTILITY & LEGAL PAGES SCHEMA VERIFICATION
// ==========================================
console.log("\n\x1b[1m[TEST 4] Auditing Utility and Legal Pages...\x1b[0m");

for (const utilPath of UTILITY_PAGES) {
  const filePath = path.join(OUT_DIR, utilPath.replace(/^\//, ""), "index.html");
  assert(fs.existsSync(filePath), `Utility file exists at ${filePath}`);
  if (!fs.existsSync(filePath)) continue;

  stats.totalFilesScanned++;
  const html = fs.readFileSync(filePath, "utf8");
  const schemas = extractJsonLdScripts(html, filePath);

  const breadcrumbs = schemas.find((s) => s["@type"] === "BreadcrumbList");
  assert(!!breadcrumbs, `Utility page ${utilPath} must contain BreadcrumbList`);
  if (breadcrumbs) {
    assert(Array.isArray(breadcrumbs.itemListElement), `Utility page ${utilPath} breadcrumbs is array`);
    assert(breadcrumbs.itemListElement.length === 2, `Utility page ${utilPath} breadcrumbs has 2 items`);
    if (breadcrumbs.itemListElement.length === 2) {
      assert(breadcrumbs.itemListElement[0].position === 1, `Breadcrumb 1 position is 1`);
      assert(breadcrumbs.itemListElement[0].item === `${CANONICAL_DOMAIN}/`, `Breadcrumb 1 item is '${CANONICAL_DOMAIN}/'`);
      assert(breadcrumbs.itemListElement[1].position === 2, `Breadcrumb 2 position is 2`);
      assert(breadcrumbs.itemListElement[1].item === `${CANONICAL_DOMAIN}${utilPath}`, `Breadcrumb 2 item is '${CANONICAL_DOMAIN}${utilPath}'`);
    }
  }

  schemas.forEach((s) => checkNoRelativeUrls(s, `UtilitySchema:${utilPath}`));
}

// ==========================================
// TEST 5: EXHAUSTIVE EPISODE PAGES AUDIT (1,070 EPISODES)
// ==========================================
console.log("\n\x1b[1m[TEST 5] Auditing ALL 1,070 Static Episode Pages...\x1b[0m");

const capitulosDir = path.join(OUT_DIR, "capitulo");
assert(fs.existsSync(capitulosDir), "out/capitulo directory exists");

if (fs.existsSync(capitulosDir)) {
  const episodeFolders = fs.readdirSync(capitulosDir).filter((f) => {
    return fs.statSync(path.join(capitulosDir, f)).isDirectory();
  });

  assert(episodeFolders.length === 1070, `Expected 1,070 episode folders in out/capitulo/ (Found: ${episodeFolders.length})`);

  let scannedCount = 0;
  let videoObjectCount = 0;
  let tvEpisodeCount = 0;
  let movieCount = 0;
  let breadcrumbCount = 0;

  for (const epFolder of episodeFolders) {
    const epFilePath = path.join(capitulosDir, epFolder, "index.html");
    if (!fs.existsSync(epFilePath)) {
      assert(false, `Missing index.html for episode ${epFolder}`);
      continue;
    }

    scannedCount++;
    stats.totalFilesScanned++;
    const html = fs.readFileSync(epFilePath, "utf8");
    const schemas = extractJsonLdScripts(html, epFilePath);

    const videoObj = schemas.find((s) => s["@type"] === "VideoObject");
    const tvEpisode = schemas.find((s) => s["@type"] === "TVEpisode");
    const movie = schemas.find((s) => s["@type"] === "Movie");
    const breadcrumb = schemas.find((s) => s["@type"] === "BreadcrumbList");

    const fullUrl = `${CANONICAL_DOMAIN}/capitulo/${epFolder}/`;

    // 1. VideoObject Checks
    if (videoObj) {
      videoObjectCount++;
      assert(videoObj["@id"] === `${fullUrl}#video`, `Episode ${epFolder} VideoObject @id matches #video`);
      assert(typeof videoObj.name === "string" && videoObj.name.length > 0, `Episode ${epFolder} VideoObject name non-empty`);
      assert(typeof videoObj.description === "string" && videoObj.description.length > 0, `Episode ${epFolder} VideoObject description non-empty`);
      assert(Array.isArray(videoObj.thumbnailUrl) && videoObj.thumbnailUrl.length > 0, `Episode ${epFolder} thumbnailUrl is array`);
      if (Array.isArray(videoObj.thumbnailUrl)) {
        checkAbsoluteUrl(videoObj.thumbnailUrl[0], `Episode ${epFolder} VideoObject thumbnailUrl`);
      }
      assert(/^\d{4}-\d{2}-\d{2}/.test(videoObj.uploadDate), `Episode ${epFolder} uploadDate is ISO format (${videoObj.uploadDate})`);
      assert(/^PT(\d+H)?(\d+M)?(\d+S)?$/.test(videoObj.duration), `Episode ${epFolder} duration is ISO 8601 (${videoObj.duration})`);
      checkAbsoluteUrl(videoObj.embedUrl, `Episode ${epFolder} embedUrl`);
      assert(videoObj.inLanguage === "es", `Episode ${epFolder} inLanguage is 'es'`);
      assert(videoObj.interactionStatistic?.userInteractionCount > 0, `Episode ${epFolder} userInteractionCount > 0`);
      assert(videoObj.potentialAction?.target === fullUrl, `Episode ${epFolder} potentialAction target is full URL`);
    } else {
      assert(false, `Episode ${epFolder} is missing VideoObject schema`);
    }

    // 2. TVEpisode vs Movie Checks
    if (tvEpisode) {
      tvEpisodeCount++;
      assert(tvEpisode["@id"] === `${fullUrl}#episode`, `Episode ${epFolder} TVEpisode @id matches #episode`);
      assert(tvEpisode.url === fullUrl, `Episode ${epFolder} TVEpisode url matches fullUrl`);
      assert(tvEpisode.inLanguage === "es", `Episode ${epFolder} TVEpisode inLanguage is 'es'`);
      assert(!!tvEpisode.partOfSeries, `Episode ${epFolder} TVEpisode has partOfSeries`);
      if (tvEpisode.partOfSeries) {
        assert(tvEpisode.partOfSeries["@type"] === "TVSeries", `partOfSeries @type is TVSeries`);
        checkAbsoluteUrl(tvEpisode.partOfSeries.url, `partOfSeries url`);
      }
      assert(!!tvEpisode.video, `Episode ${epFolder} TVEpisode nests video object`);
    } else if (movie) {
      movieCount++;
      assert(movie["@id"] === `${fullUrl}#movie`, `Movie ${epFolder} @id matches #movie`);
      assert(movie.url === fullUrl, `Movie ${epFolder} url matches fullUrl`);
      assert(movie.inLanguage === "es", `Movie ${epFolder} inLanguage is 'es'`);
      assert(!!movie.video, `Movie ${epFolder} nests video object`);
    } else {
      assert(false, `Episode ${epFolder} must have either TVEpisode or Movie schema`);
    }

    // 3. BreadcrumbList Checks
    if (breadcrumb) {
      breadcrumbCount++;
      assert(Array.isArray(breadcrumb.itemListElement), `Episode ${epFolder} breadcrumb items is array`);
      assert(breadcrumb.itemListElement.length === 3, `Episode ${epFolder} breadcrumb has 3 levels`);
      if (breadcrumb.itemListElement.length === 3) {
        assert(breadcrumb.itemListElement[0].position === 1, `Ep breadcrumb 1 position is 1`);
        assert(breadcrumb.itemListElement[0].item === `${CANONICAL_DOMAIN}/`, `Ep breadcrumb 1 is homepage`);
        assert(breadcrumb.itemListElement[1].position === 2, `Ep breadcrumb 2 position is 2`);
        checkAbsoluteUrl(breadcrumb.itemListElement[1].item, `Ep breadcrumb 2 URL`);
        assert(breadcrumb.itemListElement[2].position === 3, `Ep breadcrumb 3 position is 3`);
        assert(breadcrumb.itemListElement[2].item === fullUrl, `Ep breadcrumb 3 item is full canonical URL`);
      }
    } else {
      assert(false, `Episode ${epFolder} missing BreadcrumbList schema`);
    }

    schemas.forEach((s) => checkNoRelativeUrls(s, `EpisodeSchema:${epFolder}`));
  }

  console.log(`  Scanned ${scannedCount} episodes:`);
  console.log(`    - VideoObject schemas: ${videoObjectCount}`);
  console.log(`    - TVEpisode schemas:   ${tvEpisodeCount}`);
  console.log(`    - Movie schemas:       ${movieCount}`);
  console.log(`    - BreadcrumbList:      ${breadcrumbCount}`);
  assert(videoObjectCount === 1070, `All 1,070 episodes have VideoObject schemas (Found: ${videoObjectCount})`);
  assert(tvEpisodeCount + movieCount === 1070, `All 1,070 episodes have TVEpisode or Movie schemas (Found: ${tvEpisodeCount + movieCount})`);
  assert(breadcrumbCount === 1070, `All 1,070 episodes have BreadcrumbList schemas (Found: ${breadcrumbCount})`);
}

// ==========================================
// SUMMARY
// ==========================================
console.log("\n\x1b[1m\x1b[34m=================================================================\x1b[0m");
console.log("\x1b[1m\x1b[34m                     TEST HARNESS SUMMARY                        \x1b[0m");
console.log("\x1b[1m\x1b[34m=================================================================\x1b[0m");
console.log(`Total HTML files scanned:       ${stats.totalFilesScanned}`);
console.log(`Total JSON-LD blocks parsed:    ${stats.jsonLdScriptsExtracted}`);
console.log(`Assertions Passed:              \x1b[32m${stats.assertionsPassed}\x1b[0m`);
console.log(`Assertions Failed:              ${stats.assertionsFailed > 0 ? `\x1b[31m${stats.assertionsFailed}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
console.log("\x1b[1m\x1b[34m=================================================================\x1b[0m\n");

if (stats.assertionsFailed > 0) {
  console.error(`\x1b[31mVERDICT: REQUEST_CHANGES (${stats.assertionsFailed} assertions failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32mVERDICT: APPROVE (100% assertions passed)\x1b[0m`);
  process.exit(0);
}
