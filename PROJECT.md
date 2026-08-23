# Project: Dragon Ball Technical SEO Audit & Codebase Optimization

## Architecture
- **Framework**: Next.js 15 (App Router) with React 19, Tailwind CSS, Sharp, Static HTML Export (`output: "export"`, `trailingSlash: true`).
- **Canonical Domain**: `https://dragonballhdsinlimites.net`
- **Data Pipeline**: `scripts/migrar.js` -> `data/capitulos.json` (1,070 episodes) -> `scripts/optimize-images.js` -> `next build` -> `out/`.
- **Core Route Architecture**:
  - Homepage: `app/page.js` -> `/`
  - Canonical Episode Route: `app/capitulo/[slug]/page.js` -> `/capitulo/[slug]/`
  - Canonical Category Routes: `app/[...legacy]/page.js` -> `/category/[slug]/` and `/dragon-ball-todas-las-peliculas-y-especiales/`
  - Search: `app/buscar/page.js` -> `/buscar/` (noindex, follow)
  - 404: `app/not-found.js` -> `/404.html`
  - Sitemaps: `app/sitemap.js` -> `out/sitemap.xml`
  - Robots: `app/robots.js` -> `out/robots.txt`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Canonical Episode Routing (`/capitulo/[slug]/`) | Enforce `/capitulo/[slug]/` as the single canonical URL for all 1,070 episodes; update `episodeHref` | M1 | Survey (Explorer 1) |
| 2 | Legacy Episode Route Consolidation & 301 Redirects | Eliminate duplicate HTML generation across 6,881 aliases; configure 301 redirects in `vercel.json` and prune `app/[...legacy]/page.js` | M1 | Survey (Explorer 1) |
| 3 | Category Consolidation & Alias Canonicalization | Consolidate 29 category definitions down to 7 canonical categories; set canonical tags on category aliases pointing to canonical parents; remove fake pagination | M1 | Survey (Explorer 1) |
| 4 | Route Collision Elimination in `migrar.js` | Remove `/capitulo/${slug}/` from aliases to eliminate route collision between `capitulo/[slug]` and `[...legacy]` | M1 | Survey (Explorer 3) |
| 5 | Dynamic Episode Title & Meta Description Optimization | Generate concise (<60 char) titles and high-CTR (140-155 char) meta descriptions without bloated boilerplate | M2 | Survey (Explorer 2) |
| 6 | Category & Homepage Metadata Overhaul | Add full keyword-targeted titles and descriptions for homepage and all 7 canonical categories (no cryptic acronyms) | M2 | Survey (Explorer 2) |
| 7 | Fallback OpenGraph & Twitter Social Cards | Implement default OG image (`/og-image.webp`) and full absolute URLs for social sharing | M2 | Survey (Explorer 2) |
| 8 | Search Page Indexing Directives | Set `robots: { index: false, follow: true }` on `/buscar/` to prevent crawl parameter bloat | M2 | Survey (Explorer 2) |
| 9 | Internal Linking & Breadcrumb Fixes | Implement sliding window for related episodes (even PageRank distribution); fix movie breadcrumb URL; clean footer links (remove `/wp-json/`, `/xmlrpc.php/`, `/feed/`) | M2 | Survey (Explorer 2) |
| 10 | Category Landing Page Content Enrichment | Add rich editorial text, saga overview, and structured information to eliminate thin content penalties | M2 | Survey (Explorer 2) |
| 11 | Complete `VideoObject` Schema.org JSON-LD | Ensure absolute `thumbnailUrl`, `duration: "PT24M"`, `inLanguage: "es"`, valid `uploadDate`, and `embedUrl` | M3 | Survey (Explorer 2) |
| 12 | `TVEpisode` & `TVSeries` Schema.org JSON-LD | Wrap episode structured data in TVEpisode/TVSeries schemas with episode numbers for Google Rich Results | M3 | Survey (Explorer 2) |
| 13 | `BreadcrumbList` Schema.org JSON-LD | Add BreadcrumbList structured data to all episode and category pages for SERP breadcrumbs | M3 | Survey (Explorer 2) |
| 14 | `WebSite`, `Organization` & Homepage `ItemList` Schemas | Modernize SearchAction EntryPoint syntax, add Organization markup, and use absolute URLs in ItemList | M3 | Survey (Explorer 2) |
| 15 | LCP Optimization (Remove `contentVisibility: auto` on Hero) | Fix above-the-fold rendering delay in `EpisodeView.js:45` for fast Largest Contentful Paint | M4 | Survey (Explorer 3) |
| 16 | CLS Optimization & Video Facade Retention | Preserve 16:9 aspect-ratio video facade; ensure responsive intrinsic sizes on card grids to prevent mobile CLS | M4 | Survey (Explorer 3) |
| 17 | Script & Font Optimization Verification | Verify AdSense `lazyOnload`, GTM `afterInteractive`, preconnect tags, and self-hosted `next/font` | M4 | Survey (Explorer 3) |
| 18 | Canonical-Only Dynamic `sitemap.xml` | Overhaul `app/sitemap.js` to list only canonical URLs with accurate `lastModified` ISO dates; prune thin legacy/utility pages | M4 | Survey (Explorer 3) |
| 19 | Crawl-Budget-Optimized `robots.txt` | Update `app/robots.js` with explicit `disallow` for `/buscar/`, `/*?*`, `/wp-json/`, `/xmlrpc.php`, `/*/feed/` | M4 | Survey (Explorer 3) |
| 20 | Repository Hygiene | Add `Simpson/` to `.gitignore` and `.vercelignore` to avoid clutter | M4 | Survey (Explorer 3) |
| 21 | Build & Static Export Verification | Verify `npm run build` succeeds cleanly with 0 route collisions and 0 export errors | M5 | Survey (All Explorers) |
| 22 | Comprehensive Technical SEO Audit Report (`AUDIT_SEO_REPORT.md`) | Document root causes, architectural fixes, on-page optimizations, structured data models, before/after metrics, and maintenance guidelines | M5 | Survey (All Explorers) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Routing, Canonical Hierarchy & Duplicate Elimination | Enforce `/capitulo/[slug]/` canonical routing, update `episodeHref`, consolidate categories, configure 301 redirects, prune legacy duplicate generation in `[...legacy]`, fix `migrar.js` collision | none | DONE |
| M2 | On-Page Metadata, Titles, Social Cards & Internal Linking | Dynamic titles/descriptions, OG/Twitter fallback images, search noindex, sliding related episode links, movie breadcrumb fix, clean footer links, category content enrichment | M1 | IN_PROGRESS |
| M3 | Schema.org Structured Data (JSON-LD) | `VideoObject`, `TVEpisode`, `TVSeries`, `BreadcrumbList`, `WebSite`, `Organization`, `ItemList` full implementation with absolute URLs | M2 | PLANNED |
| M4 | Performance, Core Web Vitals, Sitemaps & Robots | Remove `contentVisibility` from hero, optimize mobile CLS grid sizes, overhaul `app/sitemap.js` and `app/robots.js`, gitignore `Simpson/` | M1, M2 | PLANNED |
| M5 | Build Verification, E2E Regression Checks & AUDIT_SEO_REPORT.md | Run full build, check zero 404s/canonical errors, produce exhaustive `AUDIT_SEO_REPORT.md` report | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `lib/site.js` ↔ All App Router Pages
- `episodeHref(capitulo)`: ALWAYS returns `/capitulo/${capitulo.slug}/` (canonical path with trailing slash).
- `categoryPages`: Exports 7 primary canonical categories (`/category/dragon-ball-super-latino/`, `/category/dragon-ball-super-sub/`, `/category/dragon-ball-z/`, `/category/dragon-ball-gt/`, `/category/dragon-ball-kai/`, `/category/dragon-ball/`, `/dragon-ball-todas-las-peliculas-y-especiales/`) plus mapped alias categories pointing to parent canonical paths.
- `siteUrl`: `"https://dragonballhdsinlimites.net"` (constant).
- `getEpisodeTitle(capitulo)`: Returns concise, click-optimized title string.
- `getEpisodeDescription(capitulo)`: Returns concise, 140-155 character snippet.
- `getCategoryTitle(category)`: Returns complete, descriptive Spanish title.
- `getCategoryDescription(category)`: Returns rich descriptive summary.
- `menuItems`: Exports primary navigation links with full, descriptive labels.

