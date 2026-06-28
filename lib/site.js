import capitulos from "@/data/capitulos.json";
import legacyPages from "@/data/legacy-pages.json";

export const siteUrl = "https://dragonballhdsinlimites.net";

export const menuItems = [
  { label: "Inicio", href: "/" },
  { label: "DBS LAT", href: "/category/dragon-ball-super-latino/" },
  { label: "DBS SUB", href: "/category/dragon-ball-super-sub/" },
  { label: "DB GT", href: "/category/dragon-ball-gt/" },
  { label: "DB Z", href: "/category/dragon-ball-z/" },
  { label: "DB KAI", href: "/category/dragon-ball-kai/" },
  { label: "DB", href: "/category/dragon-ball/" },
  {
    label: "DB PELICULAS",
    href: "/dragon-ball-todas-las-peliculas-y-especiales/",
    children: [
      {
        label: "Dragon Ball Super Peliculas",
        href: "/category/dragon-ball-todas-las-peliculas/dragon-ball-super-peliculas/",
      },
      {
        label: "Dragon Ball Z Peliculas",
        href: "/category/dragon-ball-todas-las-peliculas/dragon-ball-z-peliculas/",
      },
      {
        label: "Dragon Ball Peliculas",
        href: "/category/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/",
      },
    ],
  },
  { label: "Blog", href: "/blog/" },
];

export const utilityPages = [
  { path: "/buscar/", title: "Buscar episodios" },
  { path: "/blog/", title: "Blog" },
  { path: "/feed/", title: "Feed" },
  { path: "/page/2/", title: "Pagina 2" },
  { path: "/category/blog/", title: "Blog" },
  { path: "/comments/feed/", title: "Comentarios" },
  { path: "/wp-json/", title: "API WordPress" },
  { path: "/xmlrpc.php/", title: "XML-RPC" },
  { path: "/politica-de-privacidad/", title: "Politica de Privacidad" },
  { path: "/terminos-y-condiciones/", title: "Terminos y Condiciones" },
  { path: "/aviso-legal/", title: "Aviso Legal" },
  { path: "/contacto/", title: "Contacto" },
];

