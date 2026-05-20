import CapituloGrid from "@/components/CapituloGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function CategoryView({ category, capitulos }) {
  const firstImage = capitulos.find((capitulo) => capitulo.imagen)?.imagen;

  return (
    <main className="min-h-screen">
      {firstImage && <link rel="preload" as="image" href={firstImage} fetchPriority="high" />}
      <SiteHeader />
      <section
        id="contenido"
        className="border-b border-white/10 bg-[linear-gradient(135deg,#f46a20_0%,#456ea7_100%)] px-4 py-20 text-center sm:px-6 lg:px-8"
      >
        <p className="mb-3 text-sm font-black uppercase tracking-wide text-white/85">Categoria</p>
        <h1 className="site-hero-title mx-auto max-w-5xl text-4xl font-black uppercase text-white sm:text-6xl">
          {category.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-white/90">
          {category.description}
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">
              {capitulos.length} capitulos
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Listado ordenado</h2>
          </div>
          <a className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold" href="/">
            Inicio
          </a>
        </div>
        <CapituloGrid capitulos={capitulos} eagerCount={1} />
      </section>
      <SiteFooter />
    </main>
  );
}
