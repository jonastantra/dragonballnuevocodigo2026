# Original User Request

## 2026-08-23T09:12:20Z

Conduct a deep technical SEO audit and implement comprehensive codebase optimizations on the static Next.js Dragon Ball website to diagnose recent ranking drops, eliminate indexing and duplication penalties, and achieve top search rankings on Google.

Working directory: /Users/john/Documents/Dragon Ball
Integrity mode: demo

## Requirements

### R1. Comprehensive SEO & Indexing Diagnostic Audit
Investigate the entire project to identify why Google search visibility and rankings dropped after recent changes:
- Check for duplicate content issues (e.g. duplicate pages served under both `/capitulo/[slug]` and legacy/alias routes instead of 301 redirects).
- Check for thin content, missing or weak metadata (title tags, meta descriptions, OpenGraph, Twitter cards).
- Check impact of ad scripts (Google AdSense, Google Tag Manager) on page loading performance and Core Web Vitals.
- Analyze URL slug structure, keyword cannibalization, and internal linking hierarchy.

### R2. Technical On-Page & URL Architecture Optimization
Implement all necessary code updates across the Next.js App Router codebase:
- Fix URL routing and canonical tags: ensure legacy WordPress URLs, aliases, and trailing slash variations properly redirect (301) to canonical URLs instead of serving duplicate HTML.
- Generate dynamic, click-optimized `title` and `meta description` tags targeted for Dragon Ball search queries and episodes.
- Implement comprehensive Schema.org JSON-LD structured data (e.g., `VideoObject`, `TVEpisode`, `TVSeries`, `BreadcrumbList`, `WebSite`) with valid fields for rich search results and video carousel eligibility.
- Strengthen internal linking (breadcrumbs, next/previous episode navigation, related sagas/categories, and search discovery).

### R3. Performance, Core Web Vitals & Mobile-First Optimization
Optimize static generation and asset delivery:
- Ensure smooth LCP, CLS, and FID/INP metrics by optimizing iframe embeds, lazy loading, font preloading, and script loading strategies (`next/script`).
- Verify full mobile responsiveness and accessibility for Google mobile-first indexing.

### R4. Sitemaps, Robots & Crawl Budget
- Ensure `app/sitemap.js` generates complete, accurate, canonical URLs for all episodes, sagas, and main pages with appropriate `lastModified`, `changeFrequency`, and `priority`.
- Configure `app/robots.js` to allow clean crawling of canonical routes while disallowing search query URLs and duplicates.

### R5. Audit & Action Documentation
- Produce a detailed markdown report (`AUDIT_SEO_REPORT.md`) documenting all root causes of the ranking drop, all technical and on-page fixes applied, and best practices for future content updates.

## Acceptance Criteria

### Technical Build & Verification
- [ ] `npm run build` succeeds cleanly without any static export or compilation errors.
- [ ] Every episode page and category page includes valid JSON-LD structured data (`VideoObject` / `TVEpisode` / `BreadcrumbList`) and unique, keyword-rich SEO metadata.
- [ ] Canonical tags are 100% consistent across all pages, pointing to the canonical domain (`https://dragonballhdsinlimites.net`).
- [ ] No duplicate content is rendered on alternate/legacy paths; proper redirect or canonical hierarchy is strictly enforced.
- [ ] `sitemap.xml` and `robots.txt` are dynamically validated and contain all canonical pages.
- [ ] An in-depth `AUDIT_SEO_REPORT.md` is generated detailing findings, fixes, and recommendations.
