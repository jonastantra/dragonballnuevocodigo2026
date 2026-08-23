/**
 * Empirical Schema Adversary Test Suite (Milestone 3)
 * Full In-Depth Schema.org Validation against 100% of Domain Entities
 */

import fs from "fs";
import path from "path";
import * as site from "./.site-test.mjs";

const capitulos = JSON.parse(fs.readFileSync("./data/capitulos.json", "utf8"));
const CANONICAL_DOMAIN = "https://dragonballhdsinlimites.net";

let passed = 0;
let failed = 0;
const failures = [];

function check(condition, testName, details = {}) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push({ testName, details });
    console.error(`❌ [FAIL] ${testName}`);
    if (Object.keys(details).length > 0) {
      console.error(`   Details:`, JSON.stringify(details, null, 2));
    }
  }
}

console.log("===============================================================");
console.log("  ADVERSARIAL STRESS TEST: SCHEMA.ORG STRUCTURED DATA (M3)     ");
console.log("===============================================================\n");

// ============================================================================
// 1. WebSite Schema Validation
// ============================================================================
console.log(">>> [1] Validating generateWebSiteSchema()...");
const website = site.generateWebSiteSchema();
check(website["@context"] === "https://schema.org", "WebSite @context must be https://schema.org");
check(website["@type"] === "WebSite", "WebSite @type must be WebSite");
check(website["@id"] === `${CANONICAL_DOMAIN}/#website`, "WebSite @id matches canonical domain URI");
check(website.url === CANONICAL_DOMAIN, "WebSite url matches canonical domain");
check(website.name === "Dragon Ball HD Sin Limites", "WebSite name matches site title");
check(Array.isArray(website.alternateName) && website.alternateName.length >= 3, "WebSite alternateName has multiple brand variants");
check(website.inLanguage === "es", "WebSite inLanguage is 'es'");
check(website.publisher && website.publisher["@id"] === `${CANONICAL_DOMAIN}/#organization`, "WebSite publisher links to organization entity");

// SearchAction EntryPoint specs (Google Search Central Sitelinks Searchbox)
check(website.potentialAction && website.potentialAction["@type"] === "SearchAction", "WebSite potentialAction is SearchAction");
check(website.potentialAction?.target && website.potentialAction.target["@type"] === "EntryPoint", "SearchAction target is EntryPoint");
check(website.potentialAction?.target?.urlTemplate === `${CANONICAL_DOMAIN}/buscar/?q={search_term_string}`, "EntryPoint urlTemplate format");
check(website.potentialAction?.["query-input"] === "required name=search_term_string", "SearchAction query-input is required name=search_term_string");

// ============================================================================
// 2. Organization Schema Validation
// ============================================================================
console.log(">>> [2] Validating generateOrganizationSchema()...");
const org = site.generateOrganizationSchema();
check(org["@context"] === "https://schema.org", "Organization @context is https://schema.org");
check(org["@type"] === "Organization", "Organization @type is Organization");
check(org["@id"] === `${CANONICAL_DOMAIN}/#organization`, "Organization @id matches canonical domain URI");
check(org.name === "Dragon Ball HD Sin Limites", "Organization name matches brand");
check(org.url === CANONICAL_DOMAIN, "Organization url matches canonical domain");
check(org.logo && org.logo["@type"] === "ImageObject", "Organization logo is ImageObject");
check(org.logo?.url === `${CANONICAL_DOMAIN}/og-image.webp`, "Organization logo url is absolute WebP");
check(org.logo?.width === 1200 && org.logo?.height === 630, "Organization logo dimensions are 1200x630");
check(Array.isArray(org.sameAs) && org.sameAs.length >= 3, "Organization sameAs has >= 3 social URLs");
for (const profile of org.sameAs || []) {
  check(profile.startsWith("https://"), `sameAs profile is absolute HTTPS URL (${profile})`);
}
check(org.contactPoint && org.contactPoint["@type"] === "ContactPoint", "Organization contactPoint is ContactPoint");
check(org.contactPoint?.url === `${CANONICAL_DOMAIN}/contacto/`, "ContactPoint url is absolute canonical link");
check(Array.isArray(org.contactPoint?.availableLanguage) && org.contactPoint.availableLanguage.includes("Spanish"), "ContactPoint availableLanguage includes Spanish");

