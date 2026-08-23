# Test Infrastructure & E2E SEO Verification Suite

## 1. Executive Overview & Test Philosophy

The **Dragon Ball Online Static** web application is a high-traffic static anime streaming portal powered by Next.js 15 App Router (`output: "export"`, `trailingSlash: true`). Following significant indexing anomalies and Google search ranking drops caused by route collisions, duplicate alias generation, legacy WordPress artifacts, and unoptimized metadata, this test infrastructure is engineered to enforce strict technical SEO invariants and prevent search visibility regressions.

### Opaque-Box E2E Testing Philosophy
The test harness operates on an **opaque-box paradigm**:
- **Production Artifact Verification**: Tests inspect the compiled HTML, XML, and text files generated in the static export directory (`out/`) exactly as Googlebot and other web crawlers encounter them.
- **Contract & Pipeline Verification**: When testing pre-build or individual milestones, tests evaluate source configurations (`lib/site.js`, `data/capitulos.json`, `app/`, `vercel.json`) to guarantee interface contracts are upheld prior to static compilation.
- **Authoritative Specifications**: All assertions are derived from Google Search Central Documentation, Schema.org standards, RFC 6596 (Canonical Links), W3C HTML5 specifications, and the project requirements outlined in `ORIGINAL_REQUEST.md` and `PROJECT.md`.
- **Zero Facade Testing**: Every test asserts concrete functional outputs (e.g. valid ISO dates, non-empty text nodes, valid URL targets, Schema.org type hierarchies).

---

## 2. 4-Tier Test Methodology

The test suite is structured into four progressive tiers:

```
+-------------------------------------------------------------------------+
|                  4-TIER E2E SEO TEST ARCHITECTURE                       |
+-------------------------------------------------------------------------+
| Tier 1: Core Feature Coverage                                           |
|   - Canonical Domain & Absolute Canonical Tags (/, 7 Categories, 1070 Ep)|
|   - <title> Tags & <meta name="description"> (Length, Content, CTR)      |
|   - JSON-LD Structured Data Insertion                                   |
|   - XML Sitemap & Robots.txt Completeness & RFC Compliance              |
+-------------------------------------------------------------------------+
| Tier 2: Boundary & Corner Cases                                         |
|   - Zero Duplicate HTML Generated on 6,881+ Episode Aliases             |
|   - Search Route (/buscar/) Indexing Blocked (noindex, follow)          |
|   - Sitemap Sanitization: 0 WordPress Artifacts (/feed/, /wp-json/, etc)|
|   - Robots.txt Disallow Rules for Search Queries & WP Endpoints         |
|   - VideoObject Schema Null-Safety & Fallback Thumbnail URLs            |
+-------------------------------------------------------------------------+
| Tier 3: Cross-Feature & Schema Validation                               |
|   - Full Schema.org JSON-LD Hierarchy Validation across all Sagas       |
|   - VideoObject: uploadDate, duration (PT24M), embedUrl, inLanguage (es)|
|   - TVEpisode & TVSeries: episodeNumber, partOfSeries, partOfSeason     |
|   - BreadcrumbList: 100% Absolute URLs & Monotonic Position Sequences   |
|   - WebSite, Organization & ItemList Structured Data                    |
+-------------------------------------------------------------------------+
| Tier 4: Real-World Crawl & Navigation Integrity                         |
|   - Comprehensive Internal Link Graph (0 Broken Links, Trailing Slashes)|
|   - Movie & Special Breadcrumb Resolution                               |
|   - SiteHeader Navigation Menu Canonical Paths                          |
|   - SiteFooter Clean Legal Links (No Legacy WP Endpoints)               |
|   - Linear Next/Previous & Sliding-Window Related Navigation            |
+-------------------------------------------------------------------------+
```

---

### Tier 1: Core Feature Coverage

1. **Canonical Domain Invariant**:
   - The authoritative domain `https://dragonballhdsinlimites.net` must be used across all canonical links, OpenGraph URLs, Twitter cards, sitemaps, and JSON-LD structured data.
