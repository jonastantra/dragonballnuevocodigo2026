import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import PlayerTabs from "@/components/PlayerTabs";
import { episodeHref } from "@/lib/site";

export default function EpisodeView({ capitulo, capitulos }) {
  const index = capitulos.findIndex((item) => item.slug === capitulo.slug);
  const anterior = index > 0 ? capitulos[index - 1] : null;
  const siguiente = index < capitulos.length - 1 ? capitulos[index + 1] : null;
  const relacionados = capitulos
    .filter((item) => item.slug !== capitulo.slug && item.saga === capitulo.saga)
    .slice(0, 6);

  return (
    <main className="min-h-screen">
      {capitulo.imagen && <link rel="preload" as="image" href={capitulo.imagen} fetchPriority="high" />}
      <SiteHeader />
      <article id="contenido" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm font-semibold text-zinc-400" aria-label="Breadcrumb">
          <a className="hover:text-db-orange" href="/">
            Inicio
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <a className="hover:text-db-orange" href={`/category/${capitulo.categoriaSlug}/`}>
            {capitulo.categoria}
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-300">{capitulo.titulo}</span>
        </nav>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-md bg-db-orange px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              {capitulo.categoria}
            </p>
            <h1 className="max-w-5xl text-3xl font-black leading-tight text-white sm:text-5xl">
              {capitulo.titulo}
            </h1>
          </div>
          <p className="text-sm font-semibold text-zinc-400">
            Capitulo {capitulo.numero === 9999 ? index + 1 : capitulo.numero}
          </p>
        </div>

        <section className="rounded-lg border border-white/10 bg-db-panel p-2 shadow-card sm:p-4" style={{ contain: "layout paint", contentVisibility: "auto" }}>
          <PlayerTabs
            players={capitulo.players?.length ? capitulo.players : [{ label: "Opcion 1", embed: capitulo.iframe }]}
            coverImage={capitulo.imagen}
            title={capitulo.titulo}
          />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black text-white">Sinopsis del capitulo</h2>
            <p className="mt-3 leading-8 text-zinc-300">{capitulo.descripcion}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black text-white">Enlaces de descarga</h2>
            {capitulo.links?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {capitulo.links.map((link, linkIndex) => (
                  <a
                    key={`${link.url}-${linkIndex}`}
                    href={link.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="focus-ring rounded-md border border-db-orange/45 px-4 py-2 text-sm font-black text-db-gold transition hover:border-db-gold hover:bg-db-orange hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 leading-8 text-zinc-400">
                Las descargas externas disponibles se agregan automaticamente desde la migracion.
              </p>
            )}
          </div>
        </section>

        <nav className="mt-6 grid gap-3 md:grid-cols-2" aria-label="Navegacion de capitulos">
          {anterior ? (
            <a
              href={episodeHref(anterior)}
              className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-db-orange hover:bg-db-orange/10"
            >
              <span className="text-xs font-black uppercase text-db-orange">Anterior</span>
              <p className="mt-1 line-clamp-2 font-bold text-white">{anterior.titulo}</p>
            </a>
          ) : (
            <div />
          )}
          {siguiente && (
            <a
              href={episodeHref(siguiente)}
              className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-db-orange hover:bg-db-orange/10 md:text-right"
            >
              <span className="text-xs font-black uppercase text-db-orange">Siguiente</span>
              <p className="mt-1 line-clamp-2 font-bold text-white">{siguiente.titulo}</p>
            </a>
          )}
        </nav>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black text-white">Mas episodios de esta saga</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {relacionados.map((item) => (
              <a
                key={item.slug}
                href={episodeHref(item)}
                className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 transition hover:-translate-y-1 hover:border-db-orange"
              >
                <div className="aspect-video bg-zinc-950" style={{ aspectRatio: "16 / 9" }}>
                  {item.imagen ? (
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#151515,#2d1608)] px-2 text-center text-xs font-black uppercase text-db-orange">
                      Dragon Ball
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-bold text-white">{item.titulo}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