// ============================================================================
// 3. Homepage ItemList Schemas
// ============================================================================
console.log(">>> [3] Validating Homepage ItemList Schemas...");
const featuredEpisodes = capitulos.filter((c) => c.imagen).slice(0, 4);
const featuredSchema = site.generateHomeFeaturedItemListSchema(featuredEpisodes);
check(featuredSchema["@context"] === "https://schema.org", "Featured ItemList @context is https://schema.org");
check(featuredSchema["@type"] === "ItemList", "Featured ItemList @type is ItemList");
check(featuredSchema["@id"] === `${CANONICAL_DOMAIN}/#featured-episodes`, "Featured ItemList @id is #featured-episodes");
check(featuredSchema.numberOfItems === featuredEpisodes.length, "Featured ItemList numberOfItems matches input length");
check(Array.isArray(featuredSchema.itemListElement), "Featured ItemList itemListElement is array");

featuredSchema.itemListElement?.forEach((item, index) => {
  check(item["@type"] === "ListItem", `Featured item [${index}] @type is ListItem`);
  check(item.position === index + 1, `Featured item [${index}] position is strictly ${index + 1}`);
  check(typeof item.name === "string" && item.name.length > 0, `Featured item [${index}] name is non-empty string`);
  check(item.url.startsWith(`${CANONICAL_DOMAIN}/capitulo/`), `Featured item [${index}] url is canonical episode URL (${item.url})`);
  check(item.image.startsWith("https://"), `Featured item [${index}] image is absolute URL (${item.image})`);
  check(item.item && item.item["@type"] === "TVEpisode", `Featured item [${index}] item is TVEpisode`);
  check(item.item?.["@id"] === `${item.url}#episode`, `Featured item [${index}] item @id matches #episode`);
});

// Sagas ItemList
const sections = site.categoryPages.map((cat) => {
  const matches = capitulos.filter(cat.filter);
  const cover = matches.find((c) => c.imagen)?.imagen || "/og-image.webp";
  return { title: cat.title, href: cat.path, cover };
});
const sagasSchema = site.generateHomeSagasItemListSchema(sections);
check(sagasSchema["@context"] === "https://schema.org", "Sagas ItemList @context is https://schema.org");
check(sagasSchema["@type"] === "ItemList", "Sagas ItemList @type is ItemList");
check(sagasSchema["@id"] === `${CANONICAL_DOMAIN}/#sagas-list`, "Sagas ItemList @id is #sagas-list");
check(sagasSchema.numberOfItems === 7, "Sagas ItemList numberOfItems is 7");
check(Array.isArray(sagasSchema.itemListElement) && sagasSchema.itemListElement.length === 7, "Sagas ItemList contains exactly 7 items");

sagasSchema.itemListElement?.forEach((item, index) => {
  check(item["@type"] === "ListItem", `Saga item [${index}] @type is ListItem`);
  check(item.position === index + 1, `Saga item [${index}] position is strictly ${index + 1}`);
  check(typeof item.name === "string" && item.name.length > 0, `Saga item [${index}] name is non-empty string`);
  check(item.url.startsWith(CANONICAL_DOMAIN), `Saga item [${index}] url is absolute (${item.url})`);
  check(item.image.startsWith("https://"), `Saga item [${index}] image is absolute (${item.image})`);
  check(item.item && item.item["@type"] === "CollectionPage", `Saga item [${index}] item is CollectionPage`);
  check(item.item?.["@id"] === `${item.url}#collection`, `Saga item [${index}] item @id matches #collection`);
});

