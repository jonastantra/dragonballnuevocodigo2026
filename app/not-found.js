import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Página no encontrada", robots: { index: false, follow: true } };

export default function NotFound() {
  return <main><SiteHeader /><section id="contenido" className="mx-auto max-w-3xl px-4 py-20 text-center">
    <p className="text-db-orange font-bold">404</p><h1 className="mt-3 text-4xl font-black">No encontramos esta página</h1>
    <p className="mt-4 text-zinc-300">El enlace pudo cambiar. Explora las sagas o busca el capítulo por su nombre.</p>
    <div className="mt-8 flex justify-center gap-4"><a className="primary-button" href="/">Ver sagas</a><a className="secondary-button" href="/buscar/">Buscar capítulo</a></div>
  </section><SiteFooter /></main>;
}
