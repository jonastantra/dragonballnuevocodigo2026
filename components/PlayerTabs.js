"use client";

import { useState } from "react";

export default function PlayerTabs({ players }) {
  const validPlayers = Array.isArray(players) ? players.filter((player) => player.embed) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activePlayer = validPlayers[activeIndex] || validPlayers[0];

  if (!activePlayer) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-zinc-300">
        Reproductor no disponible para este capitulo.
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

      <div
        id="player-panel"
        role="tabpanel"
        className="video-frame relative aspect-video overflow-hidden rounded-lg bg-black"
        dangerouslySetInnerHTML={{ __html: activePlayer.embed }}
      />
    </div>
  );
}
