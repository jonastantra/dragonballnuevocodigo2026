import EpisodeView from "@/components/EpisodeView";
import capitulos from "@/data/capitulos.json";
import { episodeHref, findCapituloBySlug, siteUrl } from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return capitulos.map((capitulo) => ({ slug: capitulo.slug }));
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

  return {
    title: capitulo.seoTitle || capitulo.titulo,
    description:
      capitulo.seoDescription ||
      capitulo.descripcion ||
      `${capitulo.titulo} online en Dragon Ball HD Sin Limites. Reproductor responsivo optimizado para movil.`,
    alternates: {
      canonical: episodeHref(capitulo),
    },
    openGraph: {
      type: "video.episode",
      url: `${siteUrl}${episodeHref(capitulo)}`,
      title: capitulo.titulo,
      description: `Ver ${capitulo.titulo} online.`,
      images: capitulo.imagen ? [{ url: capitulo.imagen, alt: capitulo.titulo }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: capitulo.titulo,
      description: `Ver ${capitulo.titulo} online.`,
      images: capitulo.imagen ? [capitulo.imagen] : [],
    },
  };
}

export default async function CapituloPage({ params }) {
  const { slug } = await params;
  const capitulo = findCapituloBySlug(slug);
  if (!capitulo) notFound();

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: capitulo.titulo,
    description: capitulo.descripcion || `Ver ${capitulo.titulo} online en Dragon Ball HD Sin Limites.`,
    thumbnailUrl: capitulo.imagen ? [capitulo.imagen] : undefined,
    uploadDate: "2026-05-20",
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
