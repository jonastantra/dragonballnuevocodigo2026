import { episodeHref } from "@/lib/site";

export default function CapituloGrid({ capitulos, eagerCount = 1 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {capitulos.map((capitulo, index) => (
        <a
          key={capitulo.slug}
          href={episodeHref(capitulo)}
          className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 transition duration-200 hover:-translate-y-1 hover:border-db-orange hover:shadow-glow"
          style={index > 9 ? { contentVisibility: "auto", containIntrinsicSize: "260px 210px" } : undefined}
        >
          <div className="relative aspect-video bg-zinc-950" style={{ aspectRatio: "16 / 9" }}>
            {capitulo.imagen ? (
              <img
                src={capitulo.imagen}
                alt={capitulo.titulo}
                loading={index < eagerCount ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#151515,#2d1608)] px-3 text-center text-xs font-black uppercase text-db-orange">
                Dragon Ball Online
              </div>
            )}
            {capitulo.numero && capitulo.numero !== 9999 && (
              <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-black uppercase tabular-nums text-db-orange backdrop-blur-sm">
                Ep. {capitulo.numero}
              </span>
            )}
          </div>
          <div className="p-3">
            <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white group-hover:text-db-gold transition-colors">
              {capitulo.titulo}
            </h3>
          </div>
        </a>
      ))}
    </div>
  );
}
