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
    path: "/category/dragon-ball-z/",
    title: "DB Z",
    description: "Capitulos de Dragon Ball Z.",
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

export function pageTitle(title) {
  return `${title} | Dragon Ball HD Sin Limites`;
}
