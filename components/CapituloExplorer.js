"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const normalizar = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const filtrosRapidos = [
  "Dragon Ball Super",
  "Dragon Ball Z",
  "Dragon Ball GT",
  "Dragon Ball Kai",
  "Pelicula",
  "Latino",
];

export default function CapituloExplorer({ capitulos }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const deferredQuery = useDeferredValue(query);

  const indice = useMemo(
    () =>
      capitulos.map((capitulo) => ({
        ...capitulo,
        busqueda: normalizar(`${capitulo.titulo} ${capitulo.slug}`),
      })),
    [capitulos]
  );

  const resultados = useMemo(() => {
    const value = normalizar(deferredQuery.trim());
    if (!value) return indice;
    return indice.filter((capitulo) => capitulo.busqueda.includes(value));
  }, [deferredQuery, indice]);

  return (
    <section id="capitulos" className="border-t border-white/10 bg-black/25 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-db-orange">Catalogo</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Todos los capitulos
            </h2>
          </div>

          <label className="relative block w-full md:max-w-md">
            <span className="sr-only">Buscar capitulos</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por titulo o numero..."
              className="focus-ring h-13 w-full rounded-lg border border-white/10 bg-white px-4 py-4 pr-28 text-base font-semibold text-zinc-950 shadow-card placeholder:text-zinc-500"
              type="search"
              autoComplete="off"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-db-orange px-3 py-2 text-xs font-black uppercase text-white">
              {resultados.length}
            </span>
          </label>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setQuery("")}
            className="focus-ring shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-db-orange"
          >
            Todos
          </button>
          {filtrosRapidos.map((filtro) => (
            <button
              type="button"
              key={filtro}
              onClick={() => setQuery(filtro)}
              className="focus-ring shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-db-orange hover:text-db-gold"
            >
              {filtro}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {resultados.map((capitulo, index) => (
            <a
              key={capitulo.slug}
              href={capitulo.url || `/capitulo/${capitulo.slug}/`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 transition duration-200 hover:-translate-y-1 hover:border-db-orange hover:shadow-glow"
            >
              <div className="aspect-video bg-zinc-950">
                {capitulo.imagen ? (
                  <img
                    src={capitulo.imagen}
                    alt={capitulo.titulo}
                    loading={index < 8 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#151515,#2d1608)] px-3 text-center text-xs font-black uppercase text-db-orange">
                    Dragon Ball Online
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white">
                  {capitulo.titulo}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {resultados.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-db-panel p-8 text-center text-zinc-300">
            No encontre capitulos con esa busqueda.
          </div>
        )}
      </div>
    </section>
  );
}
