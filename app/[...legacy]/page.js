import CategoryView from "@/components/CategoryView";
import EpisodeView from "@/components/EpisodeView";
import UtilityPage from "@/components/UtilityPage";
import capitulos from "@/data/capitulos.json";
import {
  categoryPages,
  episodeHref,
  findCapituloByPath,
  findCategoryByPath,
  findLegacyPageByPath,
  findUtilityByPath,
  getCategoryCapitulos,
  getLegacyPages,
  pathToSegments,
  siteUrl,
  utilityPages,
} from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

function paramsToPath(params) {
  return `/${(params.legacy || []).join("/")}/`;
}

export function generateStaticParams() {
  const paths = new Set();

  for (const capitulo of capitulos) {
    paths.add(episodeHref(capitulo));
    for (const alias of capitulo.aliases || []) {
      paths.add(alias);
    }
  }
  for (const category of categoryPages) {
    paths.add(category.path);
  }
  for (const page of utilityPages) {
    paths.add(page.path);
  }
  for (const page of getLegacyPages()) {
    paths.add(page.path);
  }

  return [...paths]
    .filter((path) => path && path !== "/")
    .map((path) => ({ legacy: pathToSegments(path) }));
}

export async function generateMetadata({ params }) {
  const path = paramsToPath(await params);
  const capitulo = findCapituloByPath(path);
  if (capitulo) {
    return {
      title: capitulo.seoTitle || capitulo.titulo,
      description:
        capitulo.seoDescription ||
        capitulo.descripcion ||
        `${capitulo.titulo} online en Dragon Ball HD Sin Limites.`,
      alternates: { canonical: episodeHref(capitulo) },
      openGraph: {
        type: "video.episode",
        url: `${siteUrl}${episodeHref(capitulo)}`,
        title: capitulo.titulo,
        description: `Ver ${capitulo.titulo} online.`,
        images: capitulo.imagen ? [{ url: capitulo.imagen, alt: capitulo.titulo }] : [],
      },
    };
  }

  const category = findCategoryByPath(path);
  if (category) {
    return {
      title: category.title,
      description: category.description,
      alternates: { canonical: category.path },
    };
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    return {
      title: utility.title,
      alternates: { canonical: utility.path },
      robots: utility.path === "/blog/" ? { index: true, follow: true } : { index: false, follow: true },
    };
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    return {
      title: legacyPage.title,
      description: legacyPage.description,
      alternates: { canonical: legacyPage.path },
    };
  }

  return {
    title: "Pagina no encontrada",
    robots: { index: false, follow: false },
  };
}

export default async function LegacyPage({ params }) {
  const path = paramsToPath(await params);
  const capitulo = findCapituloByPath(path);
  if (capitulo) {
    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: capitulo.titulo,
      description: capitulo.descripcion || `Ver ${capitulo.titulo} online en Dragon Ball HD Sin Limites.`,
      thumbnailUrl: capitulo.imagen ? [capitulo.imagen] : undefined,
      uploadDate: "2026-05-20T00:00:00+00:00",
      embedUrl: capitulo.iframe?.match(/src=["']([^"']+)["']/i)?.[1],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
        <EpisodeView capitulo={capitulo} capitulos={capitulos} />
      </>
    );
  }

  const category = findCategoryByPath(path);
  if (category) {
    const categoryCapitulos = getCategoryCapitulos(category);
    return <CategoryView category={category} capitulos={categoryCapitulos} />;
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    return <UtilityPage page={utility} />;
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    return <UtilityPage page={legacyPage} />;
  }

  notFound();
}
