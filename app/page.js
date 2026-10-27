import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import capitulos from "@/data/capitulos.json";
import {
  episodeHref,
  generateHomeFeaturedItemListSchema,
  generateHomeSagasItemListSchema,
  siteUrl,
} from "@/lib/site";

export const dynamic = "force-static";

export const metadata = {
  title: { absolute: "Dragon Ball en español latino | Sagas y capítulos HD" },
  description:
    "Disfruta de todos los capítulos completos de Dragon Ball, Dragon Ball Z, Dragon Ball Super, GT, Kai y películas online en audio latino y calidad HD sin límites.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Ver Dragon Ball Online en Español Latino HD - Todas las Sagas Completas",
    description:
      "Disfruta de todos los capítulos completos de Dragon Ball, Dragon Ball Z, Dragon Ball Super, GT, Kai y películas online en audio latino y calidad HD sin límites.",
    siteName: "Dragon Ball HD Sin Limites",
    images: [
      {
        url: `${siteUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "Ver Dragon Ball Online en Español Latino HD",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ver Dragon Ball Online en Español Latino HD - Todas las Sagas Completas",
    description:
      "Disfruta de todos los capítulos completos de Dragon Ball, Dragon Ball Z, Dragon Ball Super, GT, Kai y películas online en audio latino y calidad HD sin límites.",
    images: [`${siteUrl}/og-image.webp`],
  },
};

const quickSections = [
  { title: "Dragon Ball Heroes", href: "/category/dragon-ball-heroes/", match: (capitulo) => capitulo.saga === "heroes" },
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

const FEATURED_SLUGS = [
  "95-finalmente-goku-se-convierte-en-el-legendario-super-saiyajin",
  "dragon-ball-super-latino-110-son-goku-despierta-nuevas-senales-del-ultra-instinto",
  "dragon-ball-gt-capitulo-35-goku-se-convierte-en-super-saiyajin-4",
  "dragon-ball-dragon-ball-capitulo-1-el-secreto-de-la-esfera-del-dragon",
  "291-el-sueno-de-goku",
];

export default function HomePage() {
  const total = capitulos.filter((capitulo) => capitulo.players?.length).length;
  const playableWithImage = capitulos.filter((capitulo) => capitulo.imagen && capitulo.players?.length);
  const curatedFeatured = FEATURED_SLUGS.map((slug) => playableWithImage.find((c) => c.slug === slug)).filter(Boolean);
  const featured =
    curatedFeatured.length >= 3
      ? curatedFeatured.slice(0, 5)
      : playableWithImage.slice(0, 5);
  const sections = quickSections.map((section) => {
    const matches = capitulos.filter((capitulo) => capitulo.players?.length && section.match(capitulo));
    const cover = matches.find((capitulo) => capitulo.imagen)?.imagen || "";
    return { ...section, count: matches.length, cover };
  });

  const featuredItemListSchema = generateHomeFeaturedItemListSchema(featured);
  const sagasItemListSchema = generateHomeSagasItemListSchema(sections);

  return (
    <main>
      {sections[0]?.cover && <link rel="preload" as="image" href={sections[0].cover} fetchPriority="high" />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sagasItemListSchema) }}
      />
      <SiteHeader />

      <section
        id="contenido"
        className="site-hero border-b border-white/10 px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8"
      >
        <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-db-orange/35 bg-db-orange/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-db-orange">
          Catálogo Completo en Alta Definición
        </p>
        <h1 className="site-hero-title mx-auto max-w-5xl text-4xl font-black uppercase text-white sm:text-6xl">
          Todo el universo Dragon Ball, en un solo lugar
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-white/90">
          Elige tu saga y encuentra el siguiente capítulo: Dragon Ball, Z, GT, Kai, Super, Heroes y Películas.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#sagas" className="primary-button">Explorar sagas</a>
          <a href="/buscar/" className="secondary-button">Encontrar un capítulo</a>
        </div>
        <p className="mt-6 text-sm tabular-nums text-zinc-400">
          {total.toLocaleString("es-MX")} capítulos con reproductor activo · Audio Español Latino y Subtitulado
        </p>
      </section>

      <section id="sagas" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">Sagas y categorías</p>
            <h2 className="mt-2 text-3xl font-black text-white">Elige tu saga</h2>
          </div>
          <a href="/buscar/" className="focus-ring rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-db-orange hover:text-white">
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
              <div className="relative aspect-video bg-zinc-950" style={{ aspectRatio: "16 / 9" }}>
                {section.cover ? (
                  <img
                    src={section.cover}
                    alt={section.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#171717,#261207)] text-sm font-black uppercase text-db-orange">
                    Dragon Ball
                  </div>
                )}
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-black uppercase tabular-nums text-db-gold backdrop-blur-sm">
                  {section.count} caps
                </span>
              </div>
              <div className="p-3.5">
                <h3 className="line-clamp-2 text-base font-black text-white group-hover:text-db-orange transition-colors">
                  {section.title}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tabular-nums text-zinc-400">
                  {section.count} capítulos disponibles
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 420px" }}
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">Capítulos destacados</p>
            <h2 className="mt-2 text-3xl font-black text-white">Episodios legendarios para empezar</h2>
          </div>
          <a href="/buscar/" className="focus-ring rounded-md border border-white/10 px-4 py-2 text-sm font-bold tabular-nums text-zinc-200 hover:border-db-orange hover:text-white">
            Ver los {total.toLocaleString("es-MX")} capítulos
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((capitulo) => (
            <a
              key={capitulo.slug}
              href={episodeHref(capitulo)}
              className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel shadow-card transition hover:-translate-y-1 hover:border-db-orange"
            >
              <div className="relative aspect-video bg-zinc-950" style={{ aspectRatio: "16 / 9" }}>
                {capitulo.imagen ? (
                  <img
                    src={capitulo.imagen}
                    alt={capitulo.titulo}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#171717,#261207)] text-sm font-black uppercase text-db-orange">
                    Dragon Ball
                  </div>
                )}
                {capitulo.numero && capitulo.numero !== 9999 && (
                  <span className="absolute left-2 top-2 rounded bg-db-orange px-2 py-0.5 text-[11px] font-black uppercase tabular-nums text-white shadow">
                    Ep. {capitulo.numero}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-db-orange">
                  {capitulo.categoria}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white group-hover:text-db-gold transition-colors">
                  {capitulo.titulo}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-db-panel px-4 py-12 sm:px-6 lg:px-8"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 320px" }}
      >
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-db-orange">Orden Cronológico</p>
            <h2 className="mt-2 text-xl font-black text-white">¿En qué orden ver Dragon Ball?</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Inicia con <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball/">Dragon Ball Clásico</a> (153 episodios) para conocer el origen de Son Goku y las Esferas del Dragón. Continúa con <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball-z/">Dragon Ball Z</a> (291 episodios) o su versión remasterizada sin relleno <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball-kai/">Dragon Ball Kai</a>.
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-db-orange">Era Moderna y Secuelas</p>
            <h2 className="mt-2 text-xl font-black text-white">Dragon Ball Super, GT y Heroes</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Tras la derrota de Majin Buu, sigue la historia canónica en <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball-super-latino/">Dragon Ball Super Latino</a> o en su versión original en <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball-super-sub/">Dragon Ball Super Subtitulado</a>. También puedes explorar el viaje espacial en <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball-gt/">Dragon Ball GT</a> y <a className="font-bold text-db-orange hover:underline" href="/category/dragon-ball-heroes/">Dragon Ball Heroes</a>.
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-db-orange">Cine y Especiales de TV</p>
            <h2 className="mt-2 text-xl font-black text-white">Películas y OVAs en Audio Latino</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Disfruta de todos los largometrajes clásicos y modernos en <a className="font-bold text-db-orange hover:underline" href="/dragon-ball-todas-las-peliculas-y-especiales/">Películas y Especiales</a>, incluyendo La Batalla de los Dioses, La Resurrección de Freezer, Broly y los especiales de Bardock y Trunks del Futuro.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