export const categoryPages = [
  {
    path: "/category/dragon-ball-super-latino/",
    title: "DBS LAT",
    description: "Capitulos de Dragon Ball Super latino.",
    filter: (capitulo) => capitulo.categoriaSlug === "dragon-ball-super-latino",
  },
  {
    path: "/category/dragon-ball-super-sub/",
    title: "DBS SUB",
    description: "Capitulos de Dragon Ball Super subtitulados.",
    filter: (capitulo) => capitulo.categoriaSlug === "dragon-ball-super-sub",
  },
  {
    path: "/category/dragon-ball-gt/",
    title: "DB GT",
    description: "Capitulos de Dragon Ball GT.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/dragon-ball-gt-capitulos-completos-latinos-online/",
    title: "DB GT",
    description: "Capitulos de Dragon Ball GT.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/dragon-ball-gt-saga-el-gran-viaje/",
    title: "Dragon Ball GT Saga El Gran Viaje",
    description: "Capitulos de Dragon Ball GT.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/dragon-ball-gt-saga-el-gran-viaje/page/2/",
    title: "Dragon Ball GT Saga El Gran Viaje",
    description: "Capitulos de Dragon Ball GT.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/dragon-ball-gt-saga-de-super-androide-17/",
    title: "Dragon Ball GT Saga de Super Androide 17",
    description: "Capitulos de Dragon Ball GT.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/category/dragon-ball-z/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/dragon-ball-z-capitulos-online-espanol-latino/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z en audio latino.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/dragonballz-capitulos-online-espanol-latino/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z en audio latino.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/dragon-ball-z-capitulos-online-espanol-latino/page/14/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z en audio latino.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/dragon-ball-z-capitulos-online-espanol-latino/page/15/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z en audio latino.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/saga-freezer/",
    title: "Saga Freezer",
    description: "Capitulos de Dragon Ball Z de la Saga de Freezer.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/saga-de-cell/",
    title: "Saga de Cell",
    description: "Capitulos de Dragon Ball Z de la Saga de Cell.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/saga-de-majin-boo/page/4/",
    title: "Saga de Majin Boo",
    description: "Capitulos de Dragon Ball Z de la Saga de Majin Boo.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/category/dragon-ball-kai/",
    title: "DB KAI",
    description: "Capitulos de Dragon Ball Kai.",
    filter: (capitulo) => capitulo.saga === "kai",
  },
  {
    path: "/category/dragon-ball/",
    title: "DB",
    description: "Capitulos de Dragon Ball clasico.",
    filter: (capitulo) => capitulo.saga === "db",
  },
  {
    path: "/category/dragon-ball/21-torneo-de-las-artes-marciales/",
    title: "21 Torneo de las Artes Marciales",
    description: "Capitulos del 21 Torneo de las Artes Marciales.",
    filter: (capitulo) => capitulo.saga === "db",
  },
  {
    path: "/category/dragon-ball/22-torneo-de-las-artes-marciales/",
    title: "22 Torneo de las Artes Marciales",
    description: "Capitulos del 22 Torneo de las Artes Marciales.",
    filter: (capitulo) => capitulo.saga === "db",
  },
  {
    path: "/category/dragon-ball/23o-torneo-de-las-artes-marciales/",
    title: "23o Torneo de las Artes Marciales",
    description: "Capitulos del 23o Torneo de las Artes Marciales.",
    filter: (capitulo) => capitulo.saga === "db",
  },
  {
    path: "/category/dragon-ball-gt/dragon-ball-gt-saga-de-baby/",
    title: "Dragon Ball GT Saga de Baby",
    description: "Capitulos de Dragon Ball GT Saga de Baby.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/category/dragon-ball-gt/dragon-ball-gt-saga-de-super-androide-17/",
    title: "Dragon Ball GT Saga de Super Androide 17",
    description: "Capitulos de Dragon Ball GT.",
    filter: (capitulo) => capitulo.saga === "gt",
  },
  {
    path: "/category/dragon-ball-z/page/2/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/category/dragon-ball-z/page/4/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z.",
    filter: (capitulo) => capitulo.saga === "z",
  },
  {
    path: "/category/dragon-ball/saga-de-piccolo-daimaku/",
    title: "Saga de Piccolo Daimaku",
    description: "Capitulos de Dragon Ball clasico.",
    filter: (capitulo) => capitulo.saga === "db",
  },
  {
    path: "/dragon-ball-todas-las-peliculas-y-especiales/",
    title: "DB PELICULAS",
    description: "Peliculas y especiales de Dragon Ball.",
    filter: (capitulo) => capitulo.saga === "peliculas" || /pelicula|especial/i.test(capitulo.titulo),
  },
  {
    path: "/category/dragon-ball-todas-las-peliculas/dragon-ball-super-peliculas/",
    title: "Dragon Ball Super Peliculas",
    description: "Peliculas de Dragon Ball Super.",
    filter: (capitulo) => capitulo.saga === "peliculas" && /super/i.test(capitulo.titulo),
  },
  {
    path: "/category/dragon-ball-todas-las-peliculas/dragon-ball-z-peliculas/",
    title: "Dragon Ball Z Peliculas",
    description: "Peliculas de Dragon Ball Z.",
    filter: (capitulo) => capitulo.saga === "peliculas" && /dragon ball z|dbz/i.test(capitulo.titulo),
  },
  {
    path: "/category/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/",
    title: "Dragon Ball Peliculas",
    description: "Peliculas de Dragon Ball.",
    filter: (capitulo) => capitulo.saga === "peliculas",
  },
];

export function normalizePath(value) {
  const path = String(value || "").split("?")[0].split("#")[0].trim();
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
}

