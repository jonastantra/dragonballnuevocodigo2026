import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function UtilityPage({ page }) {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section id="contenido" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm font-semibold text-zinc-400" aria-label="Breadcrumb">
          <a className="hover:text-db-orange" href="/">
            Inicio
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-300">{page.title}</span>
        </nav>
        <p className="mb-3 text-sm font-black uppercase text-db-orange">Dragon Ball HD Sin Limites</p>
        <h1 className="text-4xl font-black text-white">{page.title}</h1>
        <div className="mt-6 space-y-4 rounded-lg border border-white/10 bg-db-panel p-6 leading-8 text-zinc-300">
          <p>
            Esta página se conserva para mantener los enlaces históricos del sitio y evitar
            errores 404 durante la migración estática.
          </p>
          <p>
            Usa el menú superior o el buscador para volver al catálogo completo de episodios.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
