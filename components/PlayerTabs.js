"use client";

import { useState } from "react";

export default function PlayerTabs({ players, coverImage, title }) {
  const validPlayers = Array.isArray(players) ? players.filter((player) => player.embed) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const activePlayer = validPlayers[activeIndex] || validPlayers[0];

  if (!activePlayer) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-zinc-300">
        Reproductor no disponible para este capitulo.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div>
        {validPlayers.length > 1 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Opciones de video">
            {validPlayers.map((player, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${player.label}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="player-panel"
                  onClick={() => setActiveIndex(index)}
                  className={`focus-ring shrink-0 rounded-md border px-4 py-2 text-sm font-black transition ${
                    isActive
                      ? "border-db-orange bg-db-orange text-white"
                      : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-db-orange"
                  }`}
                >
                  {player.label}
                </button>
              );
            })}
          </div>
        )}

        <div
          id="player-panel"
          onClick={() => setIsLoaded(true)}
          className="relative aspect-video overflow-hidden rounded-lg bg-zinc-950 border border-white/5 cursor-pointer group shadow-2xl"
          style={{ aspectRatio: "16 / 9" }}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={title || "Portada"}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a1205] via-zinc-950 to-[#0c1a2e] opacity-80" />
          )}

          {/* Sombra de viñeta / degradado de cine */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Botón de reproducción y textos centrales */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff6b1a] text-white shadow-[0_0_30px_rgba(255,107,26,0.6)] transition duration-300 group-hover:scale-110 group-hover:bg-[#ff853a] group-hover:shadow-[0_0_40px_rgba(255,107,26,0.8)]">
              {/* Círculo pulsante exterior */}
              <div className="absolute inset-0 rounded-full border border-[#ff6b1a]/40 animate-ping opacity-75" />
              
              {/* Icono de Play */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-9 w-9 translate-x-0.5 text-white"
              >
                <path d="M8 5.14v14c0 .86.94 1.36 1.66.9l10-7a1 1 0 0 0 0-1.8l-10-7A1 1 0 0 0 8 5.14Z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-black uppercase tracking-wider text-white sm:text-2xl drop-shadow-md">
              Reproducir Capitulo
            </h3>
            {title && (
              <p className="mt-1 max-w-md text-xs font-bold text-zinc-300 line-clamp-1 drop-shadow-sm sm:text-sm">
                {title}
              </p>
            )}
            <span className="mt-3 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300 backdrop-blur-sm transition duration-300 group-hover:bg-[#ff6b1a]/20 group-hover:text-white">
              Cargar Reproductor
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {validPlayers.length > 1 && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Opciones de video">
          {validPlayers.map((player, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${player.label}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="player-panel"
                onClick={() => setActiveIndex(index)}
                className={`focus-ring shrink-0 rounded-md border px-4 py-2 text-sm font-black transition ${
                  isActive
                    ? "border-db-orange bg-db-orange text-white"
                    : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-db-orange"
                }`}
              >
                {player.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="video-frame relative aspect-video overflow-hidden rounded-lg bg-black" style={{ aspectRatio: "16 / 9" }}>
        {/* Spinner en el fondo mientras carga el iframe */}
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-0">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#ff6b1a]" />
        </div>
        
        {/* Contenedor del Iframe */}
        <div
          id="player-panel"
          role="tabpanel"
          className="absolute inset-0 z-10 w-full h-full"
          dangerouslySetInnerHTML={{ __html: activePlayer.embed }}
        />
      </div>
    </div>
  );
}
