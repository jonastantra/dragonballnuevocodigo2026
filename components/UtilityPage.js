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
          {page.path === "/sobre-nosotros/" ? <>
            <p>Dragon Ball HD Sin Límites reúne fichas de las series y películas del universo Dragon Ball. Puedes explorar las sagas, consultar sinopsis y encontrar los capítulos mediante el buscador.</p>
            <p>Las opciones de video provienen de reproductores externos. Su disponibilidad puede cambiar.</p>
          </> : page.path === "/blog/" ? <>
            <p>Si es tu primera vez, comienza con Dragon Ball clásico para conocer a Goku y después continúa con Dragon Ball Z. Dragon Ball Kai es una edición de Z, no una aventura que continúe después de ella.</p>
            <p>Dragon Ball Super y Dragon Ball GT siguen caminos distintos. Heroes presenta historias alternativas; sus acontecimientos no deben confundirse con la continuidad principal.</p>
            <p><a className="text-db-orange underline" href="/#sagas">Explora las series y elige tu siguiente capítulo.</a></p>
          </> : page.path === "/politica-de-privacidad/" ? <>
            <p>Este sitio carga herramientas de Google Tag Manager y Google AdSense. Al abrir un reproductor externo, tu navegador también se conecta con el proveedor de video correspondiente.</p>
            <p>Esos proveedores pueden recibir información técnica de la conexión y gestionar cookies conforme a sus propias políticas. Puedes administrar los permisos de cookies y de sitios desde tu navegador.</p>
          </> : page.path === "/contacto/" ? <>
            <p>Por ahora no hay un formulario ni un canal de contacto publicado en este sitio.</p>
            <p>Si un video no carga, intenta otra opción del reproductor o busca el capítulo en el catálogo.</p>
          </> : page.path === "/terminos-y-condiciones/" ? <>
            <p>La disponibilidad de cada opción de video depende de su proveedor externo. Una ficha en el catálogo no garantiza que todos sus enlaces permanezcan activos.</p>
            <p>Si una opción deja de responder, puedes probar otro servidor disponible. No es necesario instalar programas para navegar por las fichas del catálogo.</p>
          </> : <>
            <p>Dragon Ball y sus personajes pertenecen a sus respectivos titulares. La presencia de una ficha no implica afiliación oficial con sus creadores ni con los proveedores externos de video.</p>
            <p>El contenido y los servicios de sitios externos están sujetos a las condiciones de sus respectivos responsables.</p>
          </>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
