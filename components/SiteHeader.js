import { menuItems } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-db-orange bg-[#0b0b0b]/95 backdrop-blur-xl">
      <a
        href="#contenido"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-db-orange focus:px-4 focus:py-2 focus:font-black focus:text-white"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex max-w-[1740px] items-center gap-4 px-4 py-3 lg:px-8">
        <a
          href="/"
          className="focus-ring flex shrink-0 items-center gap-3 rounded-md pr-1 text-white"
          aria-label="Dragonballhdsinlimites inicio"
        >
          <span className="text-4xl font-black leading-none text-db-orange" aria-hidden="true">
            DB
          </span>
          <span className="site-logo-text hidden text-xl font-black uppercase leading-none tracking-normal text-white sm:block xl:text-2xl">
            Dragonballhdsinlimites
          </span>
        </a>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Menu principal">
          {menuItems.map((item, index) => (
            <div key={item.href} className="group relative">
              <a
                href={item.href}
                className={`focus-ring inline-flex items-center gap-2 rounded-md px-4 py-3 text-base font-black text-white transition hover:bg-db-orange ${
                  index === 0 ? "bg-db-orange" : ""
                }`}
              >
                {item.label}
                {item.children && <span aria-hidden="true">v</span>}
              </a>
              {item.children && (
                <div className="invisible absolute left-0 top-full min-w-72 translate-y-2 rounded-md border border-white/10 bg-db-panel2 p-2 opacity-0 shadow-card transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="focus-ring block rounded-md px-4 py-3 text-sm font-bold text-zinc-200 hover:bg-db-orange hover:text-white"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <form action="/buscar/" className="ml-auto hidden min-w-72 max-w-sm flex-1 items-center md:flex">
          <label htmlFor="site-search" className="sr-only">
            Buscar episodios
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Buscar episodios..."
            className="focus-ring min-w-0 flex-1 rounded-l-full border border-white/10 bg-white/[0.06] px-5 py-3 text-base text-white placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="focus-ring rounded-r-full bg-db-orange px-5 py-3 text-base font-black text-white transition hover:bg-db-gold hover:text-black"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </form>
      </div>

      <details className="group lg:hidden" aria-label="Menu movil">
        <summary className="flex cursor-pointer items-center justify-center gap-2 bg-db-orange px-4 py-3 text-sm font-black text-white marker:content-none">
          <span>MENU</span>
          <svg className="size-4 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <nav className="grid grid-cols-3 gap-1.5 border-t-2 border-db-orange bg-[#111] px-3 py-3" aria-label="Menu principal movil">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md bg-white/[0.07] px-2 py-3 text-center text-xs font-black text-white hover:bg-db-orange"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}