// ============================================================================
// 4. All 7 Canonical Category Pages: BreadcrumbList & CollectionPage
// ============================================================================
console.log(">>> [4] Validating All 7 Canonical Category Pages...");
for (const cat of site.categoryPages) {
  const catCaps = site.getCategoryCapitulos(cat);
  const canonicalUrl = `${CANONICAL_DOMAIN}${cat.path}`;

  // Breadcrumbs
  const breadcrumb = site.getCategoryBreadcrumbSchema(cat);
  check(breadcrumb["@context"] === "https://schema.org", `Category [${cat.path}] breadcrumb @context`);
  check(breadcrumb["@type"] === "BreadcrumbList", `Category [${cat.path}] breadcrumb @type`);
  check(Array.isArray(breadcrumb.itemListElement) && breadcrumb.itemListElement.length === 3, `Category [${cat.path}] has 3-level breadcrumbs`);
  if (breadcrumb.itemListElement?.length === 3) {
    check(breadcrumb.itemListElement[0].position === 1, `Breadcrumb 1 is position 1`);
    check(breadcrumb.itemListElement[0].name === "Inicio", `Breadcrumb 1 name is 'Inicio'`);
    check(breadcrumb.itemListElement[0].item === `${CANONICAL_DOMAIN}/`, `Breadcrumb 1 item is homepage`);

    check(breadcrumb.itemListElement[1].position === 2, `Breadcrumb 2 is position 2`);
    check(breadcrumb.itemListElement[1].name === "Categorías", `Breadcrumb 2 name is 'Categorías'`);
    check(breadcrumb.itemListElement[1].item === `${CANONICAL_DOMAIN}/#sagas`, `Breadcrumb 2 item is #sagas`);

    check(breadcrumb.itemListElement[2].position === 3, `Breadcrumb 3 is position 3`);
    check(breadcrumb.itemListElement[2].name === (cat.shortTitle || cat.title), `Breadcrumb 3 name matches category`);
    check(breadcrumb.itemListElement[2].item === canonicalUrl, `Breadcrumb 3 item matches canonical URL`);
  }

  // CollectionPage
  const collection = site.getCollectionPageSchema(cat, catCaps);
  check(collection["@context"] === "https://schema.org", `Category [${cat.path}] collection @context`);
  check(collection["@type"] === "CollectionPage", `Category [${cat.path}] collection @type`);
  check(collection["@id"] === `${canonicalUrl}#collection`, `Category [${cat.path}] collection @id matches #collection`);
  check(collection.url === canonicalUrl, `Category [${cat.path}] collection url matches canonical`);
  check(typeof collection.name === "string" && collection.name.length > 0, `Category [${cat.path}] collection name non-empty`);
  check(typeof collection.description === "string" && collection.description.length > 0, `Category [${cat.path}] collection description non-empty`);
  check(collection.inLanguage === "es", `Category [${cat.path}] inLanguage is 'es'`);
  check(collection.isPartOf?.["@id"] === `${CANONICAL_DOMAIN}/#website`, `Category [${cat.path}] isPartOf references #website`);
  check(collection.about?.["@type"] === "TVSeries", `Category [${cat.path}] about is TVSeries`);
  check(collection.about?.name === (cat.shortTitle || cat.title), `Category [${cat.path}] about name matches title`);

  // CollectionPage.mainEntity (ItemList)
  const mainEntity = collection.mainEntity;
  check(mainEntity && mainEntity["@type"] === "ItemList", `Category [${cat.path}] mainEntity is ItemList`);
  check(mainEntity?.numberOfItems === catCaps.length, `Category [${cat.path}] mainEntity numberOfItems matches count (${catCaps.length})`);
  check(Array.isArray(mainEntity?.itemListElement) && mainEntity.itemListElement.length === catCaps.length, `Category [${cat.path}] itemListElement length matches`);

  mainEntity?.itemListElement?.forEach((epItem, epIdx) => {
    check(epItem["@type"] === "ListItem", `Category ep [${epIdx}] @type is ListItem`);
    check(epItem.position === epIdx + 1, `Category ep [${epIdx}] position is monotonic ${epIdx + 1}`);
    check(typeof epItem.name === "string" && epItem.name.length > 0, `Category ep [${epIdx}] name is non-empty`);
    check(epItem.url.startsWith(`${CANONICAL_DOMAIN}/capitulo/`), `Category ep [${epIdx}] url is canonical episode URL (${epItem.url})`);
  });
}

