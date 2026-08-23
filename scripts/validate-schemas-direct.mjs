/**
 * Comprehensive In-Memory & Export Schema Validator for Milestone 3
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runValidation() {
  const {
    siteUrl,
    menuItems,
    utilityPages,
    legalPages,
    categoryPages,
    categoryAliases,
    getEpisodeTitle,
    getEpisodeDescription,
    getCategoryTitle,
    getCategoryDescription,
    getCategoryHref,
    getCategoryCapitulos,
    getEpisodeThumbnailUrl,
    getEpisodeUploadDate,
    getEpisodeDuration,
    getEpisodeEmbedUrl,
    getSeriesName,
    getEpisodeSeason,
    getEpisodeVideoSchema,
    getEpisodeTVSchema,
    getEpisodeBreadcrumbSchema,
    getCategoryBreadcrumbSchema,
    getUtilityBreadcrumbSchema,
    getCollectionPageSchema,
    generateWebSiteSchema,
    generateOrganizationSchema,
    generateHomeFeaturedItemListSchema,
    generateHomeSagasItemListSchema,
    episodeHref,
  } = await import("../lib/site.js");

  const capitulos = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/capitulos.json"), "utf8"));

  console.log(`Loaded ${capitulos.length} episodes for in-depth schema audit.\n`);

  let passed = 0;
  let failed = 0;
  const bugs = [];

  function recordAssert(cond, msg, data = null) {
    if (cond) {
      passed++;
    } else {
      failed++;
      bugs.push({ msg, data });
      console.error(`❌ FAIL: ${msg}`);
      if (data) console.error("   Data:", JSON.stringify(data, null, 2));
    }
  }

  // 1. WebSite Schema Validation
  console.log("--- 1. WebSite Schema Audit ---");
  const website = generateWebSiteSchema();
  recordAssert(website["@context"] === "https://schema.org", "WebSite @context is https://schema.org");
  recordAssert(website["@type"] === "WebSite", "WebSite @type is WebSite");
  recordAssert(website["@id"] === `${siteUrl}/#website`, "WebSite @id is valid URI");
  recordAssert(website.url === siteUrl, "WebSite url is siteUrl");
  recordAssert(website.publisher?.["@id"] === `${siteUrl}/#organization`, "WebSite publisher points to #organization");
  recordAssert(website.potentialAction?.["@type"] === "SearchAction", "SearchAction @type");
  recordAssert(website.potentialAction?.target?.["@type"] === "EntryPoint", "SearchAction target is EntryPoint");
  recordAssert(website.potentialAction?.target?.urlTemplate === `${siteUrl}/buscar/?q={search_term_string}`, "SearchAction urlTemplate");
  recordAssert(website.potentialAction?.["query-input"] === "required name=search_term_string", "SearchAction query-input");

  // 2. Organization Schema Validation
  console.log("--- 2. Organization Schema Audit ---");
  const org = generateOrganizationSchema();
  recordAssert(org["@context"] === "https://schema.org", "Organization @context is https://schema.org");
  recordAssert(org["@type"] === "Organization", "Organization @type is Organization");
  recordAssert(org["@id"] === `${siteUrl}/#organization`, "Organization @id is valid URI");
  recordAssert(org.url === siteUrl, "Organization url is siteUrl");
  recordAssert(org.logo?.["@type"] === "ImageObject", "Organization logo is ImageObject");
  recordAssert(org.logo?.url?.startsWith("https://"), "Organization logo url is absolute");
  recordAssert(Array.isArray(org.sameAs) && org.sameAs.length >= 3, "Organization sameAs has >= 3 profiles");
  recordAssert(org.contactPoint?.["@type"] === "ContactPoint", "Organization contactPoint");
  recordAssert(org.contactPoint?.url?.startsWith("https://"), "Organization contactPoint url is absolute");

  // 3. Homepage ItemList Schemas
  console.log("--- 3. Homepage ItemList Schemas Audit ---");
  const featured = capitulos.filter((c) => c.imagen).slice(0, 4);
  const featuredSchema = generateHomeFeaturedItemListSchema(featured);
  recordAssert(featuredSchema["@type"] === "ItemList", "Featured ItemList @type");
  recordAssert(featuredSchema["@id"] === `${siteUrl}/#featured-episodes`, "Featured ItemList @id");
  recordAssert(featuredSchema.numberOfItems === featured.length, "Featured ItemList numberOfItems");
  featuredSchema.itemListElement.forEach((item, idx) => {
    recordAssert(item["@type"] === "ListItem", `Featured item [${idx}] @type is ListItem`);
    recordAssert(item.position === idx + 1, `Featured item [${idx}] position is ${idx + 1}`);
    recordAssert(item.url.startsWith("https://"), `Featured item [${idx}] url is absolute (${item.url})`);
    recordAssert(item.image.startsWith("https://"), `Featured item [${idx}] image is absolute (${item.image})`);
    recordAssert(item.item?.["@type"] === "TVEpisode", `Featured item [${idx}] item is TVEpisode`);
  });

  const sections = categoryPages.map((c) => ({ title: c.title, href: c.path, cover: "/og-image.webp" }));
  const sagasSchema = generateHomeSagasItemListSchema(sections);
  recordAssert(sagasSchema["@type"] === "ItemList", "Sagas ItemList @type");
  recordAssert(sagasSchema["@id"] === `${siteUrl}/#sagas-list`, "Sagas ItemList @id");
  sagasSchema.itemListElement.forEach((item, idx) => {
    recordAssert(item["@type"] === "ListItem", `Sagas item [${idx}] @type is ListItem`);
    recordAssert(item.position === idx + 1, `Sagas item [${idx}] position is ${idx + 1}`);
    recordAssert(item.url.startsWith("https://"), `Sagas item [${idx}] url is absolute (${item.url})`);
    recordAssert(item.image.startsWith("https://"), `Sagas item [${idx}] image is absolute (${item.image})`);
    recordAssert(item.item?.["@type"] === "CollectionPage", `Sagas item [${idx}] item is CollectionPage`);
  });

  // 4. Canonical Category Pages Schemas
  console.log("--- 4. Category Pages Schemas Audit ---");
  for (const cat of categoryPages) {
    const catCaps = getCategoryCapitulos(cat);
    const catBreadcrumbs = getCategoryBreadcrumbSchema(cat);
    recordAssert(catBreadcrumbs["@type"] === "BreadcrumbList", `Category ${cat.path} BreadcrumbList @type`);
    recordAssert(catBreadcrumbs.itemListElement?.length === 3, `Category ${cat.path} has 3 breadcrumbs`);
    recordAssert(catBreadcrumbs.itemListElement[0].item === `${siteUrl}/`, `Category ${cat.path} breadcrumb 1 is home`);
    recordAssert(catBreadcrumbs.itemListElement[1].item === `${siteUrl}/#sagas`, `Category ${cat.path} breadcrumb 2 is #sagas`);
    recordAssert(catBreadcrumbs.itemListElement[2].item === `${siteUrl}${cat.path}`, `Category ${cat.path} breadcrumb 3 is canonical path`);

    const col = getCollectionPageSchema(cat, catCaps);
    recordAssert(col["@type"] === "CollectionPage", `Category ${cat.path} CollectionPage @type`);
    recordAssert(col["@id"] === `${siteUrl}${cat.path}#collection`, `Category ${cat.path} CollectionPage @id`);
    recordAssert(col.url === `${siteUrl}${cat.path}`, `Category ${cat.path} CollectionPage url`);
    recordAssert(col.isPartOf?.["@id"] === `${siteUrl}/#website`, `Category ${cat.path} isPartOf #website`);
    recordAssert(col.about?.["@type"] === "TVSeries", `Category ${cat.path} about is TVSeries`);
    recordAssert(col.mainEntity?.["@type"] === "ItemList", `Category ${cat.path} mainEntity is ItemList`);
    recordAssert(col.mainEntity?.numberOfItems === catCaps.length, `Category ${cat.path} ItemList count matches`);
    col.mainEntity?.itemListElement.forEach((epItem, idx) => {
      recordAssert(epItem.position === idx + 1, `Category ${cat.path} ep [${idx}] position`);
      recordAssert(epItem.url.startsWith("https://"), `Category ${cat.path} ep [${idx}] url absolute`);
    });
  }

  // 5. Utility Pages Schemas
  console.log("--- 5. Utility Pages Schemas Audit ---");
  for (const util of utilityPages) {
    const breadcrumbs = getUtilityBreadcrumbSchema(util);
    recordAssert(breadcrumbs["@type"] === "BreadcrumbList", `Utility ${util.path} BreadcrumbList @type`);
    recordAssert(breadcrumbs.itemListElement?.length === 2, `Utility ${util.path} has 2 breadcrumbs`);
    recordAssert(breadcrumbs.itemListElement[0].item === `${siteUrl}/`, `Utility ${util.path} breadcrumb 1 is home`);
    recordAssert(breadcrumbs.itemListElement[1].item === `${siteUrl}${util.path}`, `Utility ${util.path} breadcrumb 2 is canonical path`);
  }

  // 6. Exhaustive Check of all 1,070 Episodes
  console.log("--- 6. Exhaustive All-1,070 Episode Schemas Audit ---");
  let embedUrlBugs = 0;
  let videoObjectValid = 0;
  let tvValid = 0;
  let movieValid = 0;
  let breadcrumbValid = 0;

  for (const cap of capitulos) {
    const video = getEpisodeVideoSchema(cap);
    const tv = getEpisodeTVSchema(cap);
    const bc = getEpisodeBreadcrumbSchema(cap);

    if (video) {
      videoObjectValid++;
      // Check embedUrl
      const isEmbedAbs = typeof video.embedUrl === "string" && (video.embedUrl.startsWith("http://") || video.embedUrl.startsWith("https://"));
      if (!isEmbedAbs) {
        embedUrlBugs++;
        recordAssert(false, `Episode ${cap.slug} embedUrl is invalid ("${video.embedUrl}")`, { slug: cap.slug, embedUrl: video.embedUrl });
      } else {
        recordAssert(true, `Episode ${cap.slug} embedUrl valid`);
      }

      // Check thumbnailUrl
      recordAssert(Array.isArray(video.thumbnailUrl) && video.thumbnailUrl[0].startsWith("https://"), `Episode ${cap.slug} thumbnailUrl absolute`);

      // Check duration
      recordAssert(/^PT(\d+H)?(\d+M)?(\d+S)?$/.test(video.duration), `Episode ${cap.slug} duration format`);

      // Check uploadDate
      recordAssert(/^\d{4}-\d{2}-\d{2}/.test(video.uploadDate), `Episode ${cap.slug} uploadDate format`);
    } else {
      recordAssert(false, `Episode ${cap.slug} missing video schema`);
    }

    if (tv) {
      if (tv["@type"] === "TVEpisode") {
        tvValid++;
        recordAssert(tv.url.startsWith("https://"), `Episode ${cap.slug} tvEpisode url`);
        recordAssert(tv.partOfSeries?.url?.startsWith("https://"), `Episode ${cap.slug} partOfSeries url`);
        recordAssert(!!tv.video, `Episode ${cap.slug} tvEpisode nests video`);
      } else if (tv["@type"] === "Movie") {
        movieValid++;
        recordAssert(tv.url.startsWith("https://"), `Movie ${cap.slug} url`);
        recordAssert(!!tv.video, `Movie ${cap.slug} nests video`);
      }
    } else {
      recordAssert(false, `Episode ${cap.slug} missing TV/Movie schema`);
    }

    if (bc) {
      breadcrumbValid++;
      recordAssert(bc.itemListElement.length === 3, `Episode ${cap.slug} breadcrumbs length`);
      recordAssert(bc.itemListElement[0].item === `${siteUrl}/`, `Episode ${cap.slug} bc 1`);
      recordAssert(bc.itemListElement[1].item.startsWith("https://"), `Episode ${cap.slug} bc 2`);
      recordAssert(bc.itemListElement[2].item.startsWith("https://"), `Episode ${cap.slug} bc 3`);
    } else {
      recordAssert(false, `Episode ${cap.slug} missing breadcrumbs`);
    }
  }

  console.log("\n========================================================");
  console.log(`Audited ${capitulos.length} episodes:`);
  console.log(`  - VideoObject valid: ${videoObjectValid} / ${capitulos.length}`);
  console.log(`  - TVEpisode valid:   ${tvValid}`);
  console.log(`  - Movie valid:       ${movieValid}`);
  console.log(`  - Breadcrumb valid:  ${breadcrumbValid} / ${capitulos.length}`);
  console.log(`  - EmbedUrl bugs:     ${embedUrlBugs}`);
  console.log(`Total Assertions Passed: ${passed}`);
  console.log(`Total Assertions Failed: ${failed}`);
  console.log("========================================================\n");

  if (failed > 0) {
    console.error(`Total Bugs Detected: ${bugs.length}`);
  }
}

runValidation().catch(console.error);
