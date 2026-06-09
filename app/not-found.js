import capitulos from "@/data/capitulos.json";
import { episodeHref } from "@/lib/site";
import NotFoundClient from "@/components/NotFoundClient";

export const dynamic = "force-static";

export const metadata = {
  title: "Pagina no encontrada | Dragon Ball HD Sin Limites",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const chapterIndex = capitulos.map((capitulo) => ({
    id: capitulo.id,
    slug: capitulo.slug,
    titulo: capitulo.titulo,
    url: episodeHref(capitulo),
  }));

  return <NotFoundClient chapterIndex={chapterIndex} />;
}