// ============================================================================
// 5. Utility & Legal Pages Schemas
// ============================================================================
console.log(">>> [5] Validating Utility & Legal Pages Schemas...");
for (const util of site.utilityPages) {
  const canonicalUrl = `${CANONICAL_DOMAIN}${util.path}`;
  const bc = site.getUtilityBreadcrumbSchema(util);
  check(bc["@context"] === "https://schema.org", `Utility [${util.path}] breadcrumb @context`);
  check(bc["@type"] === "BreadcrumbList", `Utility [${util.path}] breadcrumb @type`);
  check(Array.isArray(bc.itemListElement) && bc.itemListElement.length === 2, `Utility [${util.path}] has 2-level breadcrumbs`);
  if (bc.itemListElement?.length === 2) {
    check(bc.itemListElement[0].position === 1, `Utility bc 1 position is 1`);
    check(bc.itemListElement[0].name === "Inicio", `Utility bc 1 name is 'Inicio'`);
    check(bc.itemListElement[0].item === `${CANONICAL_DOMAIN}/`, `Utility bc 1 item is homepage`);

    check(bc.itemListElement[1].position === 2, `Utility bc 2 position is 2`);
    check(bc.itemListElement[1].name === util.title, `Utility bc 2 name matches utility title`);
    check(bc.itemListElement[1].item === canonicalUrl, `Utility bc 2 item matches canonical URL`);
  }
}

// ============================================================================
// 6. Exhaustive Check of all 1,070 Episodes
// ============================================================================
console.log(">>> [6] Auditing ALL 1,070 Episodes for Schema Conformance & Edge Cases...");

let videoObjectValidCount = 0;
let tvEpisodeCount = 0;
let movieCount = 0;
let breadcrumbCount = 0;
let invalidEmbedUrls = [];
let invalidThumbnailUrls = [];
let invalidDurations = [];
let invalidDates = [];

