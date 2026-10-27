import capitulos from "@/data/capitulos.json";
import { categoryPages, episodeHref, siteUrl } from "@/lib/site";


export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryPages.map((category) => ({
      url: `${siteUrl}${category.path}`,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...capitulos.filter((capitulo) => capitulo.players?.length).map((capitulo) => ({
      url: `${siteUrl}${episodeHref(capitulo)}`,
      changeFrequency: "monthly",
      priority: 0.8,
      images: capitulo.imagen
        ? [capitulo.imagen.startsWith("http") ? capitulo.imagen : `${siteUrl}${capitulo.imagen.startsWith("/") ? "" : "/"}${capitulo.imagen}`]
        : [],
    })),
  ];
}
