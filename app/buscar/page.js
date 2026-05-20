import SearchClient from "@/components/SearchClient";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-static";

export const metadata = {
  title: "Buscar episodios de Dragon Ball",
  description:
    "Busca capitulos de Dragon Ball, Dragon Ball Z, Dragon Ball Super, GT, Kai y peliculas online.",
  alternates: {
    canonical: "/buscar/",
  },
};

export default function BuscarPage() {
  return (
    <main>
      <SiteHeader />
      <section
        id="contenido"
        className="border-b border-white/10 bg-[linear-gradient(135deg,#f46a20_0%,#456ea7_100%)] px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-wide text-black/75">Buscador rapido</p>
          <h1 className="site-hero-title mt-2 text-4xl font-black uppercase text-white sm:text-6xl">
            Buscar episodios de Dragon Ball
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-white/90">
            Encuentra capitulos por saga, idioma, numero o titulo sin cargar todo el catalogo en la portada.
          </p>
        </div>
      </section>
      <SearchClient />
      <SiteFooter />
    </main>
  );
}
