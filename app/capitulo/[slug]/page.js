import EpisodeView from "@/components/EpisodeView";
import capitulos from "@/data/capitulos.json";
import {
  episodeHref,
  findCapituloBySlug,
  getEpisodeBreadcrumbSchema,
  getEpisodeDescription,
  getEpisodeTitle,
  getEpisodeTVSchema,
  getEpisodeVideoSchema,
  siteUrl,
} from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return capitulos
    .filter((capitulo) => capitulo && typeof capitulo.slug === "string" && capitulo.slug.trim())
    .map((capitulo) => ({ slug: capitulo.slug.trim() }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const capitulo = findCapituloBySlug(slug);

  if (!capitulo) {
    return {
      title: "Capitulo no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = episodeHref(capitulo);
  const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;
  const title = getEpisodeTitle(capitulo);
  const description = getEpisodeDescription(capitulo);
  const imageUrl = capitulo.imagen
    ? (capitulo.imagen.startsWith("http") ? capitulo.imagen : `${siteUrl}${capitulo.imagen}`)
    : `${siteUrl}/og-image.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "video.episode",
      url: fullCanonicalUrl,
      title,
      description,
      siteName: "Dragon Ball HD Sin Limites",
      images: [{ url: imageUrl, alt: capitulo.titulo }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CapituloPage({ params }) {
  const { slug } = await params;
  const capitulo = findCapituloBySlug(slug);
  if (!capitulo) notFound();

  // Structured Data (JSON-LD): "@type": "VideoObject", "@type": "TVEpisode", "@type": "TVSeries", "@type": "BreadcrumbList"
  const videoSchema = getEpisodeVideoSchema(capitulo);
  const tvSchema = getEpisodeTVSchema(capitulo);
  const breadcrumbSchema = getEpisodeBreadcrumbSchema(capitulo);

  return (
    <>
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      {tvSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tvSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <EpisodeView capitulo={capitulo} capitulos={capitulos} />
    </>
  );
}