2. **Canonical `<link rel="canonical">` Tags**:
   - **Homepage (`/`)**: Must define canonical pointing to `https://dragonballhdsinlimites.net/`.
   - **7 Canonical Categories**:
     - `https://dragonballhdsinlimites.net/category/dragon-ball-super-latino/`
     - `https://dragonballhdsinlimites.net/category/dragon-ball-super-sub/`
     - `https://dragonballhdsinlimites.net/category/dragon-ball-z/`
     - `https://dragonballhdsinlimites.net/category/dragon-ball-gt/`
     - `https://dragonballhdsinlimites.net/category/dragon-ball-kai/`
     - `https://dragonballhdsinlimites.net/category/dragon-ball/`
     - `https://dragonballhdsinlimites.net/dragon-ball-todas-las-peliculas-y-especiales/`
   - **All 1,070 Canonical Episode Pages**:
     - Every episode must point to `https://dragonballhdsinlimites.net/capitulo/[slug]/` with mandatory trailing slash.
3. **`<title>` Tag Presence & Length**:
   - Every page must contain exactly one `<title>` element.
   - Episode titles must be non-empty and optimized for CTR without bloated spam keywords.
4. **`<meta name="description">` Presence & Quality**:
   - Every page must contain a valid `<meta name="description" content="...">`.
   - Descriptions must be descriptive, non-empty, and free of placeholder text ("undefined", "null", "[TBD]").
5. **JSON-LD Script Inclusion**:
   - Every page must embed at least one valid `<script type="application/ld+json">`.
6. **XML Sitemap (`sitemap.xml`)**:
   - Must be valid XML conforming to the Sitemaps.org 0.9 schema.
   - Must contain the homepage, all 7 canonical categories, and all 1,070 canonical episode URLs.
   - Must include `<lastmod>`, `<changefreq>`, and `<priority>`.
7. **Robots Directives (`robots.txt`)**:
   - Must contain `User-agent: *`, `Allow: /`, and link directly to `Sitemap: https://dragonballhdsinlimites.net/sitemap.xml`.

---

### Tier 2: Boundary & Corner Cases

1. **Elimination of Duplicate HTML on Legacy Aliases**:
   - Prior architecture generated full duplicate HTML pages for 6,881+ alias routes in `[...legacy]`.
   - The test verifies that `out/` contains ZERO duplicate static HTML files for episode aliases, OR that aliases are redirected via 301 in `vercel.json` without rendering standalone content.
2. **Search Page Noindex Directives**:
   - `/buscar/` must output `<meta name="robots" content="noindex, follow">` (or equivalent robots meta tag) to prevent search engine indexing of dynamic internal search results.
3. **Sitemap Sanitization**:
   - `sitemap.xml` must contain ZERO non-canonical or utility dummy URLs (e.g. `/feed/`, `/wp-json/`, `/xmlrpc.php/`, `/comments/feed/`, `/page/2/`, `/category/blog/`).
   - Zero duplicate URL entries in `sitemap.xml`.
4. **Crawl Budget Protection via `robots.txt`**:
   - `robots.txt` must explicitly disallow `/buscar/`, query parameters (`/*?*`), WordPress API endpoints (`/wp-json/`, `/xmlrpc.php`), and RSS feeds (`/*/feed/`).
5. **Schema Null-Safety & Fallback Thumbnails**:
   - Every `VideoObject` structured data payload must have a valid `thumbnailUrl` string (or array of strings), never `undefined`, `null`, or empty strings, even if original scraped data lacked an image.

---

### Tier 3: Cross-Feature & Schema Validation

Tests parse and validate Schema.org JSON-LD schemas across sample episodes from all 7 Dragon Ball sagas (DBS Latino, DBS Sub, DBZ, DBGT, DB Kai, DB Classic, Películas):

