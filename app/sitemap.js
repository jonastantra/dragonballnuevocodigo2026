import capitulos from "@/data/capitulos.json";
import { categoryPages, episodeHref, getLegacyPages, siteUrl, utilityPages } from "@/lib/site";


export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-05-20"),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryPages.map((category) => ({
      url: `${siteUrl}${category.path}`,
      lastModified: new Date("2026-05-20"),
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...capitulos.map((capitulo) => ({
      url: `${siteUrl}${episodeHref(capitulo)}`,
      lastModified: new Date("2026-05-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...utilityPages.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: new Date("2026-05-20"),
      changeFrequency: "yearly",
      priority: page.path === "/blog/" ? 0.5 : 0.2,
    })),
    ...getLegacyPages().map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: new Date("2026-05-20"),
      changeFrequency: "yearly",
      priority: 0.35,
    })),
  ];
}
