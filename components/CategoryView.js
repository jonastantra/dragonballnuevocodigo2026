import CapituloGrid from "@/components/CapituloGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function CategoryView({ category, capitulos }) {
  const firstImage = capitulos.find((capitulo) => capitulo.imagen)?.imagen;
  const editorial = category.editorial;

  return (
    <main className="min-h-screen">
      {firstImage && <link rel="preload" as="image" href={firstImage} fetchPriority="high" />}
      <SiteHeader />

      <section
        id="contenido"
        className="border-b border-white/10 bg-[linear-gradient(135deg,#f46a20_0%,#456ea7_100%)] px-4 py-16 text-center sm:px-6 lg:px-8"
      >
        <nav className="mx-auto mb-4 flex max-w-5xl justify-center text-sm font-bold text-white/80" aria-label="Breadcrumb">
          <a href="/" className="hover:text-white">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/#sagas" className="hover:text-white">Categorías</a>
          <span className="mx-2">/</span>
          <span className="text-white">{category.shortTitle || category.title}</span>
        </nav>
        <h1 className="site-hero-title mx-auto max-w-5xl text-3xl font-black uppercase text-white sm:text-5xl lg:text-6xl">
          {category.seoTitle || category.title}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-white/95 sm:text-lg">
          {category.description}
        </p>
      </section>

      {editorial && (
        <section className="border-b border-white/10 bg-db-panel px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-2xl font-black text-white">Guía y Sinopsis Completa</h2>
                <p className="mt-4 leading-8 text-zinc-300">{editorial.synopsis}</p>
                {editorial.cast && (
                  <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-black uppercase text-db-orange">Elenco de Doblaje Latino</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{editorial.cast}</p>
                  </div>
                )}
              </div>

              {editorial.arcs && (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="text-xl font-black text-white">Arcos y Sagas Principales</h2>
                  <div className="mt-4 space-y-3">
                    {editorial.arcs.map((arc) => (
                      <div
                        key={arc.name}
                        className="flex items-center justify-between gap-3 rounded-md border border-white/5 bg-white/[0.02] p-3 text-sm"
                      >
                        <span className="font-bold text-zinc-200">{arc.name}</span>
                        <span className="shrink-0 rounded bg-db-orange/20 px-2.5 py-1 text-xs font-black text-db-orange">
                          {arc.episodes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">
              {capitulos.length} capítulos disponibles
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Catálogo de Episodios</h2>
          </div>
          <a className="focus-ring rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white" href="/">
            Volver al inicio
          </a>
        </div>
        <CapituloGrid capitulos={capitulos} eagerCount={1} />
      </section>

      <SiteFooter />
    </main>
  );
}