1. **`VideoObject` Schema Validation**:
   - `@type`: `"VideoObject"`
   - `name`: Non-empty episode title.
   - `description`: Non-empty episode description.
   - `thumbnailUrl`: Valid absolute URL or root-relative image path.
   - `uploadDate`: ISO-8601 formatted date (e.g. `2026-05-20` or `2026-05-20T00:00:00+00:00`).
   - `embedUrl` or `contentUrl`: Valid streaming embed URL.
   - `duration`: Formatted as ISO-8601 duration (e.g., `PT24M`).
   - `inLanguage`: Set to `"es"`.
2. **`TVEpisode` & `TVSeries` Schema Validation**:
   - Wrapping or supplementary TVEpisode schema with `episodeNumber`, `name`, and series association.
3. **`BreadcrumbList` Schema Validation**:
   - `@type`: `"BreadcrumbList"`
   - `itemListElement`: Ordered array of `ListItem` elements with monotonic `position` (1, 2, 3...).
   - All `item` URLs must be absolute (`https://dragonballhdsinlimites.net/...`).
4. **`WebSite` & `Organization` Schemas**:
   - `WebSite` includes site name and valid SearchAction target (`/buscar/?q={search_term_string}`).
   - `Organization` includes brand identity and logo.
5. **`ItemList` Schema**:
   - Homepage ItemList contains valid sagas/sections with absolute URLs and correct counts.

---

### Tier 4: Real-World Crawl & Navigation Integrity

1. **Internal Link Crawl (0 Broken Links)**:
   - Traverses all internal hyperlinks (`<a href="...">`) found in rendered HTML pages.
   - Asserts that all internal links resolve to valid, existing pages in `out/` or the route table.
   - Asserts that all internal directory links adhere to `trailingSlash: true`.
2. **Movie & Special Breadcrumb Resolution**:
   - Movie episodes must link their category breadcrumb to `/dragon-ball-todas-las-peliculas-y-especiales/` instead of broken non-existent paths.
3. **Header Category Links**:
   - Header navigation links must point to the 7 canonical category paths and homepage.
4. **Footer Clean Links**:
   - Footer must not contain dead WordPress URLs (`/wp-json/`, `/xmlrpc.php/`, `/feed/`).
   - Must only contain valid legal pages (`/politica-de-privacidad/`, `/terminos-y-condiciones/`, `/aviso-legal/`, `/contacto/`) and canonical categories.
5. **Episode Next / Previous Navigation**:
   - Validates that every episode's previous/next links use canonical `/capitulo/[slug]/` URLs.
   - Validates that related episode recommendations link to canonical `/capitulo/[slug]/` paths.

---

## 3. Test Runner Architecture

The test runner is implemented in `scripts/e2e-seo-test.js`.

### Key Characteristics
- **Zero External Dependencies**: Built entirely on native Node.js (`fs`, `path`, `url`, `assert`) for maximum speed, portability, and independence from external npm test libraries.
- **Ultra-Fast Parallel Execution**: Streaming regex and DOM tokenizers parse all 1,070+ generated HTML documents and configuration files in under 2 seconds.
- **Dual Execution Engine**:
  - **Source Inspection Mode**: Evaluates source data, contracts, and route generators even before `npm run build` runs.
  - **Static Export Inspection Mode**: Evaluates full `out/` build artifacts when compiled.

### CLI Usage

```bash
# Run the complete test suite (Source + Build checks if out/ exists)
node scripts/e2e-seo-test.js

# Run only a specific Tier
node scripts/e2e-seo-test.js --tier=1
node scripts/e2e-seo-test.js --tier=2
node scripts/e2e-seo-test.js --tier=3
node scripts/e2e-seo-test.js --tier=4

# Run only source contract checks
node scripts/e2e-seo-test.js --source-only

# Run only static build out/ checks
node scripts/e2e-seo-test.js --out-only

# Output structured JSON report (for CI/CD pipelines)
node scripts/e2e-seo-test.js --json

# Verbose output with all passing sub-assertions
node scripts/e2e-seo-test.js --verbose
```

---

## 4. Coverage Checklist & Requirement Traceability

