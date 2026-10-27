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
            <p><strong>Dragon Ball HD Sin Límites</strong> reúne el catálogo organizado de series, sagas, especiales de televisión y películas del universo creado por Akira Toriyama. Nuestro objetivo es facilitar una navegación rápida, limpia y sin fricciones desde cualquier dispositivo móvil, tablet o escritorio.</p>
            <p>Cada ficha incluye sinopsis detallada, guía de arco argumental, navegación cronológica entre capítulos anteriores y siguientes, y acceso a los servidores de reproducción externos disponibles.</p>
          </> : page.path === "/blog/" ? <>
            <h2 className="text-2xl font-black text-white">Guía de Sagas y Orden Cronológico de Dragon Ball</h2>
            <p>Si es tu primera vez explorando la obra de Akira Toriyama, el orden cronológico recomendado comienza con <a className="font-bold text-db-orange underline" href="/category/dragon-ball/">Dragon Ball Clásico</a> (153 capítulos), donde Son Goku y Bulma inician la búsqueda de las Esferas del Dragón y participan en los legendarios Torneos de las Artes Marciales (Tenkaichi Budokai).</p>
            <p>A continuación sigue <a className="font-bold text-db-orange underline" href="/category/dragon-ball-z/">Dragon Ball Z</a> (291 capítulos), que abarca la Saga de los Saiyajins, la batalla en Namekusei contra Freezer, los Juegos de Cell y la Saga de Majin Buu. Si prefieres una versión remasterizada en HD más fiel al ritmo del manga y sin capítulos de relleno, puedes ver <a className="font-bold text-db-orange underline" href="/category/dragon-ball-kai/">Dragon Ball Kai</a> (167 capítulos).</p>
            <p>Después de la derrota de Majin Buu, la continuación oficial es <a className="font-bold text-db-orange underline" href="/category/dragon-ball-super-latino/">Dragon Ball Super en Audio Latino</a> (o <a className="font-bold text-db-orange underline" href="/category/dragon-ball-super-sub/">Dragon Ball Super Subtitulado</a>), donde aparecen Bills, Whis, Goku Black y el Torneo del Poder. Por su parte, <a className="font-bold text-db-orange underline" href="/category/dragon-ball-gt/">Dragon Ball GT</a> (64 capítulos) y <a className="font-bold text-db-orange underline" href="/category/dragon-ball-heroes/">Super Dragon Ball Heroes</a> exploran líneas temporales alternativas e historias especiales, complementadas por las <a className="font-bold text-db-orange underline" href="/dragon-ball-todas-las-peliculas-y-especiales/">Películas y Especiales de TV</a>.</p>
          </> : page.path === "/politica-de-privacidad/" ? <>
            <p>Este sitio utiliza herramientas analíticas y publicitarias como Google Tag Manager y Google AdSense para medir el rendimiento técnico y financiar el mantenimiento del portal. Al activar un reproductor de video, tu navegador se conecta directamente con el servidor externo elegido.</p>
            <p>Dichos servicios de terceros pueden emplear cookies técnicas o publicitarias conforme a sus propias políticas de privacidad. Puedes gestionar o bloquear las cookies en cualquier momento desde la configuración de privacidad de tu navegador.</p>
          </> : page.path === "/contacto/" ? <>
            <p>Para reportar un enlace caído o un problema de visualización en algún episodio, te recomendamos probar primero las opciones alternativas de servidor disponibles en la pestaña superior del reproductor.</p>
            <p>También puedes utilizar el <a className="font-bold text-db-orange underline" href="/buscar/">buscador del catálogo</a> o navegar por las <a className="font-bold text-db-orange underline" href="/#sagas">categorías principales</a> para localizar versiones en español latino o subtituladas del capítulo.</p>
          </> : page.path === "/terminos-y-condiciones/" ? <>
            <p>El acceso al catálogo informativo de Dragon Ball HD Sin Límites es gratuito. Las opciones de reproducción embebidas dependen de proveedores de alojamiento de video externos e independientes, por lo que su disponibilidad puede variar sin previo aviso.</p>
            <p>Si una opción de video deja de responder, selecciona otro servidor disponible en la ficha del episodio. Nunca descargues ni ejecutes software de terceros para reproducir contenido en este portal.</p>
          </> : <>
            <p>Dragon Ball, Dragon Ball Z, Dragon Ball GT, Dragon Ball Kai y Dragon Ball Super, así como sus personajes y marcas asociadas, son propiedad exclusiva de Bird Studio / Shueisha, Akira Toriyama y Toei Animation.</p>
            <p>Este portal opera como un índice informativo e integra únicamente reproductores embebidos proporcionados por servicios externos de terceros, sujetos a las políticas de sus respectivos titulares.</p>
          </>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
