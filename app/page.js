import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import capitulos from "@/data/capitulos.json";
import { episodeHref } from "@/lib/site";

export const dynamic = "force-static";

const quickSections = [
  {
    title: "Dragon Ball Super Latino",
    href: "/category/dragon-ball-super-latino/",
    match: (capitulo) => capitulo.categoriaSlug === "dragon-ball-super-latino",
  },
  {
    title: "Dragon Ball Super Sub",
    href: "/category/dragon-ball-super-sub/",
    match: (capitulo) => capitulo.categoriaSlug === "dragon-ball-super-sub",
  },
  {
    title: "Dragon Ball Z",
    href: "/category/dragon-ball-z/",
    match: (capitulo) => capitulo.saga === "z",
  },
  {
    title: "Dragon Ball GT",
    href: "/category/dragon-ball-gt/",
    match: (capitulo) => capitulo.saga === "gt",
  },
  {
    title: "Dragon Ball Kai",
    href: "/category/dragon-ball-kai/",
    match: (capitulo) => capitulo.saga === "kai",
  },
  {
    title: "Dragon Ball",
    href: "/category/dragon-ball/",
    match: (capitulo) => capitulo.saga === "db",
  },
  {
    title: "Peliculas y especiales",
    href: "/dragon-ball-todas-las-peliculas-y-especiales/",
    match: (capitulo) => capitulo.saga === "peliculas" || /pelicula|especial/i.test(capitulo.titulo),
  },
];

export default function HomePage() {
  const total = capitulos.length;
  const featured = capitulos.filter((capitulo) => capitulo.imagen).slice(0, 4);
  const sections = quickSections.map((section) => {
    const matches = capitulos.filter(section.match);
    const cover = matches.find((capitulo) => capitulo.imagen)?.imagen || "";
    return { ...section, count: matches.length, cover };
  });
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sagas de Dragon Ball Online",
    numberOfItems: sections.length,
    itemListElement: sections.map((section, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: section.href,
      name: section.title,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <SiteHeader />

      <section
        id="contenido"
        className="border-b border-white/10 bg-[linear-gradient(135deg,#f46a20_0%,#456ea7_100%)] px-4 py-20 text-center sm:px-6 lg:px-8"
      >
        <h1 className="site-hero-title mx-auto max-w-5xl text-4xl font-black uppercase text-white sm:text-6xl">
          Ver Dragon Ball Online - Todos los Episodios
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-white/90">
          Disfruta de todas las sagas: DB, DBZ, GT, Super, Kai y mas.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">Episodios recientes</p>
            <h2 className="mt-2 text-3xl font-black text-white">Acceso rapido</h2>
          </div>
          <a href="/buscar/" className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold">
            {total.toLocaleString("es-MX")} capitulos
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featured.map((capitulo, index) => (
            <a
              key={capitulo.slug}
              href={episodeHref(capitulo)}
              className={`group overflow-hidden rounded-lg border border-white/10 bg-db-panel shadow-card transition hover:-translate-y-1 hover:border-db-orange ${
                index === 0 ? "col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div className="aspect-video bg-zinc-950">
                {capitulo.imagen ? (
                  <img
                    src={capitulo.imagen}
                    alt={capitulo.titulo}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#171717,#261207)] text-sm font-black uppercase text-db-orange">
                    Dragon Ball
                  </div>
                )}
              </div>
              <div className="p-3">
                <h2 className="line-clamp-2 text-sm font-bold text-white">{capitulo.titulo}</h2>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">Sagas y categorias</p>
            <h2 className="mt-2 text-3xl font-black text-white">Explorar sin cargar todo</h2>
          </div>
          <a href="/buscar/" className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold">
            Buscar episodio
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sections.map((section, index) => (
            <a
              key={section.href}
              href={section.href}
              className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 shadow-card transition hover:-translate-y-1 hover:border-db-orange"
            >
              <div className="aspect-video bg-zinc-950">
                {section.cover ? (
                  <img
                    src={section.cover}
                    alt={section.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#171717,#261207)] text-sm font-black uppercase text-db-orange">
                    Dragon Ball
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-base font-black text-white">{section.title}</h3>
                <p className="mt-1 text-xs font-bold uppercase text-zinc-400">{section.count} capitulos</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