## Code Layout
- `app/layout.js`: Global metadataBase, site-wide fonts, GTM/AdSense scripts, WebSite & Organization JSON-LD, fallback OG image.
- `app/page.js`: Homepage metadata, hero, featured episodes, category cards, ItemList JSON-LD.
- `app/capitulo/[slug]/page.js`: Canonical episode page, dynamic metadata, TVEpisode/VideoObject/BreadcrumbList JSON-LD.
- `app/[...legacy]/page.js`: Category landing pages with enriched content, BreadcrumbList/CollectionPage JSON-LD, and legacy non-episode handlers.
- `app/buscar/page.js`: Search page with `robots: { index: false, follow: true }`.
- `app/sitemap.js`: Canonical dynamic XML sitemap generation.
- `app/robots.js`: Search and crawl directives.
- `components/EpisodeView.js`: Episode player, player tabs, sliding window related episodes, breadcrumbs.
- `components/CategoryView.js`: Category header, enriched editorial description, episode grid, breadcrumbs.
- `components/SiteHeader.js`: Descriptive navigation menu items.
- `components/SiteFooter.js`: Clean legal and navigational links.
- `lib/site.js`: Site configuration, route helpers, metadata generators, schema generators.
- `scripts/migrar.js`: Data migration and normalization pipeline.
- `vercel.json`: Hosting configuration, caching headers, 301 redirects.
- `AUDIT_SEO_REPORT.md`: Comprehensive technical SEO audit and optimization documentation.
