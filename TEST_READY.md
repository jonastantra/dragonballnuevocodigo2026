# Test Suite Readiness: E2E SEO & Static Build Verification

## Overview

The automated End-to-End (E2E) Technical SEO Verification Test Suite has been created and validated. It provides comprehensive, requirement-driven, opaque-box testing of the Next.js static site export (`out/`) and pre-build source contracts.

---

## 1. Test Harness Artifacts

| File | Purpose |
|---|---|
| `TEST_INFRA.md` | Test architecture, 4-tier methodology, Google Search Central alignment, and requirement traceability matrix. |
| `scripts/e2e-seo-test.js` | Zero-dependency, high-throughput Node.js E2E test runner executing 39+ assertions across 4 progressive tiers. |
| `package.json` | Updated with `"test": "node scripts/e2e-seo-test.js"` script for single-command verification. |

---

## 2. How to Run the Tests

```bash
# Run the complete test suite (Source contracts + Static export if out/ exists)
npm test
# or
node scripts/e2e-seo-test.js

# Progressive Milestone Verification (Run specific tier)
node scripts/e2e-seo-test.js --tier=1    # Tier 1: Feature Coverage & Canonical Invariants
node scripts/e2e-seo-test.js --tier=2    # Tier 2: Boundary, Corner Cases & Crawl Budget
node scripts/e2e-seo-test.js --tier=3    # Tier 3: Cross-Feature & Schema.org JSON-LD Validation
node scripts/e2e-seo-test.js --tier=4    # Tier 4: Real-World Crawl & Navigation Integrity

# Targeted Execution Modes
node scripts/e2e-seo-test.js --source-only   # Source contracts only (pre-build)
node scripts/e2e-seo-test.js --out-only      # Static build out/ artifacts only (post-build)
node scripts/e2e-seo-test.js --json          # Machine-readable JSON output for CI
node scripts/e2e-seo-test.js --verbose       # Show every passing assertion
```

---

## 3. 4-Tier Test Coverage Summary

| Tier | Focus Area | Assertions | Status |
|---|---|---|---|
| **Tier 1: Feature Coverage** | Canonical domain, canonical tags on `/`, 7 categories, and 1,070 episodes, `<title>`, `<meta description>`, XML sitemap existence, robots.txt existence, audit report. | 15 | 13 Pass / 2 Fail (Baseline) |
| **Tier 2: Boundary & Corner Cases** | Zero duplicate HTML on 6,881+ aliases, `/buscar/` noindex, sitemap sanitization (0 WP junk), robots disallow rules, VideoObject valid thumbnail fallback, LCP hero fix, repository hygiene. | 9 | 1 Pass / 8 Fail (Baseline) |
| **Tier 3: Schema Validation** | Schema.org JSON-LD on all sagas: `VideoObject` (required & recommended fields), `TVEpisode`, `TVSeries`, `BreadcrumbList` (100% absolute URLs), `WebSite`, `Organization`, `ItemList`. | 5 | 3 Pass / 2 Fail (Baseline) |
| **Tier 4: Crawl & Navigation** | Internal link graph consistency (0 broken links), movie breadcrumb resolution, header canonical categories, footer cleanup, linear next/prev navigation. | 10 | 8 Pass / 2 Fail (Baseline) |

---

## 4. Defect Escalation for Implementing Agents

The test suite executed against current pre-optimization codebase identified **14 baseline implementation defects** that must be addressed in subsequent milestones:

1. **M1 (Routing & Canonicals)**:
   - `data/capitulos.json` currently contains legacy WordPress URLs instead of `/capitulo/[slug]/` (1,070 non-canonical URLs).
   - `app/[...legacy]/page.js` `generateStaticParams()` includes episode aliases, generating duplicate static HTML.
2. **M2 (On-Page Metadata, Internal Linking & Breadcrumbs)**:
   - `app/buscar/page.js` missing `robots: { index: false, follow: true }`.
   - `components/EpisodeView.js:24` uses `/category/${capitulo.categoriaSlug}/` causing broken breadcrumbs for movies.
   - `components/SiteFooter.js` iterates `utilityPages.slice(1)` exposing `/feed/`, `/wp-json/`, `/xmlrpc.php/`.
3. **M3 (Structured Data JSON-LD)**:
   - `app/capitulo/[slug]/page.js` emits `thumbnailUrl: undefined` when image is missing instead of fallback image.
   - `app/capitulo/[slug]/page.js` missing `BreadcrumbList` JSON-LD structured data.
   - `app/capitulo/[slug]/page.js` missing `TVEpisode` / `TVSeries` structured data.
4. **M4 (Performance, Sitemaps & Robots)**:
   - `components/EpisodeView.js:45` contains `contentVisibility: "auto"` on above-the-fold player container (damaging LCP).
   - `app/sitemap.js` includes utility/feed/junk URLs (`/feed/`, `/wp-json/`, `/xmlrpc.php/`).
   - `app/robots.js` missing `disallow` directives for `/buscar/`, `/*?*`, `/wp-json/`, `/*/feed/`.
   - `.gitignore` and `.vercelignore` missing `Simpson/`.
5. **M5 (Documentation & Full Build)**:
   - `AUDIT_SEO_REPORT.md` must be generated detailing full audit findings, fixes, and recommendations.

---

## 5. Exit Code Protocol

- Returns exit code `0` when 100% of assertions pass.
- Returns exit code `1` when any assertion fails, with exact file path, line/field context, expected and actual values.