for (const cap of capitulos) {
  const canonicalPath = site.episodeHref(cap);
  const fullCanonicalUrl = `${CANONICAL_DOMAIN}${canonicalPath}`;

  // 1. VideoObject
  const video = site.getEpisodeVideoSchema(cap);
  if (video) {
    videoObjectValidCount++;
    check(video["@context"] === "https://schema.org", `Ep ${cap.slug} VideoObject @context`);
    check(video["@type"] === "VideoObject", `Ep ${cap.slug} VideoObject @type`);
    check(video["@id"] === `${fullCanonicalUrl}#video`, `Ep ${cap.slug} VideoObject @id matches #video`);
    check(typeof video.name === "string" && video.name.length > 0, `Ep ${cap.slug} VideoObject name non-empty`);
    check(typeof video.description === "string" && video.description.length > 0, `Ep ${cap.slug} VideoObject description non-empty`);
    check(video.inLanguage === "es", `Ep ${cap.slug} VideoObject inLanguage is 'es'`);
    check(video.interactionStatistic?.["@type"] === "InteractionCounter", `Ep ${cap.slug} interactionStatistic @type`);
    check(video.interactionStatistic?.userInteractionCount > 0, `Ep ${cap.slug} userInteractionCount > 0`);
    check(video.potentialAction?.["@type"] === "WatchAction", `Ep ${cap.slug} potentialAction @type`);
    check(video.potentialAction?.target === fullCanonicalUrl, `Ep ${cap.slug} potentialAction target is canonical URL`);

    // Thumbnail URL validation
    const hasValidThumb = Array.isArray(video.thumbnailUrl) && video.thumbnailUrl.length > 0 && video.thumbnailUrl[0].startsWith("https://");
    if (!hasValidThumb) {
      invalidThumbnailUrls.push({ slug: cap.slug, thumb: video.thumbnailUrl });
      check(false, `Ep ${cap.slug} thumbnailUrl is invalid (${video.thumbnailUrl})`);
    } else {
      check(true, `Ep ${cap.slug} thumbnailUrl valid`);
    }

    // Embed URL validation
    const isEmbedValidUrl = typeof video.embedUrl === "string" && (video.embedUrl.startsWith("http://") || video.embedUrl.startsWith("https://"));
    if (!isEmbedValidUrl) {
      invalidEmbedUrls.push({ slug: cap.slug, embedUrl: video.embedUrl });
      check(false, `Ep ${cap.slug} embedUrl is invalid ("${video.embedUrl}")`, { slug: cap.slug, embedUrl: video.embedUrl });
    } else {
      check(true, `Ep ${cap.slug} embedUrl valid`);
    }

    // Duration ISO 8601
    const isDurationValid = /^PT(\d+H)?(\d+M)?(\d+S)?$/.test(video.duration);
    if (!isDurationValid) {
      invalidDurations.push({ slug: cap.slug, duration: video.duration });
      check(false, `Ep ${cap.slug} duration invalid (${video.duration})`);
    } else {
      check(true, `Ep ${cap.slug} duration valid`);
    }

    // UploadDate ISO format
    const isDateValid = /^\d{4}-\d{2}-\d{2}/.test(video.uploadDate) && !isNaN(Date.parse(video.uploadDate));
    if (!isDateValid) {
      invalidDates.push({ slug: cap.slug, uploadDate: video.uploadDate });
      check(false, `Ep ${cap.slug} uploadDate invalid (${video.uploadDate})`);
    } else {
      check(true, `Ep ${cap.slug} uploadDate valid`);
    }
  } else {
    check(false, `Ep ${cap.slug} missing VideoObject schema`);
  }

  // 2. TVEpisode / Movie
  const tvOrMovie = site.getEpisodeTVSchema(cap);
  if (tvOrMovie) {
    if (tvOrMovie["@type"] === "TVEpisode") {
      tvEpisodeCount++;
      check(tvOrMovie["@context"] === "https://schema.org", `Ep ${cap.slug} TVEpisode @context`);
      check(tvOrMovie["@id"] === `${fullCanonicalUrl}#episode`, `Ep ${cap.slug} TVEpisode @id matches #episode`);
      check(tvOrMovie.url === fullCanonicalUrl, `Ep ${cap.slug} TVEpisode url matches canonical`);
      check(tvOrMovie.inLanguage === "es", `Ep ${cap.slug} TVEpisode inLanguage is 'es'`);
      check(tvOrMovie.partOfSeries && tvOrMovie.partOfSeries["@type"] === "TVSeries", `Ep ${cap.slug} partOfSeries is TVSeries`);
      check(tvOrMovie.partOfSeries?.url?.startsWith("https://"), `Ep ${cap.slug} partOfSeries url is absolute`);
      check(tvOrMovie.video && tvOrMovie.video["@type"] === "VideoObject", `Ep ${cap.slug} TVEpisode nests VideoObject`);
    } else if (tvOrMovie["@type"] === "Movie") {
      movieCount++;
      check(tvOrMovie["@context"] === "https://schema.org", `Movie ${cap.slug} @context`);
      check(tvOrMovie["@id"] === `${fullCanonicalUrl}#movie`, `Movie ${cap.slug} @id matches #movie`);
      check(tvOrMovie.url === fullCanonicalUrl, `Movie ${cap.slug} url matches canonical`);
      check(tvOrMovie.inLanguage === "es", `Movie ${cap.slug} inLanguage is 'es'`);
      check(tvOrMovie.video && tvOrMovie.video["@type"] === "VideoObject", `Movie ${cap.slug} nests VideoObject`);
    } else {
      check(false, `Ep ${cap.slug} unknown entity @type: ${tvOrMovie["@type"]}`);
    }
  } else {
    check(false, `Ep ${cap.slug} missing TVEpisode or Movie schema`);
  }

  // 3. BreadcrumbList
  const epBc = site.getEpisodeBreadcrumbSchema(cap);
  if (epBc) {
    breadcrumbCount++;
    check(epBc["@context"] === "https://schema.org", `Ep ${cap.slug} BreadcrumbList @context`);
    check(epBc["@type"] === "BreadcrumbList", `Ep ${cap.slug} BreadcrumbList @type`);
    check(Array.isArray(epBc.itemListElement) && epBc.itemListElement.length === 3, `Ep ${cap.slug} breadcrumbs has 3 levels`);
    if (epBc.itemListElement?.length === 3) {
      check(epBc.itemListElement[0].position === 1, `Ep bc 1 position is 1`);
      check(epBc.itemListElement[0].name === "Inicio", `Ep bc 1 name is 'Inicio'`);
      check(epBc.itemListElement[0].item === `${CANONICAL_DOMAIN}/`, `Ep bc 1 item is homepage`);

      check(epBc.itemListElement[1].position === 2, `Ep bc 2 position is 2`);
      check(typeof epBc.itemListElement[1].name === "string" && epBc.itemListElement[1].name.length > 0, `Ep bc 2 name non-empty`);
      check(epBc.itemListElement[1].item.startsWith("https://"), `Ep bc 2 item is absolute`);

      check(epBc.itemListElement[2].position === 3, `Ep bc 3 position is 3`);
      check(epBc.itemListElement[2].name === cap.titulo, `Ep bc 3 name matches title`);
      check(epBc.itemListElement[2].item === fullCanonicalUrl, `Ep bc 3 item matches episode canonical URL`);
    }
  } else {
    check(false, `Ep ${cap.slug} missing BreadcrumbList schema`);
  }
}