| Requirement | Project Feature | Tier | Test Assertion in `scripts/e2e-seo-test.js` |
|---|---|---|---|
| R1, R2 | Feature 1: Canonical Episode Routing (`/capitulo/[slug]/`) | Tier 1, Tier 4 | `testCanonicalEpisodeUrls()`, `testEpisodeHrefContract()` |
| R1, R2 | Feature 2: Legacy Episode Route Consolidation | Tier 2 | `testNoDuplicateAliasHtml()`, `testLegacyRedirectConfig()` |
| R1, R2 | Feature 3: Category Consolidation & Canonicalization | Tier 1, Tier 4 | `testCanonicalCategories()`, `testCategoryHrefContract()` |
| R1, R2 | Feature 4: Route Collision Elimination | Tier 2 | `testMigrarCollisionElimination()` |
| R2 | Feature 5: Episode Title & Meta Description Optimization | Tier 1 | `testEpisodeMetadataQuality()` |
| R2 | Feature 6: Category & Homepage Metadata Overhaul | Tier 1 | `testCategoryAndHomeMetadata()` |
| R2 | Feature 7: OpenGraph & Twitter Cards | Tier 1 | `testSocialCardsAndOgImage()` |
| R1, R2 | Feature 8: Search Page Indexing Directives (`noindex`) | Tier 2 | `testSearchPageNoindex()` |
| R2 | Feature 9: Internal Linking, Breadcrumbs & Footer Cleanup | Tier 2, Tier 4 | `testFooterCleanLinks()`, `testMovieBreadcrumbs()`, `testRelatedEpisodes()` |
| R1, R2 | Feature 10: Category Content Enrichment | Tier 1, Tier 4 | `testCategoryContentAndTitles()` |
| R2 | Feature 11: Complete `VideoObject` Schema.org JSON-LD | Tier 2, Tier 3 | `testVideoObjectSchema()` |
| R2 | Feature 12: `TVEpisode` & `TVSeries` JSON-LD | Tier 3 | `testTVEpisodeSeriesSchema()` |
| R2 | Feature 13: `BreadcrumbList` Schema.org JSON-LD | Tier 3 | `testBreadcrumbListSchema()` |
| R2 | Feature 14: `WebSite`, `Organization` & `ItemList` Schemas | Tier 3 | `testWebSiteAndItemListSchema()` |
| R3 | Feature 15: LCP Optimization (No `contentVisibility` on Hero) | Tier 2 | `testHeroLcpOptimization()` |
| R3 | Feature 16: CLS Optimization & Video Facade | Tier 2 | `testVideoFacadeCls()` |
| R3 | Feature 17: Script & Font Optimization | Tier 1 | `testScriptLoadingOptimization()` |
| R4 | Feature 18: Canonical-Only Dynamic `sitemap.xml` | Tier 1, Tier 2 | `testSitemapXmlCompleteness()`, `testSitemapSanitization()` |
| R4 | Feature 19: Crawl-Budget-Optimized `robots.txt` | Tier 1, Tier 2 | `testRobotsTxtRules()` |
| - | Feature 20: Repository Hygiene (`Simpson/` in gitignore) | Tier 2 | `testRepositoryHygiene()` |
| R1-R4 | Feature 21: Build & Static Export Verification | All Tiers | `testFullStaticExport()` |
| R5 | Feature 22: Technical SEO Audit Report (`AUDIT_SEO_REPORT.md`) | Tier 1 | `testAuditReportExistence()` |

---

## 5. Pass / Fail & Invalidation Criteria

- **Pass Criteria**: All executed test assertions across requested tiers must pass with 0 errors.
- **Fail Criteria**: Any assertion failure (missing canonical tag, non-canonical URL in sitemap, undefined thumbnail in JSON-LD, duplicate alias HTML, broken internal link) triggers an immediate failure diagnostic with file path, line number, expected vs actual values, and causes exit code `1`.
- **Progressive Milestone Testing**: During implementation milestones (M1-M5), running `node scripts/e2e-seo-test.js` reports exact remaining defects, enabling developers to iteratively verify fixes.
