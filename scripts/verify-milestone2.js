/**
 * Verification script for Milestone 2: On-Page Metadata, Titles, Social Cards & Internal Linking
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
const CAPITULOS_JSON = path.join(ROOT, "data", "capitulos.json");

const SITE_URL = "https://dragonballhdsinlimites.net";

function extractTag(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function extractMeta(html, nameOrProp) {
  // matches name="foo" content="bar" or content="bar" name="foo"
  const regex1 = new RegExp(`<meta[^>]+(?:name|property)=["']${nameOrProp}["'][^>]+content=["']([^"']*)["']`, "i");
  const regex2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${nameOrProp}["']`, "i");
  const m1 = html.match(regex1);
  if (m1) return m1[1].trim();
  const m2 = html.match(regex2);
  if (m2) return m2[1].trim();
  return null;
}

function extractCanonical(html) {
  const regex1 = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i;
  const regex2 = /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i;
  const m1 = html.match(regex1);
  if (m1) return m1[1].trim();
  const m2 = html.match(regex2);
  if (m2) return m2[1].trim();
  return null;
}

async function runMilestone2Verification() {
  console.log("================================================================");
  console.log("MILESTONE 2 EMPIRICAL VERIFICATION HARNESS");
  console.log("================================================================\n");

  const results = {
    episodes: {
      total: 0,
      titlePassed: 0,
      titleWarnings: 0,
      titleErrors: 0,
      descPassed: 0,
      descWarnings: 0,
      descErrors: 0,
      canonicalPassed: 0,
      canonicalErrors: 0,
      ogImagePassed: 0,
      ogImageErrors: 0,
      twitterImagePassed: 0,
      twitterImageErrors: 0,
      relatedLinksPassed: 0,
      relatedLinksErrors: 0,
      boilerplateCount: 0,
      minTitleLen: 999,
      maxTitleLen: 0,
      minDescLen: 999,
      maxDescLen: 0,
      titleLenDist: {},
      descLenDist: {},
      examples: {
        longestTitle: null,
        shortestTitle: null,
        longestDesc: null,
        shortestDesc: null,
      },
      errorList: [],
    },
    searchPage: {
      found: false,
      robotsMeta: null,
      robotsCompliant: false,
      title: null,
      description: null,
      canonical: null,
      errors: [],
    },
    homePage: {
      found: false,
      title: null,
      description: null,
      canonical: null,
      ogImage: null,
      ogImageExists: false,
      errors: [],
    },
    canonicalCategories: {
      total: 0,
      passed: 0,
      errors: [],
      details: [],
    },
    categoryAliases: {
      total: 0,
      passed: 0,
      errors: [],
      details: [],
    },
  };

  // 1. Verify all 1,070 episodes in out/capitulo/*/index.html
  const capitulos = JSON.parse(fs.readFileSync(CAPITULOS_JSON, "utf8"));
  console.log(`[1/4] Checking ${capitulos.length} episodes from data/capitulos.json against out/capitulo/*/index.html...`);

  const epResults = results.episodes;
  epResults.total = capitulos.length;

  for (const cap of capitulos) {
    const slug = cap.slug;
    const epHtmlPath = path.join(OUT_DIR, "capitulo", slug, "index.html");

    if (!fs.existsSync(epHtmlPath)) {
      epResults.errorList.push(`MISSING_FILE: ${epHtmlPath} does not exist`);
      continue;
    }

    const html = fs.readFileSync(epHtmlPath, "utf8");

    // Title Check
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!title) {
      epResults.titleErrors++;
      epResults.errorList.push(`[${slug}] Missing <title> tag`);
    } else {
      const len = title.length;
      if (len < epResults.minTitleLen) {
        epResults.minTitleLen = len;
        epResults.examples.shortestTitle = { slug, title, len };
      }
      if (len > epResults.maxTitleLen) {
        epResults.maxTitleLen = len;
        epResults.examples.longestTitle = { slug, title, len };
      }

      const bracket = Math.floor(len / 10) * 10;
      const bracketKey = `${bracket}-${bracket + 9}`;
      epResults.titleLenDist[bracketKey] = (epResults.titleLenDist[bracketKey] || 0) + 1;

      if (title.includes("undefined") || title.includes("null") || title.includes("[object")) {
        epResults.titleErrors++;
        epResults.errorList.push(`[${slug}] Title contains invalid string: "${title}"`);
      } else if (len > 70) {
        epResults.titleWarnings++;
        epResults.errorList.push(`[${slug}] Title exceeds 70 chars (${len}): "${title}"`);
      } else if (len < 10) {
        epResults.titleWarnings++;
        epResults.errorList.push(`[${slug}] Title too short (${len}): "${title}"`);
      } else {
        epResults.titlePassed++;
      }
    }

    // Description Check
    const desc = extractMeta(html, "description");
    if (!desc) {
      epResults.descErrors++;
      epResults.errorList.push(`[${slug}] Missing meta description`);
    } else {
      const len = desc.length;
      if (len < epResults.minDescLen) {
        epResults.minDescLen = len;
        epResults.examples.shortestDesc = { slug, desc, len };
      }
      if (len > epResults.maxDescLen) {
        epResults.maxDescLen = len;
        epResults.examples.longestDesc = { slug, desc, len };
      }

      const bracket = Math.floor(len / 10) * 10;
      const bracketKey = `${bracket}-${bracket + 9}`;
      epResults.descLenDist[bracketKey] = (epResults.descLenDist[bracketKey] || 0) + 1;

      if (desc.includes("undefined") || desc.includes("null") || desc.includes("[object")) {
        epResults.descErrors++;
        epResults.errorList.push(`[${slug}] Description contains invalid string: "${desc}"`);
      }

      // Boilerplate check
      if (/Episodio\s+\d+\s+de\s+.*disponible online/i.test(desc) || /Capitulo\s+\d+\s+de\s+.*disponible online/i.test(desc)) {
        epResults.boilerplateCount++;
        epResults.errorList.push(`[${slug}] Description contains repetitive boilerplate suffix: "${desc}"`);
      }

      if (len < 100 || len > 175) {
        epResults.descWarnings++;
      } else {
        epResults.descPassed++;
      }
    }

    // Canonical Check
    const canonical = extractCanonical(html);
    const expectedCanonical = `${SITE_URL}/capitulo/${slug}/`;
    if (canonical !== expectedCanonical) {
      epResults.canonicalErrors++;
      epResults.errorList.push(`[${slug}] Canonical mismatch: found "${canonical}", expected "${expectedCanonical}"`);
    } else {
      epResults.canonicalPassed++;
    }

    // OpenGraph & Twitter image check
    const ogImage = extractMeta(html, "og:image");
    const twitterImage = extractMeta(html, "twitter:image");

    if (!ogImage || !ogImage.startsWith("http")) {
      epResults.ogImageErrors++;
      epResults.errorList.push(`[${slug}] Invalid og:image: "${ogImage}"`);
    } else {
      // If it's a local domain URL, verify the file exists in out/
      if (ogImage.startsWith(SITE_URL)) {
        const localPath = path.join(OUT_DIR, ogImage.replace(SITE_URL, ""));
        if (!fs.existsSync(localPath)) {
          epResults.ogImageErrors++;
          epResults.errorList.push(`[${slug}] og:image file missing locally: ${localPath}`);
        } else {
          epResults.ogImagePassed++;
        }
      } else {
        epResults.ogImagePassed++;
      }
    }

    if (!twitterImage || !twitterImage.startsWith("http")) {
      epResults.twitterImageErrors++;
      epResults.errorList.push(`[${slug}] Invalid twitter:image: "${twitterImage}"`);
    } else {
      epResults.twitterImagePassed++;
    }

    // Related Episodes Check in HTML
    const relatedLinksMatch = html.match(/href="\/capitulo\/[^"]+"/g) || [];
    // Filter out self-link if any
    const uniqueRelatedSlugs = new Set();
    for (const match of relatedLinksMatch) {
      const matchSlug = match.replace('href="/capitulo/', '').replace('/"', '').replace('"', '');
      if (matchSlug !== slug) {
        uniqueRelatedSlugs.add(matchSlug);
      }
    }

    // Sagas with >6 episodes should have related episode links
    const sagaCount = capitulos.filter(c => c.saga === cap.saga).length;
    if (sagaCount > 6) {
      if (uniqueRelatedSlugs.size < 6) {
        epResults.relatedLinksErrors++;
        epResults.errorList.push(`[${slug}] Expected >=6 related episodes, found ${uniqueRelatedSlugs.size}`);
      } else {
        epResults.relatedLinksPassed++;
      }
    } else {
      epResults.relatedLinksPassed++;
    }
  }

  console.log(`Episode Results Summary:`);
  console.log(`- Total Episodes: ${epResults.total}`);
  console.log(`- Title: ${epResults.titlePassed} passed, ${epResults.titleWarnings} warnings, ${epResults.titleErrors} errors`);
  console.log(`  Min length: ${epResults.minTitleLen}, Max length: ${epResults.maxTitleLen}`);
  console.log(`  Shortest: [${epResults.examples.shortestTitle?.slug}] "${epResults.examples.shortestTitle?.title}" (${epResults.minTitleLen} chars)`);
  console.log(`  Longest:  [${epResults.examples.longestTitle?.slug}] "${epResults.examples.longestTitle?.title}" (${epResults.maxTitleLen} chars)`);
  console.log(`  Length Distribution:`, epResults.titleLenDist);
  console.log(`- Description: ${epResults.descPassed} passed in 100-175 range, ${epResults.descWarnings} warnings, ${epResults.descErrors} errors`);
  console.log(`  Min length: ${epResults.minDescLen}, Max length: ${epResults.maxDescLen}`);
  console.log(`  Shortest: [${epResults.examples.shortestDesc?.slug}] "${epResults.examples.shortestDesc?.desc}" (${epResults.minDescLen} chars)`);
  console.log(`  Longest:  [${epResults.examples.longestDesc?.slug}] "${epResults.examples.longestDesc?.desc}" (${epResults.maxDescLen} chars)`);
  console.log(`  Length Distribution:`, epResults.descLenDist);
  console.log(`  Boilerplate occurrences: ${epResults.boilerplateCount}`);
  console.log(`- Canonical: ${epResults.canonicalPassed} passed, ${epResults.canonicalErrors} errors`);
  console.log(`- OG Image: ${epResults.ogImagePassed} passed, ${epResults.ogImageErrors} errors`);
  console.log(`- Twitter Image: ${epResults.twitterImagePassed} passed, ${epResults.twitterImageErrors} errors`);
  console.log(`- Related Links: ${epResults.relatedLinksPassed} passed, ${epResults.relatedLinksErrors} errors`);

  // 2. Search Page Verification
  console.log(`\n[2/4] Checking Search Page (out/buscar/index.html)...`);
  const searchHtmlPath = path.join(OUT_DIR, "buscar", "index.html");
  if (fs.existsSync(searchHtmlPath)) {
    results.searchPage.found = true;
    const searchHtml = fs.readFileSync(searchHtmlPath, "utf8");
    const robotsMeta = extractMeta(searchHtml, "robots");
    results.searchPage.robotsMeta = robotsMeta;
    results.searchPage.title = extractTag(searchHtml, /<title[^>]*>([\s\S]*?)<\/title>/i);
    results.searchPage.description = extractMeta(searchHtml, "description");
    results.searchPage.canonical = extractCanonical(searchHtml);

    if (robotsMeta && robotsMeta.includes("noindex") && robotsMeta.includes("follow")) {
      results.searchPage.robotsCompliant = true;
    } else {
      results.searchPage.errors.push(`Robots meta is not "noindex, follow": found "${robotsMeta}"`);
    }

    if (!results.searchPage.title) results.searchPage.errors.push("Missing search title");
    if (!results.searchPage.description) results.searchPage.errors.push("Missing search description");
    if (results.searchPage.canonical !== `${SITE_URL}/buscar/`) {
      results.searchPage.errors.push(`Search canonical mismatch: found "${results.searchPage.canonical}"`);
    }
  } else {
    results.searchPage.errors.push("out/buscar/index.html not found");
  }
  console.log(`- Search Page Found: ${results.searchPage.found}`);
  console.log(`- Search Robots Meta: "${results.searchPage.robotsMeta}" (Compliant: ${results.searchPage.robotsCompliant})`);
  console.log(`- Search Title: "${results.searchPage.title}"`);
  console.log(`- Search Description: "${results.searchPage.description}"`);
  console.log(`- Search Canonical: "${results.searchPage.canonical}"`);

  // 3. Homepage Verification
  console.log(`\n[3/4] Checking Homepage (out/index.html)...`);
  const homeHtmlPath = path.join(OUT_DIR, "index.html");
  if (fs.existsSync(homeHtmlPath)) {
    results.homePage.found = true;
    const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
    results.homePage.title = extractTag(homeHtml, /<title[^>]*>([\s\S]*?)<\/title>/i);
    results.homePage.description = extractMeta(homeHtml, "description");
    results.homePage.canonical = extractCanonical(homeHtml);
    results.homePage.ogImage = extractMeta(homeHtml, "og:image");

    if (results.homePage.ogImage && results.homePage.ogImage.startsWith(SITE_URL)) {
      const localOgPath = path.join(OUT_DIR, results.homePage.ogImage.replace(SITE_URL, ""));
      results.homePage.ogImageExists = fs.existsSync(localOgPath);
    }

    if (!results.homePage.title || results.homePage.title.includes("undefined")) {
      results.homePage.errors.push(`Invalid home title: "${results.homePage.title}"`);
    }
    if (!results.homePage.description || results.homePage.description.includes("undefined")) {
      results.homePage.errors.push(`Invalid home description: "${results.homePage.description}"`);
    }
    if (results.homePage.canonical !== `${SITE_URL}/`) {
      results.homePage.errors.push(`Home canonical mismatch: "${results.homePage.canonical}"`);
    }
  } else {
    results.homePage.errors.push("out/index.html not found");
  }
  console.log(`- Home Title: "${results.homePage.title}" (${results.homePage.title?.length} chars)`);
  console.log(`- Home Description: "${results.homePage.description}" (${results.homePage.description?.length} chars)`);
  console.log(`- Home Canonical: "${results.homePage.canonical}"`);
  console.log(`- Home OG Image: "${results.homePage.ogImage}" (Exists locally: ${results.homePage.ogImageExists})`);

  // 4. Canonical Categories & Editorial Content Verification
  console.log(`\n[4/4] Checking Canonical Categories and Editorial Content...`);
  const canonicalCategoryPaths = [
    "/category/dragon-ball-super-latino/",
    "/category/dragon-ball-super-sub/",
    "/category/dragon-ball-z/",
    "/category/dragon-ball-gt/",
    "/category/dragon-ball-kai/",
    "/category/dragon-ball/",
    "/dragon-ball-todas-las-peliculas-y-especiales/",
  ];

  results.canonicalCategories.total = canonicalCategoryPaths.length;

  for (const catPath of canonicalCategoryPaths) {
    const catHtmlPath = path.join(OUT_DIR, catPath.replace(/^\//, "").replace(/\/$/, ""), "index.html");
    if (!fs.existsSync(catHtmlPath)) {
      results.canonicalCategories.errors.push(`Missing category HTML: ${catHtmlPath}`);
      continue;
    }

    const html = fs.readFileSync(catHtmlPath, "utf8");
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const desc = extractMeta(html, "description");
    const canonical = extractCanonical(html);
    const ogImage = extractMeta(html, "og:image");

    // Check editorial elements
    const hasBreadcrumbs = html.includes("Inicio") && (html.includes("Categorías") || html.includes("Películas") || html.includes("Categor"));
    const hasSynopsisHeading = html.includes("Sinopsis Oficial") || html.includes("Sinopsis");
    const hasCastHeading = html.includes("Elenco de Doblaje") || html.includes("Doblaje") || html.includes("Mario Castañeda") || html.includes("Goku");
    const hasArcsHeading = html.includes("Sagas y Arcos") || html.includes("Arcos") || html.includes("Temporadas") || html.includes("Películas Disponibles");

    const detail = {
      path: catPath,
      title,
      desc,
      canonical,
      ogImage,
      hasBreadcrumbs,
      hasSynopsisHeading,
      hasCastHeading,
      hasArcsHeading,
      valid: true,
    };

    if (!title || title.includes("undefined")) {
      detail.valid = false;
      results.canonicalCategories.errors.push(`[${catPath}] Invalid title: "${title}"`);
    }
    if (!desc || desc.length < 50 || desc.includes("undefined")) {
      detail.valid = false;
      results.canonicalCategories.errors.push(`[${catPath}] Invalid description: "${desc}"`);
    }
    if (canonical !== `${SITE_URL}${catPath}`) {
      detail.valid = false;
      results.canonicalCategories.errors.push(`[${catPath}] Canonical mismatch: found "${canonical}", expected "${SITE_URL}${catPath}"`);
    }
    if (!hasBreadcrumbs) {
      detail.valid = false;
      results.canonicalCategories.errors.push(`[${catPath}] Missing breadcrumbs in HTML`);
    }

    if (detail.valid) {
      results.canonicalCategories.passed++;
    }
    results.canonicalCategories.details.push(detail);
  }

  console.log(`- Canonical Categories: ${results.canonicalCategories.passed}/${results.canonicalCategories.total} passed`);
  for (const d of results.canonicalCategories.details) {
    console.log(`  * ${d.path}`);
    console.log(`    Title: "${d.title}" (${d.title?.length} chars)`);
    console.log(`    Desc: "${d.desc}" (${d.desc?.length} chars)`);
    console.log(`    Canonical: "${d.canonical}"`);
    console.log(`    Editorial: Breadcrumbs=${d.hasBreadcrumbs}, Synopsis=${d.hasSynopsisHeading}, Cast=${d.hasCastHeading}, Arcs=${d.hasArcsHeading}`);
  }

  // 5. Category Aliases Verification (e.g. check 301 / canonical target)
  const aliasPaths = [
    "/dragon-ball-gt-capitulos-completos-latinos-online/",
    "/dragon-ball-gt-saga-de-baby/",
    "/dragon-ball-gt-saga-de-los-dragones-malignos/",
    "/dragon-ball-gt-saga-de-super-androide-17/",
    "/dragon-ball-gt-saga-el-gran-viaje/",
    "/dragon-ball-z-capitulos-online-espanol-latino/",
    "/dragonballz-capitulos-online-espanol-latino/",
    "/saga-saiyayin/",
    "/saga-freezer/",
    "/saga-garlick-jr/",
    "/saga-de-cell/",
    "/saga-de-majin-boo/",
    "/db-kai/",
    "/21-torneo-de-las-artes-marciales-dragon-ball/",
  ];

  results.categoryAliases.total = aliasPaths.length;
  for (const alias of aliasPaths) {
    const aliasHtmlPath = path.join(OUT_DIR, alias.replace(/^\//, "").replace(/\/$/, ""), "index.html");
    if (!fs.existsSync(aliasHtmlPath)) {
      results.categoryAliases.errors.push(`Missing alias HTML: ${aliasHtmlPath}`);
      continue;
    }
    const html = fs.readFileSync(aliasHtmlPath, "utf8");
    const canonical = extractCanonical(html);
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const desc = extractMeta(html, "description");
    
    // Canonical must point to canonical parent
    const isValidCanonical = canonical && canonical.startsWith(SITE_URL) && canonical !== `${SITE_URL}${alias}`;
    if (!isValidCanonical) {
      results.categoryAliases.errors.push(`[${alias}] Alias canonical does not point to parent canonical: "${canonical}"`);
    } else {
      results.categoryAliases.passed++;
    }
    results.categoryAliases.details.push({ alias, canonical, title, desc });
  }

  console.log(`\n- Category Aliases: ${results.categoryAliases.passed}/${results.categoryAliases.total} mapped to canonical parents`);
  for (const a of results.categoryAliases.details) {
    console.log(`  * ${a.alias} -> canonical: ${a.canonical}`);
  }

  // Summary
  console.log("\n================================================================");
  console.log("FINAL EMPIRICAL CHALLENGE VERDICT");
  console.log("================================================================");
  const totalErrors = 
    epResults.errorList.length + 
    results.searchPage.errors.length + 
    results.homePage.errors.length + 
    results.canonicalCategories.errors.length + 
    results.categoryAliases.errors.length;

  console.log(`Total Errors Detected: ${totalErrors}`);
  if (totalErrors === 0) {
    console.log("VERDICT: APPROVE (100% Milestone 2 metadata and directives verified!)");
  } else {
    console.log("VERDICT: REQUEST_CHANGES (Failures detected)");
    console.log("Errors:", {
      episodes: epResults.errorList.slice(0, 10),
      search: results.searchPage.errors,
      home: results.homePage.errors,
      categories: results.canonicalCategories.errors,
      aliases: results.categoryAliases.errors,
    });
  }

  return { results, totalErrors };
}

runMilestone2Verification().catch((err) => {
  console.error(err);
  process.exit(1);
});