console.log("\n===============================================================");
console.log("                 AUDIT SUMMARY & RESULTS                       ");
console.log("===============================================================");
console.log(`Total Assertions Checked:       ${passed + failed}`);
console.log(`Total Assertions Passed:        ${passed}`);
console.log(`Total Assertions Failed:        ${failed}`);
console.log(`---------------------------------------------------------------`);
console.log(`Total Episodes Evaluated:       ${capitulos.length}`);
console.log(`  - Valid VideoObject Entities: ${videoObjectValidCount} / ${capitulos.length}`);
console.log(`  - Valid TVEpisode Entities:   ${tvEpisodeCount}`);
console.log(`  - Valid Movie Entities:       ${movieCount}`);
console.log(`  - Total TVEpisode + Movie:    ${tvEpisodeCount + movieCount} / ${capitulos.length}`);
console.log(`  - Valid BreadcrumbList:       ${breadcrumbCount} / ${capitulos.length}`);
console.log(`---------------------------------------------------------------`);
console.log(`Identified Deficiencies:`);
console.log(`  - Invalid embedUrl values:    ${invalidEmbedUrls.length}`);
if (invalidEmbedUrls.length > 0) {
  console.log(`    Examples:`, invalidEmbedUrls.slice(0, 5));
}
console.log(`  - Invalid thumbnailUrl:       ${invalidThumbnailUrls.length}`);
console.log(`  - Invalid durations:          ${invalidDurations.length}`);
console.log(`  - Invalid uploadDates:        ${invalidDates.length}`);
console.log("===============================================================\n");

if (failed > 0) {
  console.log(`❌ VERDICT: REQUEST_CHANGES (${failed} failed assertions)`);
  process.exit(1);
} else {
  console.log("✅ VERDICT: APPROVE (100% assertions passed)");
  process.exit(0);
}
