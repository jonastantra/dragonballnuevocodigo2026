"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

function stripNoise(value) {
  return String(value || "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase()
    .split("?")[0]
    .split("#")[0]
    .replace(/\/feed\/?$/, "")
    .replace(/\/page\/\d+\/?$/, "")
    .replace(/\/amp\/?$/, "")
    .replace(/\/trackback\/?$/, "")
    .replace(/\.html?$/, "")
    .replace(/\/+$/, "");
}

function findSimilar(path, chapters) {
  const cleaned = stripNoise(path);
  if (!cleaned) return null;

  const segments = cleaned.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || cleaned;

  const exact = chapters.find(
    (chap) => chap.slug === lastSegment || chap.slug === cleaned
  );
  if (exact) return exact;

  if (segments[0] === "archivos" && segments[1] && /^\d+$/.test(segments[1])) {
    const byId = chapters.find((chap) => chap.id === segments[1]);
    if (byId) return byId;
  }

  let best = null;
  let bestScore = 0;

  for (const chap of chapters) {
    const slug = chap.slug;
    let score = 0;

    if (cleaned.length >= 6 && slug.includes(cleaned)) score = cleaned.length * 2;
    else if (cleaned.includes(slug) && slug.length >= 10) score = slug.length;
    else if (lastSegment.length >= 7 && slug.includes(lastSegment)) score = lastSegment.length;
    else if (lastSegment.length >= 10) {
      const parts = slug.split("-");
      for (let i = 0; i < parts.length - 1; i += 1) {
        const sub = parts.slice(i, i + 2).join("-");
        if (sub.length >= 6 && lastSegment.includes(sub)) score = Math.max(score, sub.length * 0.85);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = chap;
    }
  }

  return bestScore >= 14 ? best : null;
}

export default function NotFoundClient({ chapterIndex }) {
  const [currentPath, setCurrentPath] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);
    const similar = findSimilar(path, chapterIndex);
    if (similar) {
      setSuggestion(similar);
      let remaining = 6;
      const timer = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          window.location.replace(similar.url);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [chapterIndex]);

  if (!currentPath) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl text-center">
          <p className="text-sm uppercase tracking-wider text-zinc-400">404</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Pagina no encontrada</h1>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link href="/" className="text-zinc-300 hover:text-white">
              Volver al inicio
            </Link>
            <span className="text-zinc-600">·</span>
            <Link href="/buscar/" className="text-zinc-300 hover:text-white">
              Buscar episodio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (suggestion) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl text-center">
          <p className="text-sm uppercase tracking-wider text-zinc-400">404</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Tal vez quisiste decir</h2>
          <p className="mt-3 text-zinc-300">
            La pagina{" "}
            <code className="break-all rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-amber-400">
              {currentPath}
            </code>{" "}
            ya no existe, pero encontramos un capitulo muy parecido:
          </p>
          <div className="mt-5 rounded-lg border border-zinc-700 bg-zinc-900/60 p-5">
            <Link
              href={suggestion.url}
              className="text-lg font-semibold text-white hover:text-amber-400"
            >
              {suggestion.titulo}
            </Link>
            <p className="mt-2 text-sm text-zinc-400">
              Redirigiendo en {countdown} segundo{countdown !== 1 ? "s" : ""}...
            </p>
          </div>
          <div className="mt-5">
            <Link
              href={suggestion.url}
              className="inline-block rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-400"
            >
              Ir al capitulo ahora
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link href="/" className="text-zinc-300 hover:text-white">
              Volver al inicio
            </Link>
            <span className="text-zinc-600">·</span>
            <Link href="/buscar/" className="text-zinc-300 hover:text-white">
              Buscar episodio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm uppercase tracking-wider text-zinc-400">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Pagina no encontrada</h1>
        <p className="mt-3 text-zinc-300">
          La URL{" "}
          <code className="break-all rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-amber-400">
            {currentPath}
          </code>{" "}
          no existe en Dragon Ball HD Sin Limites.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Link href="/" className="text-zinc-300 hover:text-white">
            Volver al inicio
          </Link>
          <span className="text-zinc-600">·</span>
          <Link href="/buscar/" className="text-zinc-300 hover:text-white">
            Buscar episodio
          </Link>
        </div>
      </div>
    </main>
  );
}
