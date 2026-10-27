import { menuItems } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-[#0b0e16]/95 backdrop-blur-xl">
      <a href="#contenido" className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-db-orange focus:p-3">Saltar al contenido</a>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="focus-ring flex items-center gap-3 rounded-md" aria-label="Dragon Ball HD Sin Límites, inicio">
          <span className="dragon-mark" aria-hidden="true">★</span>
          <span className="text-base font-black uppercase leading-tight sm:text-xl">Dragon Ball <span className="block text-xs tracking-[0.16em] text-db-orange">HD Sin Límites</span></span>
        </a>
        <a href="/#sagas" className="secondary-button ml-auto sm:hidden">Sagas</a>
        <form action="/buscar/" role="search" className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto sm:min-w-80">
          <label htmlFor="site-search" className="sr-only">Buscar episodios</label>
          <input id="site-search" name="q" type="search" placeholder="Serie, capítulo o personaje…" className="focus-ring min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-base text-white placeholder:text-zinc-400" />
          <button type="submit" className="primary-button">Buscar</button>
        </form>
      </div>
      <nav className="mx-auto hidden max-w-7xl items-center gap-1 overflow-x-auto px-4 pb-3 sm:flex sm:px-6 lg:px-8" aria-label="Menú principal">
        {menuItems.map(item => <a key={item.href} href={item.href} className="focus-ring shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white">{item.label}</a>)}
      </nav>
      <details className="group sm:hidden">
        <summary className="cursor-pointer border-t border-white/10 px-4 py-2 text-center text-sm font-bold">Explorar todas las sagas ▾</summary>
        <nav className="grid grid-cols-2 gap-2 px-4 pb-4" aria-label="Menú móvil">{menuItems.map(item => <a key={item.href} href={item.href} className="focus-ring rounded-lg bg-white/5 p-3 text-sm font-bold">{item.label}</a>)}</nav>
      </details>
    </header>
  );
}
