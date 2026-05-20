"use client";

import capitulos from "@/data/capitulos.json";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

const normalizar = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function initialQuery() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") || "";
}

const filtrosRapidos = ["Dragon Ball Super", "Dragon Ball Z", "Dragon Ball GT", "Dragon Ball Kai", "Latino"];

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(initialQuery());
  }, []);

  const indice = useMemo(
    () =>
      capitulos.map((capitulo) => ({
        ...capitulo,
        busqueda: normalizar(`${capitulo.titulo} ${capitulo.slug} ${capitulo.categoria || ""} ${capitulo.saga || ""}`),
      })),
    []
  );

  const resultados = useMemo(() => {
    const value = normalizar(deferredQuery.trim());
    if (!value) return [];
    return indice.filter((capitulo) => capitulo.busqueda.includes(value)).slice(0, 80);
  }, [deferredQuery, indice]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <label className="relative block">
        <span className="sr-only">Buscar capitulos</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ejemplo: Goku, Vegeta, Super latino, capitulo 10..."
          className="focus-ring h-14 w-full rounded-lg border border-white/10 bg-white px-4 pr-28 text-base font-semibold text-zinc-950 shadow-card placeholder:text-zinc-500"
          type="search"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-db-orange px-3 py-2 text-xs font-black uppercase text-white">
          {resultados.length}
        </span>
      </label>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
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

      {!query.trim() && (
        <div className="mt-8 rounded-lg border border-white/10 bg-db-panel p-8 text-center">
          <p className="text-xl font-black text-white">Escribe para buscar en el catalogo.</p>
          <p className="mt-2 text-zinc-300">
            La portada se mantiene ligera y el buscador carga resultados solo cuando lo necesitas.
          </p>
        </div>
      )}

      {query.trim() && resultados.length === 0 && (
        <div className="mt-8 rounded-lg border border-white/10 bg-db-panel p-8 text-center text-zinc-300">
          No encontre capitulos con esa busqueda.
        </div>
      )}

      {resultados.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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
                    loading={index < 4 ? "eager" : "lazy"}
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
                <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white">
                  {capitulo.titulo}
                </h2>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
