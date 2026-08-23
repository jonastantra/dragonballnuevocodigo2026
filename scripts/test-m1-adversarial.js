#!/usr/bin/env node
/**
 * Empirical Adversarial Test Harness for Milestone 1
 * 
 * Verifies:
 * 1. Data Invariants on data/capitulos.json (1,070 episodes, slugs, canonical URLs, aliases, numbers, categories)
 * 2. URL Routing & Redirect Simulation for vercel.json across 120+ simulated legacy and canonical URLs
 * 3. Static Export & Route Collision Verification
 */

const fs = require("fs");
const path = require("path");
const { match, compile } = require("next/dist/compiled/path-to-regexp");

const ROOT = process.cwd();

// ANSI color codes
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = "") {
  totalTests += 1;
  if (condition) {
    passedTests += 1;
    console.log(`  ${GREEN}✓ PASS${RESET} ${testName}`);
    return true;
  } else {
    failedTests += 1;
    const failMsg = `  ${RED}✗ FAIL${RESET} ${testName} ${details ? "(" + details + ")" : ""}`;
    console.log(failMsg);
    failures.push({ testName, details });
    return false;
  }
}

function runDataInvariantsTests() {
  console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
  console.log(`${BOLD}${CYAN} TEST SUITE 1: DATA INVARIANTS ON data/capitulos.json ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

  const dataPath = path.join(ROOT, "data", "capitulos.json");
  assert(fs.existsSync(dataPath), "data/capitulos.json exists");
  if (!fs.existsSync(dataPath)) return;

  const rawData = fs.readFileSync(dataPath, "utf8");
  let capitulos;
  try {
    capitulos = JSON.parse(rawData);
    assert(true, "data/capitulos.json is valid JSON");
  } catch (e) {
    assert(false, "data/capitulos.json is valid JSON", e.message);
    return;
  }

  // 1. Total Episode Count
  assert(capitulos.length === 1070, "Dataset contains exactly 1,070 episodes", `Count: ${capitulos.length}`);

  // 2. Slug Invariants
  const slugSet = new Set();
  let duplicateSlugs = 0;
  let emptySlugs = 0;
  let corruptedHashSlugs = 0;
  let invalidSlugFormat = 0;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  // 3. Canonical URL Invariants
  let invalidCanonicalUrls = 0;
  let nonTrailingSlashUrls = 0;

  // 4. Aliases Invariants
  let nonArrayAliases = 0;
  let aliasesContainingCanonical = 0;
  let emptyAliases = 0;
  let totalAliases = 0;

  // 5. Episode Numbers
  let invalidNumberTypes = 0;
  const numbersBySaga = { db: [], z: [], gt: [], kai: [], super: [], peliculas: [] };

  // 6. Categories & Sagas
  const validCategoriaSlugs = new Set([
    "dragon-ball-super-latino",
    "dragon-ball-super-sub",
    "dragon-ball-z",
    "dragon-ball-gt",
    "dragon-ball-kai",
    "dragon-ball",
    "dragon-ball-todas-las-peliculas",
  ]);
  const validSagas = new Set(["super", "z", "gt", "kai", "db", "peliculas"]);
  let invalidCategoriaSlugs = 0;
  let invalidSagas = 0;
  let emptyTitles = 0;
  let emptyDescriptions = 0;

  for (let i = 0; i < capitulos.length; i += 1) {
    const c = capitulos[i];

    // Slug checks
    if (!c.slug || typeof c.slug !== "string") {
      emptySlugs += 1;
    } else {
      if (slugSet.has(c.slug)) duplicateSlugs += 1;
      slugSet.add(c.slug);

      if (/c028543|[\{\}]/i.test(c.slug)) corruptedHashSlugs += 1;
      if (!slugRegex.test(c.slug)) invalidSlugFormat += 1;
    }

    // Canonical URL checks
    const expectedUrl = `/capitulo/${c.slug}/`;
    if (c.url !== expectedUrl) invalidCanonicalUrls += 1;
    if (c.url && !c.url.endsWith("/")) nonTrailingSlashUrls += 1;

    // Aliases checks
    if (!Array.isArray(c.aliases)) {
      nonArrayAliases += 1;
    } else {
      totalAliases += c.aliases.length;
      if (c.aliases.includes(expectedUrl)) aliasesContainingCanonical += 1;
      for (const a of c.aliases) {
        if (!a || typeof a !== "string" || a.trim() === "") emptyAliases += 1;
      }
    }

    // Number checks
    if (typeof c.numero !== "number" || isNaN(c.numero)) {
      invalidNumberTypes += 1;
    } else if (c.saga && numbersBySaga[c.saga]) {
      numbersBySaga[c.saga].push(c.numero);
    }

    // Category and Saga checks
    if (!validCategoriaSlugs.has(c.categoriaSlug)) invalidCategoriaSlugs += 1;
    if (!validSagas.has(c.saga)) invalidSagas += 1;
    if (!c.titulo || typeof c.titulo !== "string" || c.titulo.trim() === "") emptyTitles += 1;
    if (!c.descripcion || typeof c.descripcion !== "string" || c.descripcion.trim() === "") emptyDescriptions += 1;
  }

  assert(emptySlugs === 0, "Zero empty or non-string slugs", `Found: ${emptySlugs}`);
  assert(duplicateSlugs === 0, "Zero duplicate slugs (1,070 unique slugs)", `Duplicates: ${duplicateSlugs}`);
  assert(corruptedHashSlugs === 0, "Zero WordPress export corrupted hash slugs (e.g. c028543...)", `Found: ${corruptedHashSlugs}`);
  assert(invalidSlugFormat === 0, "All slugs match standard kebab-case format ^[a-z0-9]+(-[a-z0-9]+)*$", `Found: ${invalidSlugFormat}`);
  assert(invalidCanonicalUrls === 0, "All 1,070 episodes have url === '/capitulo/${slug}/'", `Invalid: ${invalidCanonicalUrls}`);
  assert(nonTrailingSlashUrls === 0, "All 1,070 canonical URLs have trailing slashes", `Invalid: ${nonTrailingSlashUrls}`);
  assert(nonArrayAliases === 0, "All 1,070 episodes have an aliases array", `Invalid: ${nonArrayAliases}`);
  assert(aliasesContainingCanonical === 0, "Zero episodes contain their canonical URL in aliases (Collision Elimination)", `Found: ${aliasesContainingCanonical}`);
  assert(emptyAliases === 0, "Zero empty string or invalid aliases", `Found: ${emptyAliases}`);
  assert(invalidNumberTypes === 0, "All episodes have numeric episode numbers", `Invalid: ${invalidNumberTypes}`);
  assert(invalidCategoriaSlugs === 0, "All episodes belong to valid canonical categoriaSlug", `Invalid: ${invalidCategoriaSlugs}`);
  assert(invalidSagas === 0, "All episodes belong to valid saga", `Invalid: ${invalidSagas}`);
  assert(emptyTitles === 0, "All episodes have non-empty titles", `Invalid: ${emptyTitles}`);
  assert(emptyDescriptions === 0, "All episodes have non-empty descriptions", `Invalid: ${emptyDescriptions}`);

  console.log(`\n  ${BOLD}Dataset Breakdown by Saga:${RESET}`);
  console.log(`    - Dragon Ball (Clásico):  ${numbersBySaga.db.length} episodes`);
  console.log(`    - Dragon Ball Z:          ${numbersBySaga.z.length} episodes`);
  console.log(`    - Dragon Ball GT:         ${numbersBySaga.gt.length} episodes`);
  console.log(`    - Dragon Ball Kai:        ${numbersBySaga.kai.length} episodes`);
  console.log(`    - Dragon Ball Super:      ${numbersBySaga.super.length} episodes`);
  console.log(`    - Películas y Especiales: ${numbersBySaga.peliculas.length} movies/specials`);
  console.log(`    - Total Aliases Index:    ${totalAliases} legacy alias paths preserved`);
}

function runVercelRedirectStressTests() {
  console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
  console.log(`${BOLD}${CYAN} TEST SUITE 2: VERCEL 301 REDIRECTS SIMULATION (120+ TEST CASES)${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

  const vercelPath = path.join(ROOT, "vercel.json");
  assert(fs.existsSync(vercelPath), "vercel.json exists");
  if (!fs.existsSync(vercelPath)) return;

  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf8"));
  assert(Array.isArray(vercelConfig.redirects), "vercel.json contains redirects array");

  // Compile all redirect rules into matcher + compiler pairs
  const compiledRules = vercelConfig.redirects.map((rule, idx) => {
    try {
      const matcher = match(rule.source, { decode: decodeURIComponent });
      const compiler = compile(rule.destination);
      return { rule, idx, matcher, compiler };
    } catch (err) {
      console.error(`Failed to compile rule ${idx} (${rule.source}):`, err);
      return null;
    }
  }).filter(Boolean);

  function simulateVercelRedirect(reqPath) {
    // Normalize path by stripping trailing slash for matching if not root
    const cleanPath = reqPath.length > 1 && reqPath.endsWith("/") ? reqPath.slice(0, -1) : reqPath;
    
    // Test both exact path and stripped path as Vercel/Next.js does
    for (const { rule, matcher, compiler } of compiledRules) {
      let res = matcher(cleanPath);
      if (!res && cleanPath !== reqPath) {
        res = matcher(reqPath);
      }
      if (res) {
        try {
          const destination = compiler(res.params);
          return {
            matched: true,
            rule,
            destination,
            statusCode: rule.statusCode || 301,
          };
        } catch (e) {
          return { matched: true, rule, error: e.message };
        }
      }
    }
    return { matched: false };
  }

  // Define 120+ test scenarios across all categories
  const positiveScenarios = [
    // 1. Root single-slug legacy URLs (catch-all negative lookahead)
    { input: "/dragon-ball-super-capitulo-131/", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/dragon-ball-super-capitulo-131", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/dragon-ball-z-capitulo-1/", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/dragon-ball-z-capitulo-291/", expected: "/capitulo/dragon-ball-z-capitulo-291/" },
    { input: "/dragon-ball-gt-capitulo-64/", expected: "/capitulo/dragon-ball-gt-capitulo-64/" },
    { input: "/dragon-ball-kai-capitulo-167/", expected: "/capitulo/dragon-ball-kai-capitulo-167/" },
    { input: "/dragon-ball-capitulo-153/", expected: "/capitulo/dragon-ball-capitulo-153/" },
    { input: "/goku-vs-jiren/", expected: "/capitulo/goku-vs-jiren/" },
    { input: "/la-muerte-de-krillin/", expected: "/capitulo/la-muerte-de-krillin/" },
    { input: "/el-sacrificio-de-vegeta/", expected: "/capitulo/el-sacrificio-de-vegeta/" },
    { input: "/goku-se-transforma-en-super-saiyajin/", expected: "/capitulo/goku-se-transforma-en-super-saiyajin/" },
    { input: "/la-fusion-de-gogeta-vs-janemba/", expected: "/capitulo/la-fusion-de-gogeta-vs-janemba/" },

    // 2. Legacy category prefix URLs (/:category/:slug)
    { input: "/dragon-ball-z/dragon-ball-z-capitulo-1", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/dragon-ball-z/dragon-ball-z-capitulo-1/", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/dragon-ball-z/dragon-ball-z-capitulo-291/", expected: "/capitulo/dragon-ball-z-capitulo-291/" },
    { input: "/dragon-ball-gt/dragon-ball-gt-capitulo-1/", expected: "/capitulo/dragon-ball-gt-capitulo-1/" },
    { input: "/dragon-ball-gt/dragon-ball-gt-capitulo-64/", expected: "/capitulo/dragon-ball-gt-capitulo-64/" },
    { input: "/dragon-ball-super-latino/dragon-ball-super-capitulo-1/", expected: "/capitulo/dragon-ball-super-capitulo-1/" },
    { input: "/dragon-ball-super-latino/dragon-ball-super-capitulo-131/", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/dragon-ball-super-sub/dragon-ball-super-capitulo-1/", expected: "/capitulo/dragon-ball-super-capitulo-1/" },
    { input: "/dragon-ball-super-sub/dragon-ball-super-capitulo-131/", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/dragon-ball-kai/dragon-ball-kai-capitulo-1/", expected: "/capitulo/dragon-ball-kai-capitulo-1/" },
    { input: "/dragon-ball-kai/dragon-ball-kai-capitulo-167/", expected: "/capitulo/dragon-ball-kai-capitulo-167/" },
    { input: "/dragon-ball/dragon-ball-capitulo-1/", expected: "/capitulo/dragon-ball-capitulo-1/" },
    { input: "/dragon-ball/dragon-ball-capitulo-153/", expected: "/capitulo/dragon-ball-capitulo-153/" },
    { input: "/dragon-ball-heroes/super-dragon-ball-heroes-capitulo-1/", expected: "/capitulo/super-dragon-ball-heroes-capitulo-1/" },
    { input: "/dragon-ball-heroes/super-dragon-ball-heroes-capitulo-20/", expected: "/capitulo/super-dragon-ball-heroes-capitulo-20/" },

    // 3. Películas & Especiales nested paths
    { input: "/dragon-ball-todas-las-peliculas/la-batalla-de-los-dioses/", expected: "/capitulo/la-batalla-de-los-dioses/" },
    { input: "/dragon-ball-todas-las-peliculas/dragon-ball-super-peliculas/broly-2018/", expected: "/capitulo/broly-2018/" },
    { input: "/dragon-ball-todas-las-peliculas/dragon-ball-z-peliculas/la-fusion-de-goku-y-vegeta/", expected: "/capitulo/la-fusion-de-goku-y-vegeta/" },
    { input: "/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/la-leyenda-de-shenlong/", expected: "/capitulo/la-leyenda-de-shenlong/" },
    { input: "/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/especiales/el-padre-de-goku/", expected: "/capitulo/el-padre-de-goku/" },
    { input: "/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/especiales/un-futuro-diferente-gohan-y-trunks/", expected: "/capitulo/un-futuro-diferente-gohan-y-trunks/" },

    // 4. Date-based legacy WordPress permalinks
    { input: "/2013/05/dragon-ball-z-capitulo-1/", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/2013/12/dragon-ball-gt-capitulo-10/", expected: "/capitulo/dragon-ball-gt-capitulo-10/" },
    { input: "/2015/07/dragon-ball-super-capitulo-1/", expected: "/capitulo/dragon-ball-super-capitulo-1/" },
    { input: "/2018/03/dragon-ball-super-capitulo-131/", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/2020/01/dragon-ball-heroes-capitulo-20/", expected: "/capitulo/dragon-ball-heroes-capitulo-20/" },
    { input: "/2022/10/dragon-ball-super-super-hero/", expected: "/capitulo/dragon-ball-super-super-hero/" },

    // 5. Feeds, AMP, Trackbacks
    { input: "/dragon-ball-super-capitulo-131/feed", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/dragon-ball-super-capitulo-131/feed/", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/dragon-ball-z-capitulo-1/amp", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/dragon-ball-z-capitulo-1/amp/", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/dragon-ball-gt-capitulo-5/trackback", expected: "/capitulo/dragon-ball-gt-capitulo-5/" },
    { input: "/dragon-ball-gt-capitulo-5/trackback/", expected: "/capitulo/dragon-ball-gt-capitulo-5/" },
    { input: "/capitulo/dragon-ball-super-capitulo-131/feed", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/capitulo/dragon-ball-super-capitulo-131/feed/", expected: "/capitulo/dragon-ball-super-capitulo-131/" },
    { input: "/capitulo/dragon-ball-z-capitulo-1/amp", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/capitulo/dragon-ball-z-capitulo-1/amp/", expected: "/capitulo/dragon-ball-z-capitulo-1/" },
    { input: "/capitulo/dragon-ball-kai-capitulo-10/trackback", expected: "/capitulo/dragon-ball-kai-capitulo-10/" },

    // 6. WordPress IDs & Archives
    { input: "/archivos/101", expected: "/" },
    { input: "/archivos/101/", expected: "/" },
    { input: "/archivos/5432/feed", expected: "/" },
    { input: "/archivos/date/2018/05/", expected: "/" },
    { input: "/archivos/date/2021/11/05", expected: "/" },
    { input: "/author/admin/", expected: "/" },
    { input: "/author/jonas/", expected: "/" },
    { input: "/tag/goku-super-saiyajin/", expected: "/" },
    { input: "/tag/torneo-del-poder/", expected: "/" },
    { input: "/page/2/", expected: "/" },
    { input: "/page/15/", expected: "/" },

    // 7. Category Aliases & Sagas
    { input: "/saga-saiyayin", expected: "/category/dragon-ball-z/" },
    { input: "/saga-saiyayin/", expected: "/category/dragon-ball-z/" },
    { input: "/saga-freezer/", expected: "/category/dragon-ball-z/" },
    { input: "/saga-de-cell/", expected: "/category/dragon-ball-z/" },
    { input: "/saga-de-majin-boo/", expected: "/category/dragon-ball-z/" },
    { input: "/saga-de-majin-boo/page/4/", expected: "/category/dragon-ball-z/" },
    { input: "/saga-garlick-jr/", expected: "/category/dragon-ball-z/" },
    { input: "/dragon-ball-z-capitulos-online-espanol-latino/", expected: "/category/dragon-ball-z/" },
    { input: "/dragon-ball-z-capitulos-online-espanol-latino/page/2/", expected: "/category/dragon-ball-z/" },
    { input: "/dragonballz-capitulos-online-espanol-latino/", expected: "/category/dragon-ball-z/" },
    { input: "/category/dragon-ball-z/page/2/", expected: "/category/dragon-ball-z/" },
    { input: "/category/dragon-ball-z/page/4/", expected: "/category/dragon-ball-z/" },
    { input: "/dragon-ball-gt-capitulos-completos-latinos-online/", expected: "/category/dragon-ball-gt/" },
    { input: "/dragon-ball-gt-saga-el-gran-viaje/", expected: "/category/dragon-ball-gt/" },
    { input: "/dragon-ball-gt-saga-el-gran-viaje/page/2/", expected: "/category/dragon-ball-gt/" },
    { input: "/dragon-ball-gt-saga-de-baby/", expected: "/category/dragon-ball-gt/" },
    { input: "/dragon-ball-gt-saga-de-super-androide-17/", expected: "/category/dragon-ball-gt/" },
    { input: "/dragon-ball-gt-saga-de-los-dragones-malignos/", expected: "/category/dragon-ball-gt/" },
    { input: "/category/dragon-ball-gt/dragon-ball-gt-saga-de-baby/", expected: "/category/dragon-ball-gt/" },
    { input: "/category/dragon-ball-gt/dragon-ball-gt-saga-de-super-androide-17/", expected: "/category/dragon-ball-gt/" },
    { input: "/db-kai/", expected: "/category/dragon-ball-kai/" },
    { input: "/21-torneo-de-las-artes-marciales-dragon-ball/", expected: "/category/dragon-ball/" },
    { input: "/category/dragon-ball/21-torneo-de-las-artes-marciales/", expected: "/category/dragon-ball/" },
    { input: "/category/dragon-ball/22-torneo-de-las-artes-marciales/", expected: "/category/dragon-ball/" },
    { input: "/category/dragon-ball/23o-torneo-de-las-artes-marciales/", expected: "/category/dragon-ball/" },
    { input: "/category/dragon-ball/saga-de-piccolo-daimaku/", expected: "/category/dragon-ball/" },
    { input: "/dragon-ball-super-sub/", expected: "/category/dragon-ball-super-sub/" },
    { input: "/category/blog/", expected: "/blog/" },
    { input: "/blog/noticia-dragon-ball-super-2/", expected: "/capitulo/noticia-dragon-ball-super-2/" },

    // 8. WordPress System URLs & Media
    { input: "/feed", expected: "/" },
    { input: "/feed/", expected: "/" },
    { input: "/feed/rss2/", expected: "/" },
    { input: "/comments/feed/", expected: "/" },
    { input: "/comments/feed/atom/", expected: "/" },
    { input: "/wp-json", expected: "/" },
    { input: "/wp-json/", expected: "/" },
    { input: "/wp-json/wp/v2/posts", expected: "/" },
    { input: "/xmlrpc.php", expected: "/" },
    { input: "/wp-admin", expected: "/" },
    { input: "/wp-admin/", expected: "/" },
    { input: "/wp-admin/edit.php", expected: "/" },
    { input: "/wp-login.php", expected: "/" },
    { input: "/wp-content/uploads/2018/05/goku.jpg", expected: "/uploads/2018/05/goku.jpg" },
    { input: "/wp-content/uploads/covers/dbz-01.png", expected: "/uploads/covers/dbz-01.png" },
  ];

  console.log(`  ${BOLD}Running ${positiveScenarios.length} Positive Legacy Redirect Tests...${RESET}`);
  let positivePassed = 0;
  for (const { input, expected } of positiveScenarios) {
    const res = simulateVercelRedirect(input);
    const pass = res.matched && res.destination === expected && res.statusCode === 301;
    assert(
      pass,
      `Redirect '${input}' -> '${expected}' (301)`,
      res.matched ? `Got '${res.destination}' (${res.statusCode})` : "NO MATCH"
    );
    if (pass) positivePassed += 1;
  }

  // Negative Scenarios: Canonical and Static Routes MUST NOT Match Any Redirect Rule
  const negativeScenarios = [
    // Homepage
    "/",
    // Canonical Categories
    "/category/dragon-ball-super-latino/",
    "/category/dragon-ball-super-sub/",
    "/category/dragon-ball-z/",
    "/category/dragon-ball-gt/",
    "/category/dragon-ball-kai/",
    "/category/dragon-ball/",
    "/dragon-ball-todas-las-peliculas-y-especiales/",
    // Canonical Episode URLs
    "/capitulo/dragon-ball-super-capitulo-131/",
    "/capitulo/dragon-ball-z-capitulo-1/",
    "/capitulo/dragon-ball-gt-capitulo-64/",
    "/capitulo/dragon-ball-kai-capitulo-167/",
    "/capitulo/dragon-ball-capitulo-153/",
    "/capitulo/la-batalla-de-los-dioses/",
    // Utility & Legal Pages
    "/buscar/",
    "/blog/",
    "/politica-de-privacidad/",
    "/terminos-y-condiciones/",
    "/aviso-legal/",
    "/contacto/",
    // Static Files
    "/sitemap.xml",
    "/robots.txt",
    "/favicon.ico",
    "/ads.txt",
    "/_next/static/chunks/main.js",
    "/uploads/2018/05/goku.webp",
    "/optimized/hero.webp",
  ];

  console.log(`\n  ${BOLD}Running ${negativeScenarios.length} Negative Canonical Pass-Through Tests...${RESET}`);
  let negativePassed = 0;
  for (const input of negativeScenarios) {
    const res = simulateVercelRedirect(input);
    const pass = !res.matched;
    assert(
      pass,
      `Pass-through canonical route: '${input}' (NO REDIRECT)`,
      res.matched ? `Unexpectedly redirected to '${res.destination}'` : ""
    );
    if (pass) negativePassed += 1;
  }
}

function runStaticExportAndCollisionChecks() {
  console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
  console.log(`${BOLD}${CYAN} TEST SUITE 3: STATIC EXPORT & ROUTE COLLISION CHECKS ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

  const outDir = path.join(ROOT, "out");
  const outExists = fs.existsSync(outDir);
  assert(outExists, "out/ directory exists (static build completed)");
  if (!outExists) return;

  const dataPath = path.join(ROOT, "data", "capitulos.json");
  const capitulos = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // 1. Check all 1,070 episode HTML files exist
  let missingEpPages = 0;
  for (const c of capitulos) {
    const p = path.join(outDir, "capitulo", c.slug, "index.html");
    if (!fs.existsSync(p)) missingEpPages += 1;
  }
  assert(missingEpPages === 0, "All 1,070 canonical episode HTML pages exist in out/capitulo/[slug]/index.html", `Missing: ${missingEpPages}`);

  // 2. Check canonical category pages exist
  const canonicalCats = [
    "category/dragon-ball-super-latino",
    "category/dragon-ball-super-sub",
    "category/dragon-ball-z",
    "category/dragon-ball-gt",
    "category/dragon-ball-kai",
    "category/dragon-ball",
    "dragon-ball-todas-las-peliculas-y-especiales",
  ];
  let missingCats = 0;
  for (const cat of canonicalCats) {
    const p = path.join(outDir, cat, "index.html");
    if (!fs.existsSync(p)) missingCats += 1;
  }
  assert(missingCats === 0, "All 7 canonical category HTML pages exist in out/", `Missing: ${missingCats}`);

  // 3. Check that legacy route collision hazards are NOT generated in out/
  // Specifically: out/dragon-ball-z/dragon-ball-z-capitulo-1/index.html should NOT exist as static HTML
  let duplicateHtmlGenerated = 0;
  const sampleLegacyDuplicates = [
    "dragon-ball-z/dragon-ball-z-capitulo-1",
    "dragon-ball-gt/dragon-ball-gt-capitulo-64",
    "dragon-ball-super-latino/dragon-ball-super-capitulo-131",
  ];
  for (const dup of sampleLegacyDuplicates) {
    const p = path.join(outDir, dup, "index.html");
    if (fs.existsSync(p)) duplicateHtmlGenerated += 1;
  }
  assert(
    duplicateHtmlGenerated === 0,
    "Zero duplicate HTML files generated for legacy episode alias paths (Handled cleanly by Vercel 301)",
    `Found duplicate HTML: ${duplicateHtmlGenerated}`
  );
}

function main() {
  console.log(`\n${BOLD}================================================================${RESET}`);
  console.log(`${BOLD}  CHALLENGER 1: EMPIRICAL STRESS TEST SUITE (MILESTONE 1)       ${RESET}`);
  console.log(`${BOLD}================================================================${RESET}`);

  runDataInvariantsTests();
  runVercelRedirectStressTests();
  runStaticExportAndCollisionChecks();

  console.log(`\n${BOLD}================================================================${RESET}`);
  console.log(`${BOLD}  SUMMARY OF FINDINGS                                           ${RESET}`);
  console.log(`${BOLD}================================================================${RESET}`);
  console.log(`  Total Assertions: ${totalTests}`);
  console.log(`  Passed:           ${GREEN}${passedTests}${RESET}`);
  console.log(`  Failed:           ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
  console.log(`================================================================\n`);

  if (failedTests > 0) {
    console.log(`${BOLD}${RED}VERDICT: REQUEST_CHANGES (${failedTests} failures detected)${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${BOLD}${GREEN}VERDICT: APPROVE (100% empirical assertions passed cleanly)${RESET}\n`);
    process.exit(0);
  }
}

main();