export function comparePath(value) {
  return safeDecode(normalizePath(value)).toLowerCase();
}

export function pathToSegments(value) {
  return normalizePath(value)
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => safeDecode(segment));
}

export function episodeHref(capitulo) {
  return capitulo.url || `/capitulo/${capitulo.slug}/`;
}

export function findCapituloBySlug(slug) {
  return capitulos.find((capitulo) => capitulo.slug === slug);
}

export function findCapituloByPath(path) {
  const target = comparePath(path);
  return capitulos.find((capitulo) => {
    if (comparePath(episodeHref(capitulo)) === target) return true;
    return Array.isArray(capitulo.aliases) && capitulo.aliases.some((alias) => comparePath(alias) === target);
  });
}

export function findCategoryByPath(path) {
  const target = comparePath(path);
  return categoryPages.find((category) => comparePath(category.path) === target);
}

export function findUtilityByPath(path) {
  const target = comparePath(path);
  return utilityPages.find((page) => comparePath(page.path) === target);
}

export function findLegacyPageByPath(path) {
  const target = comparePath(path);
  return legacyPages.find((page) => comparePath(page.path) === target);
}

export function getLegacyPages() {
  return legacyPages;
}

export function getCategoryCapitulos(category) {
  const seen = new Set();
  return capitulos.filter((capitulo) => {
    if (!category.filter(capitulo)) return false;
    const key = capitulo.slug || episodeHref(capitulo);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripUrlNoise(value) {
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

export function findSimilarCapitulo(path) {
  const cleaned = stripUrlNoise(path);
  if (!cleaned) return null;

  const segments = cleaned.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || cleaned;

  const exact = capitulos.find(
    (capitulo) => capitulo.slug === lastSegment || capitulo.slug === cleaned
  );
  if (exact) return { capitulo: exact, score: 100 };

  if (segments[0] === "archivos" && segments[1] && /^\d+$/.test(segments[1])) {
    const byId = capitulos.find((capitulo) => capitulo.id === segments[1]);
    if (byId) return { capitulo: byId, score: 95 };
  }

  let best = null;
  let bestScore = 0;

  for (const capitulo of capitulos) {
    const slug = capitulo.slug;
    let score = 0;

    if (cleaned.length >= 6 && slug.includes(cleaned)) score = cleaned.length * 2;
    else if (cleaned.includes(slug) && slug.length >= 10) score = slug.length;
    else if (lastSegment.length >= 7 && slug.includes(lastSegment)) score = lastSegment.length;
    else if (lastSegment.length >= 10) {
      const parts = slug.split("-");
      for (let i = 0; i < parts.length - 1; i += 1) {
        const sub = parts.slice(i, i + 2).join("-");
        if (sub.length >= 6 && lastSegment.includes(sub)) {
          score = Math.max(score, sub.length * 0.85);
        }
      }
    } else if (cleaned.length >= 8 && slug.length >= 10) {
      let shared = 0;
      const minLen = Math.min(cleaned.length, slug.length);
      const maxLen = Math.max(cleaned.length, slug.length);
      for (let i = 0; i < minLen - 3; i += 1) {
        if (cleaned.includes(slug.slice(i, i + 4))) shared += 1;
      }
      score = shared * 2 - Math.abs(maxLen - minLen) * 0.1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = capitulo;
    }
  }

  return bestScore >= 14 ? { capitulo: best, score: bestScore } : null;
}

export function pageTitle(title) {
  return `${title} | Dragon Ball HD Sin Limites`;
}

export function getEpisodeDescription(capitulo) {
  if (capitulo.seoDescription) return capitulo.seoDescription;
  if (capitulo.descripcion) return capitulo.descripcion;

  const categoria = capitulo.categoria || "Dragon Ball";
  return `Ver ${capitulo.titulo} online. Disfruta de este gran episodio de la saga de ${categoria} con audio latino en alta calidad y reproductor optimizado en Dragon Ball HD Sin Límites.`;
}
