import capitulos from "@/data/capitulos.json";
import legacyPages from "@/data/legacy-pages.json";

export const siteUrl = "https://dragonballhdsinlimites.net";

export const menuItems = [
  { label: "Inicio", href: "/" },
  { label: "Dragon Ball Super", href: "/category/dragon-ball-super-latino/" },
  { label: "Dragon Ball Super Sub", href: "/category/dragon-ball-super-sub/" },
  { label: "Dragon Ball Z", href: "/category/dragon-ball-z/" },
  { label: "Dragon Ball GT", href: "/category/dragon-ball-gt/" },
  { label: "Dragon Ball Kai", href: "/category/dragon-ball-kai/" },
  { label: "Dragon Ball Clásico", href: "/category/dragon-ball/" },
  {
    label: "Películas y Especiales",
    href: "/dragon-ball-todas-las-peliculas-y-especiales/",
    children: [
      {
        label: "Dragon Ball Super Películas",
        href: "/dragon-ball-todas-las-peliculas-y-especiales/#super",
      },
      {
        label: "Dragon Ball Z Películas",
        href: "/dragon-ball-todas-las-peliculas-y-especiales/#z",
      },
      {
        label: "Dragon Ball Clásico Películas",
        href: "/dragon-ball-todas-las-peliculas-y-especiales/#db",
      },
    ],
  },
  { label: "Blog", href: "/blog/" },
];

export const utilityPages = [
  {
    path: "/blog/",
    title: "Blog",
    description: "Noticias, articulos y novedades del universo Dragon Ball.",
  },
  {
    path: "/sobre-nosotros/",
    title: "Sobre Nosotros",
    description: "Informacion sobre Dragon Ball HD Sin Limites y el proyecto de streaming.",
  },
  {
    path: "/politica-de-privacidad/",
    title: "Politica de Privacidad",
    description: "Politica de privacidad y proteccion de datos en Dragon Ball HD Sin Limites.",
  },
  {
    path: "/terminos-y-condiciones/",
    title: "Terminos y Condiciones",
    description: "Terminos y condiciones de uso del portal Dragon Ball HD Sin Limites.",
  },
  {
    path: "/aviso-legal/",
    title: "Aviso Legal",
    description: "Aviso legal y propiedad intelectual del portal.",
  },
  {
    path: "/contacto/",
    title: "Contacto",
    description: "Formulario de contacto de Dragon Ball HD Sin Limites.",
  },
];

export const legalPages = [
  {
    path: "/sobre-nosotros/",
    title: "Sobre Nosotros",
  },
  {
    path: "/politica-de-privacidad/",
    title: "Política de Privacidad",
  },
  {
    path: "/terminos-y-condiciones/",
    title: "Términos y Condiciones",
  },
  {
    path: "/aviso-legal/",
    title: "Aviso Legal",
  },
  {
    path: "/contacto/",
    title: "Contacto",
  },
];

export const categoryPages = [
  {
    path: "/category/dragon-ball-super-latino/",
    title: "Dragon Ball Super (Audio Latino)",
    seoTitle: "Ver Dragon Ball Super Online en Audio Latino HD - Capítulos Completos",
    shortTitle: "Dragon Ball Super",
    description: "Ver todos los capítulos de Dragon Ball Super en audio latino HD sin censura. Disfruta de la saga de Bills, Goku Black y el Torneo del Poder online.",
    filter: (capitulo) => capitulo.categoriaSlug === "dragon-ball-super-latino",
    saga: "super",
    editorial: {
      synopsis: "Dragon Ball Super es la continuación oficial de la legendaria obra de Akira Toriyama, situada cronológicamente tras la derrota de Majin Buu. La historia expande el universo conocido con la llegada de Bills, el temible Dios de la Destrucción, y su mentor Whis, abriendo las puertas a nuevas transformaciones como el Super Saiyajin Fase Dios y Super Saiyajin Blue. A lo largo de sus 131 episodios, los Guerreros Z enfrentan desafíos cósmicos en el Torneo del Universo 6, la desgarradora amenaza de Goku Black en el futuro alternativo de Trunks y el apoteósico Torneo de la Fuerza, donde Goku alcanza el estado de la Doctrina Egoísta (Ultra Instinto).",
      arcs: [
        { name: "Saga de la Batalla de los Dioses", episodes: "Episodios 1 - 14" },
        { name: "Saga de la Resurrección de Freezer", episodes: "Episodios 15 - 27" },
        { name: "Saga del Torneo del Universo 6", episodes: "Episodios 28 - 46" },
        { name: "Saga de Trunks del Futuro / Goku Black", episodes: "Episodios 47 - 76" },
        { name: "Saga de la Supervivencia Universal / Torneo del Poder", episodes: "Episodios 77 - 131" },
      ],
      cast: "Mario Castañeda (Goku), René García (Vegeta), Gerardo Reyero (Freezer), José Luis Orozco (Bills), Arturo Castañeda (Whis), Rocío Garcel (Bulma).",
    },
  },
  {
    path: "/category/dragon-ball-super-sub/",
    title: "Dragon Ball Super (Subtitulado)",
    seoTitle: "Ver Dragon Ball Super Subtitulado al Español HD - Capítulos Completos",
    shortTitle: "Dragon Ball Super Sub",
    description: "Disfruta de Dragon Ball Super subtitulado al español en calidad HD. Sigue todas las sagas con audio original japonés y subtítulos completos online.",
    filter: (capitulo) => capitulo.categoriaSlug === "dragon-ball-super-sub",
    saga: "super",
    editorial: {
      synopsis: "Revive la emisión original en japonés de Dragon Ball Super con subtítulos completos en español neutro en máxima resolución HD. Disfruta de las interpretaciones originales de los actores de voz japoneses (seiyū) encabezados por la legendaria Masako Nozawa en los roles de Son Goku, Son Gohan y Son Goten. Esta versión conserva los temas de apertura y cierre originales de Toei Animation, incluyendo 'Chōzetsu Dynamic!' y 'Limit-Break x Survivor', ofreciendo una experiencia inmersiva para los puristas del anime.",
      arcs: [
        { name: "Saga de la Batalla de los Dioses", episodes: "Episodios 1 - 14" },
        { name: "Saga de la Resurrección de 'F'", episodes: "Episodios 15 - 27" },
        { name: "Saga del Torneo de Champa", episodes: "Episodios 28 - 46" },
        { name: "Saga de Goku Black", episodes: "Episodios 47 - 76" },
        { name: "Saga del Torneo del Poder", episodes: "Episodios 77 - 131" },
      ],
      cast: "Masako Nozawa (Son Goku / Gohan / Goten), Ryō Horikawa (Vegeta), Ryūsei Nakao (Freezer), Kōichi Yamadera (Beerus), Masakazu Morita (Whis).",
    },
  },
  {
    path: "/category/dragon-ball-z/",
    title: "Dragon Ball Z",
    seoTitle: "Ver Dragon Ball Z Online en Audio Latino HD - Capítulos Completos",
    shortTitle: "Dragon Ball Z",
    description: "Ver todos los capítulos de Dragon Ball Z en audio latino HD online. Revive la Saga Saiyajin, Freezer, Cell y Majin Boo completos sin interrupciones.",
    filter: (capitulo) => capitulo.saga === "z",
    saga: "z",
    editorial: {
      synopsis: "Dragon Ball Z es la obra cumbre del anime shonen que marcó a múltiples generaciones a nivel mundial. Abarcando 291 episodios épicos, la serie narra la vida adulta de Goku al descubrir su origen alienígena como miembro de la raza Saiyajin (Kakarotto). La trama escala a través de cuatro grandes arcos narrativos: la invasión de Raditz, Nappa y Vegeta en la Tierra; la odisea galáctica en el Planeta Namekusei contra el tirano Freezer; la catástrofe de los Androides y los Juegos de Cell; y la batalla decisiva contra el demonio milenario Majin Boo.",
      arcs: [
        { name: "Saga de los Saiyajins", episodes: "Episodios 1 - 35" },
        { name: "Saga de Freezer y Namekusei", episodes: "Episodios 36 - 107" },
        { name: "Saga de Garlic Jr. (Relleno)", episodes: "Episodios 108 - 117" },
        { name: "Saga de los Androides y Cell", episodes: "Episodios 118 - 194" },
        { name: "Saga del Torneo del Otro Mundo", episodes: "Episodios 195 - 199" },
        { name: "Saga de Majin Boo", episodes: "Episodios 200 - 291" },
      ],
      cast: "Mario Castañeda (Goku), René García (Vegeta), Laura Torres (Gohan niño), Carlos Segundo (Piccolo), Gerardo Reyero (Freezer), Ricardo Brust (Cell), Patricia Acevedo (Milk).",
    },
  },
  {
    path: "/category/dragon-ball-gt/",
    title: "Dragon Ball GT",
    seoTitle: "Ver Dragon Ball GT Online en Audio Latino HD - Capítulos Completos",
    shortTitle: "Dragon Ball GT",
    description: "Ver todos los capítulos de Dragon Ball GT en audio latino HD online. Disfruta del Gran Viaje, Baby, Super 17 y los Dragones Malignos completos.",
    filter: (capitulo) => capitulo.saga === "gt",
    saga: "gt",
    editorial: {
      synopsis: "Dragon Ball GT es la primera secuela animada original de Toei Animation, emitida entre 1996 y 1997 con un total de 64 episodios. La aventura inicia cuando un deseo accidental con las Esferas del Dragón de Estrella Negra devuelve a Goku a su forma infantil. Junto a su nieta Pan y Trunks, emprenden un viaje intergaláctico a bordo de la nave Tako. La serie introduce conceptos memorables como la transformación del Super Saiyajin 4, el parásito tsufuru Baby, la rebelión de Super Androide 17 y la purificación de los siete Dragones Malignos mediante la Genki-dama universal.",
      arcs: [
        { name: "Saga del Gran Viaje en el Espacio", episodes: "Episodios 1 - 22" },
        { name: "Saga de Baby", episodes: "Episodios 23 - 40" },
        { name: "Saga de Super Androide 17", episodes: "Episodios 41 - 47" },
        { name: "Saga de los Dragones Malignos", episodes: "Episodios 48 - 64" },
      ],
      cast: "Laura Torres / Mario Castañeda (Goku), Circe Luna (Pan), Sergio Bonilla (Trunks), René García (Vegeta), Gerardo Reyero (Baby / Yi Xing Long).",
    },
  },
  {
    path: "/category/dragon-ball-kai/",
    title: "Dragon Ball Kai",
    seoTitle: "Ver Dragon Ball Kai Online en Audio Latino HD - Capítulos Completos",
    shortTitle: "Dragon Ball Kai",
    description: "Ver Dragon Ball Kai en audio latino HD online. Disfruta de la versión remasterizada en alta definición y sin relleno de toda la saga de Dragon Ball Z.",
    filter: (capitulo) => capitulo.saga === "kai",
    saga: "kai",
    editorial: {
      synopsis: "Dragon Ball Kai es la versión definitiva y remasterizada producida en conmemoración del 20º aniversario de Dragon Ball Z. Editada meticulosamente para seguir con fidelidad absoluta el ritmo del manga original de Akira Toriyama, elimina el material de relleno no canónico. Cuenta con remasterización digital fotograma a fotograma en alta definición (1080p), regrabación integral de las pistas de voz y efectos de sonido modernos, abarcando desde la llegada de Raditz hasta la derrota final de Majin Boo.",
      arcs: [
        { name: "Saga Saiyajin", episodes: "Episodios 1 - 18" },
        { name: "Saga de Freezer", episodes: "Episodios 19 - 54" },
        { name: "Saga de los Androides y Cell", episodes: "Episodios 55 - 98" },
        { name: "The Final Chapters (Saga de Majin Boo)", episodes: "Episodios 99 - 167" },
      ],
      cast: "Mario Castañeda / Edson Matus (Goku), René García (Vegeta), Carlos Segundo / Idzi Dutkiewicz (Piccolo), Gerardo Reyero / Dafnis Fernández (Freezer).",
    },
  },
  {
    path: "/category/dragon-ball/",
    title: "Dragon Ball",
    seoTitle: "Ver Dragon Ball Clásico Online en Audio Latino HD - Capítulos Completos",
    shortTitle: "Dragon Ball Clásico",
    description: "Ver Dragon Ball clásico online en audio latino HD. Revive las aventuras de Goku niño, el Maestro Roshi, Krilin y los Torneos de Artes Marciales.",
    filter: (capitulo) => capitulo.saga === "db",
    saga: "db",
    editorial: {
      synopsis: "Dragon Ball es la serie original donde comenzó el mito que revolucionó el anime internacional. Basada en los primeros tomos del manga de Akira Toriyama e inspirada libremente en la novela clásica Peregrinación al Oeste, relata el primer encuentro entre el pequeño Goku y la brillante Bulma en busca de las siete Esferas del Dragón. Con 153 episodios, combina comedia pícara, artes marciales y aventura, presentando el entrenamiento con el Maestro Roshi, los legendarios Torneos de Artes Marciales (Tenkaichi Budokai), la guerra contra la Patrulla Roja y el sangriento ascenso de Piccolo Daimaku.",
      arcs: [
        { name: "Saga de la Búsqueda de las Esferas del Dragón", episodes: "Episodios 1 - 13" },
        { name: "21º Torneo de las Artes Marciales", episodes: "Episodios 14 - 28" },
        { name: "Saga del Ejército de la Patrulla Roja", episodes: "Episodios 29 - 68" },
        { name: "22º Torneo de las Artes Marciales", episodes: "Episodios 69 - 83" },
        { name: "Saga del Rey Piccolo Daimaku", episodes: "Episodios 84 - 122" },
        { name: "23º Torneo de las Artes Marciales (Goku vs Piccolo)", episodes: "Episodios 123 - 153" },
      ],
      cast: "Laura Torres (Goku niño), Rocío Garcel (Bulma), Rossy Aguirre (Krilin), Jesús Colín (Maestro Roshi), Carlos Segundo (Piccolo Daimaku / Kami-sama).",
    },
  },
  {
    path: "/dragon-ball-todas-las-peliculas-y-especiales/",
    title: "Dragon Ball Películas y Especiales",
    seoTitle: "Ver Películas y Especiales de Dragon Ball en Audio Latino HD",
    shortTitle: "Películas y Especiales",
    description: "Ver todas las películas, OVAs y especiales de Dragon Ball, DBZ y Super online en audio latino y calidad HD completa en Dragon Ball HD Sin Límites.",
    filter: (capitulo) => capitulo.saga === "peliculas" || /pelicula|especial/i.test(capitulo.titulo),
    saga: "peliculas",
    editorial: {
      synopsis: "Catálogo cinematográfico completo con todas las películas, OVAs y especiales de televisión de Dragon Ball, Dragon Ball Z y Dragon Ball Super en español latino. Disfruta de producciones icónicas como 'La Batalla de los Dioses', 'La Resurrección de Freezer', 'Dragon Ball Super: Broly', los clásicos cinematográficos de los 90 ('La Fusión de Goku y Vegeta', 'El Poder Invencible', 'Los Guerreros de Plata', 'El Ataque del Dragón') y los especiales de culto como 'La Batalla de Freezer Contra el Padre de Goku' (Bardock) y 'Los Dos Guerreros del Futuro' (Gohan y Trunks).",
      arcs: [
        { name: "Películas Clásicas de Dragon Ball", episodes: "4 Largometrajes" },
        { name: "Películas de Dragon Ball Z", episodes: "15 Películas y Especiales" },
        { name: "Películas Modernas de Dragon Ball Super", episodes: "Broly y Super Hero" },
        { name: "Especiales de TV y OVAs", episodes: "Bardock, Trunks del Futuro y Goku Jr." },
      ],
      cast: "Mario Castañeda (Goku), René García (Vegeta), Gerardo Reyero (Freezer / Cooler), Ricardo Brust (Broly), Laura Torres (Gohan / Bardock).",
    },
  },
];

export const categoryAliases = [
  // Dragon Ball Super Latino & Heroes Aliases
  { path: "/dragon-ball-super-latino/", canonicalPath: "/category/dragon-ball-super-latino/" },
  { path: "/dragon-ball-heroes/", canonicalPath: "/category/dragon-ball-super-latino/" },

  // Dragon Ball Super Sub Aliases
  { path: "/dragon-ball-super-sub/", canonicalPath: "/category/dragon-ball-super-sub/" },

  // Dragon Ball GT Aliases & Sagas
  { path: "/dragon-ball-gt-capitulos-completos-latinos-online/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/dragon-ball-gt-saga-el-gran-viaje/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/dragon-ball-gt-saga-el-gran-viaje/page/2/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/dragon-ball-gt-saga-de-super-androide-17/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/dragon-ball-gt-saga-de-baby/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/dragon-ball-gt-saga-de-los-dragones-malignos/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/category/dragon-ball-gt/dragon-ball-gt-saga-de-baby/", canonicalPath: "/category/dragon-ball-gt/" },
  { path: "/category/dragon-ball-gt/dragon-ball-gt-saga-de-super-androide-17/", canonicalPath: "/category/dragon-ball-gt/" },

  // Dragon Ball Z Aliases, Sagas & Pagination
  { path: "/dragon-ball-z-capitulos-online-espanol-latino/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/dragonballz-capitulos-online-espanol-latino/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/dragon-ball-z-capitulos-online-espanol-latino/page/14/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/dragon-ball-z-capitulos-online-espanol-latino/page/15/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/category/dragon-ball-z/page/2/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/category/dragon-ball-z/page/4/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/saga-saiyayin/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/saga-garlick-jr/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/saga-freezer/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/saga-de-cell/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/saga-de-majin-boo/", canonicalPath: "/category/dragon-ball-z/" },
  { path: "/saga-de-majin-boo/page/4/", canonicalPath: "/category/dragon-ball-z/" },

  // Dragon Ball Kai Aliases
  { path: "/db-kai/", canonicalPath: "/category/dragon-ball-kai/" },

  // Dragon Ball Clásico Aliases & Tournaments
  { path: "/21-torneo-de-las-artes-marciales-dragon-ball/", canonicalPath: "/category/dragon-ball/" },
  { path: "/category/dragon-ball/21-torneo-de-las-artes-marciales/", canonicalPath: "/category/dragon-ball/" },
  { path: "/category/dragon-ball/22-torneo-de-las-artes-marciales/", canonicalPath: "/category/dragon-ball/" },
  { path: "/category/dragon-ball/23o-torneo-de-las-artes-marciales/", canonicalPath: "/category/dragon-ball/" },
  { path: "/category/dragon-ball/saga-de-piccolo-daimaku/", canonicalPath: "/category/dragon-ball/" },

  // Dragon Ball Películas Aliases
  { path: "/category/dragon-ball-todas-las-peliculas/", canonicalPath: "/dragon-ball-todas-las-peliculas-y-especiales/" },
  { path: "/category/dragon-ball-todas-las-peliculas/dragon-ball-super-peliculas/", canonicalPath: "/dragon-ball-todas-las-peliculas-y-especiales/" },
  { path: "/category/dragon-ball-todas-las-peliculas/dragon-ball-z-peliculas/", canonicalPath: "/dragon-ball-todas-las-peliculas-y-especiales/" },
  { path: "/category/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/", canonicalPath: "/dragon-ball-todas-las-peliculas-y-especiales/" },
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
  if (!capitulo || !capitulo.slug) return "/";
  return `/capitulo/${capitulo.slug}/`;
}

export function getCategoryHref(categoriaSlug) {
  if (categoriaSlug === "dragon-ball-todas-las-peliculas" || categoriaSlug === "peliculas") {
    return "/dragon-ball-todas-las-peliculas-y-especiales/";
  }
  return `/category/${categoriaSlug}/`;
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
  const primary = categoryPages.find((category) => comparePath(category.path) === target);
  if (primary) return primary;

  const alias = categoryAliases.find((item) => comparePath(item.path) === target);
  if (alias) {
    const parent = categoryPages.find((c) => comparePath(c.path) === comparePath(alias.canonicalPath));
    if (parent) {
      return {
        ...parent,
        path: alias.path,
        canonical: alias.canonicalPath,
        canonicalPath: alias.canonicalPath,
        isAlias: true,
      };
    }
  }
  return undefined;
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

export function cleanText(str) {
  return String(str || "").replace(/[\u00a0\s]+/g, " ").trim();
}

export function cleanSynopsis(desc) {
  if (!desc) return "";
  return desc
    .replace(/\s*Episodio\s+\d+\s+de\s+[^.]+disponible online[^.]*\./gi, "")
    .replace(/\s*Capitulo\s+\d+\s+de\s+[^.]+disponible online[^.]*\./gi, "")
    .replace(/[\u00a0\s]+/g, " ")
    .trim();
}

export function getEpisodeTitle(capitulo) {
  if (!capitulo) return "Dragon Ball HD Sin Límites";
  const raw = cleanText(capitulo.seoTitle || capitulo.titulo);
  if (raw.length <= 60) return raw;
  const cut = raw.slice(0, 57).replace(/\s+\S*$/, "");
  return `${cut}...`;
}

export function getEpisodeDescription(capitulo) {
  if (!capitulo) return "";
  if (capitulo.seoDescription) {
    const clean = cleanText(capitulo.seoDescription);
    if (clean.length >= 120 && clean.length <= 160) return clean;
  }
  const synopsis = cleanSynopsis(capitulo.descripcion);
  if (synopsis && synopsis.length >= 130 && synopsis.length <= 160) return synopsis;
  if (synopsis && synopsis.length > 160) {
    const match = synopsis.slice(0, 155).match(/^(.*[.!?¡¿])\s+/);
    if (match && match[1].length >= 110) return match[1];
    return synopsis.slice(0, 150).replace(/\s+\S*$/, "") + "...";
  }
  const cat = capitulo.categoria || "Dragon Ball";
  const num = capitulo.numero && capitulo.numero !== 9999 ? ` ${capitulo.numero}` : "";
  const audio = capitulo.categoriaSlug === "dragon-ball-super-sub" ? "subtitulado al español" : "en español latino";
  const fallback = `Ver ${capitulo.titulo} online ${audio} en calidad HD. Disfruta del episodio${num} de ${cat} completo en Dragon Ball HD Sin Límites.`;
  if (fallback.length > 155) return fallback.slice(0, 152).replace(/\s+\S*$/, "") + "...";
  return fallback;
}

export function getCategoryTitle(category) {
  if (!category) return "Categoría | Dragon Ball HD Sin Límites";
  return category.seoTitle || category.title;
}

export function getCategoryDescription(category) {
  if (!category) return "";
  return category.description || "";
}

export function getRelatedEpisodes(capitulo, allCapitulos, count = 6) {
  const sagaCapitulos = allCapitulos.filter((item) => item.saga === capitulo.saga);
  if (sagaCapitulos.length <= 1) return [];
  if (sagaCapitulos.length <= count + 1) {
    return sagaCapitulos.filter((item) => item.slug !== capitulo.slug);
  }

  const sagaIndex = sagaCapitulos.findIndex((item) => item.slug === capitulo.slug);
  const half = Math.floor(count / 2);
  const related = [];

  for (let i = -half; i <= half; i += 1) {
    if (i !== 0) {
      const idx = (sagaIndex + i + sagaCapitulos.length) % sagaCapitulos.length;
      related.push(sagaCapitulos[idx]);
    }
  }
  return related;
}

/**
 * Schema.org Generators for VideoObject, TVEpisode, TVSeries, Breadcrumbs, and Site Entities
 */

export function getEpisodeThumbnailUrl(capitulo) {
  if (!capitulo) return `${siteUrl}/og-image.webp`;
  if (capitulo.imagen) {
    if (capitulo.imagen.startsWith("http://") || capitulo.imagen.startsWith("https://")) {
      return capitulo.imagen;
    }
    const cleanPath = capitulo.imagen.startsWith("/") ? capitulo.imagen : `/${capitulo.imagen}`;
    return `${siteUrl}${cleanPath}`;
  }
  return `${siteUrl}/og-image.webp`;
}

export function getEpisodeUploadDate(capitulo) {
  if (!capitulo) return "2024-01-01T00:00:00+00:00";
  const match = (capitulo.imagen || "").match(/\/uploads\/(\d{4})\/(\d{2})\//);
  if (match) {
    const [, year, month] = match;
    return `${year}-${month}-01T00:00:00+00:00`;
  }
  return "2024-01-01T00:00:00+00:00";
}

export function getEpisodeDuration(capitulo) {
  if (!capitulo) return "PT24M";
  if (
    capitulo.saga === "peliculas" ||
    capitulo.categoriaSlug === "dragon-ball-todas-las-peliculas" ||
    /pelicula|largometraje/i.test(capitulo.titulo)
  ) {
    return "PT1H30M";
  }
  if (/especial|ova/i.test(capitulo.titulo)) {
    return "PT45M";
  }
  return "PT24M";
}

export function getEpisodeEmbedUrl(capitulo) {
  if (!capitulo) return `${siteUrl}/`;
  if (capitulo.iframe) {
    const match = capitulo.iframe.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      let url = match[1].trim();
      if (url.startsWith("//")) url = `https:${url}`;
      return url;
    }
  }
  if (Array.isArray(capitulo.players) && capitulo.players.length > 0) {
    for (const player of capitulo.players) {
      if (player && player.embed) {
        const match = player.embed.match(/src=["']([^"']+)["']/i);
        if (match && match[1]) {
          let url = match[1].trim();
          if (url.startsWith("//")) url = `https:${url}`;
          return url;
        }
      }
    }
  }
  return `${siteUrl}/capitulo/${capitulo.slug}/`;
}

export function getSeriesName(capitulo) {
  if (!capitulo) return "Dragon Ball";
  if (capitulo.categoriaSlug === "dragon-ball-super-latino") return "Dragon Ball Super (Audio Latino)";
  if (capitulo.categoriaSlug === "dragon-ball-super-sub") return "Dragon Ball Super (Subtitulado)";
  if (capitulo.categoriaSlug === "dragon-ball-z") return "Dragon Ball Z";
  if (capitulo.categoriaSlug === "dragon-ball-gt") return "Dragon Ball GT";
  if (capitulo.categoriaSlug === "dragon-ball-kai") return "Dragon Ball Kai";
  if (capitulo.categoriaSlug === "dragon-ball") return "Dragon Ball";
  if (capitulo.categoriaSlug === "dragon-ball-todas-las-peliculas" || capitulo.saga === "peliculas") {
    return "Dragon Ball Películas y Especiales";
  }
  return capitulo.categoria || "Dragon Ball";
}

export function getEpisodeSeason(capitulo) {
  if (!capitulo) return null;
  const num = capitulo.numero;

  if (capitulo.saga === "z") {
    if (num && num <= 35) return { "@type": "TVSeason", seasonNumber: 1, name: "Saga de los Saiyajins" };
    if (num && num <= 107) return { "@type": "TVSeason", seasonNumber: 2, name: "Saga de Freezer" };
    if (num && num <= 194) return { "@type": "TVSeason", seasonNumber: 3, name: "Saga de los Androides y Cell" };
    if (num && num <= 291) return { "@type": "TVSeason", seasonNumber: 4, name: "Saga de Majin Boo" };
    return { "@type": "TVSeason", name: "Dragon Ball Z" };
  }

  if (capitulo.saga === "super") {
    if (num && num <= 14) return { "@type": "TVSeason", seasonNumber: 1, name: "Saga de la Batalla de los Dioses" };
    if (num && num <= 27) return { "@type": "TVSeason", seasonNumber: 2, name: "Saga de la Resurrección de Freezer" };
    if (num && num <= 46) return { "@type": "TVSeason", seasonNumber: 3, name: "Saga del Torneo del Universo 6" };
    if (num && num <= 76) return { "@type": "TVSeason", seasonNumber: 4, name: "Saga de Trunks del Futuro / Goku Black" };
    if (num && num <= 131) return { "@type": "TVSeason", seasonNumber: 5, name: "Saga del Torneo del Poder" };
    return { "@type": "TVSeason", name: "Dragon Ball Super" };
  }

  if (capitulo.saga === "gt") {
    if (num && num <= 22) return { "@type": "TVSeason", seasonNumber: 1, name: "Saga del Gran Viaje en el Espacio" };
    if (num && num <= 40) return { "@type": "TVSeason", seasonNumber: 2, name: "Saga de Baby" };
    if (num && num <= 47) return { "@type": "TVSeason", seasonNumber: 3, name: "Saga de Super Androide 17" };
    if (num && num <= 64) return { "@type": "TVSeason", seasonNumber: 4, name: "Saga de los Dragones Malignos" };
    return { "@type": "TVSeason", name: "Dragon Ball GT" };
  }

  if (capitulo.saga === "kai") {
    if (num && num <= 18) return { "@type": "TVSeason", seasonNumber: 1, name: "Saga Saiyajin" };
    if (num && num <= 54) return { "@type": "TVSeason", seasonNumber: 2, name: "Saga de Freezer" };
    if (num && num <= 98) return { "@type": "TVSeason", seasonNumber: 3, name: "Saga de los Androides y Cell" };
    if (num && num <= 167) return { "@type": "TVSeason", seasonNumber: 4, name: "The Final Chapters (Saga de Majin Boo)" };
    return { "@type": "TVSeason", name: "Dragon Ball Kai" };
  }

  if (capitulo.saga === "db") {
    if (num && num <= 13) return { "@type": "TVSeason", seasonNumber: 1, name: "Saga de la Búsqueda de las Esferas del Dragón" };
    if (num && num <= 28) return { "@type": "TVSeason", seasonNumber: 2, name: "21º Torneo de las Artes Marciales" };
    if (num && num <= 68) return { "@type": "TVSeason", seasonNumber: 3, name: "Saga del Ejército de la Patrulla Roja" };
    if (num && num <= 83) return { "@type": "TVSeason", seasonNumber: 4, name: "22º Torneo de las Artes Marciales" };
    if (num && num <= 122) return { "@type": "TVSeason", seasonNumber: 5, name: "Saga del Rey Piccolo Daimaku" };
    if (num && num <= 153) return { "@type": "TVSeason", seasonNumber: 6, name: "23º Torneo de las Artes Marciales" };
    return { "@type": "TVSeason", name: "Dragon Ball Clásico" };
  }

  return null;
}

export function getEpisodeVideoSchema(capitulo) {
  if (!capitulo) return null;
  const canonicalPath = episodeHref(capitulo);
  const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;
  const thumbnail = getEpisodeThumbnailUrl(capitulo);
  const description = getEpisodeDescription(capitulo);
  const uploadDate = getEpisodeUploadDate(capitulo);
  const duration = getEpisodeDuration(capitulo);
  const embedUrl = getEpisodeEmbedUrl(capitulo);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${fullCanonicalUrl}#video`,
    name: capitulo.titulo,
    description: description,
    thumbnailUrl: [thumbnail],
    uploadDate: uploadDate,
    duration: duration,
    embedUrl: embedUrl,
    inLanguage: "es",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: capitulo.id ? 1000 + (parseInt(capitulo.id, 10) % 9000) * 12 : 5420,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: fullCanonicalUrl,
    },
  };
}

export function getEpisodeTVSchema(capitulo) {
  if (!capitulo) return null;
  const canonicalPath = episodeHref(capitulo);
  const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;
  const thumbnail = getEpisodeThumbnailUrl(capitulo);
  const description = getEpisodeDescription(capitulo);
  const uploadDate = getEpisodeUploadDate(capitulo);
  const videoObject = getEpisodeVideoSchema(capitulo);

  const isMovie = capitulo.saga === "peliculas" || capitulo.categoriaSlug === "dragon-ball-todas-las-peliculas";

  if (isMovie) {
    return {
      "@context": "https://schema.org",
      "@type": "Movie",
      "@id": `${fullCanonicalUrl}#movie`,
      name: capitulo.titulo,
      description: description,
      url: fullCanonicalUrl,
      image: [thumbnail],
      datePublished: uploadDate,
      duration: getEpisodeDuration(capitulo),
      inLanguage: "es",
      potentialAction: {
        "@type": "WatchAction",
        target: fullCanonicalUrl,
      },
      video: videoObject,
    };
  }

  const seriesHref = getCategoryHref(capitulo.categoriaSlug);
  const seriesUrl = `${siteUrl}${seriesHref}`;
  const seriesName = getSeriesName(capitulo);
  const season = getEpisodeSeason(capitulo);

  const tvEpisode = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    "@id": `${fullCanonicalUrl}#episode`,
    name: capitulo.titulo,
    description: description,
    url: fullCanonicalUrl,
    image: [thumbnail],
    datePublished: uploadDate,
    inLanguage: "es",
    partOfSeries: {
      "@type": "TVSeries",
      "@id": `${seriesUrl}#series`,
      name: seriesName,
      url: seriesUrl,
      inLanguage: "es",
    },
    potentialAction: {
      "@type": "WatchAction",
      target: fullCanonicalUrl,
    },
    video: videoObject,
  };

  if (capitulo.numero && capitulo.numero !== 9999) {
    tvEpisode.episodeNumber = capitulo.numero;
  }

  if (season) {
    tvEpisode.partOfSeason = season;
  }

  return tvEpisode;
}

export function getEpisodeBreadcrumbSchema(capitulo) {
  if (!capitulo || !capitulo.slug) return null;
  const categoryHref = getCategoryHref(capitulo.categoriaSlug);
  const categoryName = capitulo.categoria || "Dragon Ball";
  const episodeUrl = `${siteUrl}${episodeHref(capitulo)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${siteUrl}${categoryHref}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: capitulo.titulo,
        item: episodeUrl,
      },
    ],
  };
}

export function getCategoryBreadcrumbSchema(category) {
  if (!category) return null;
  const canonicalPath = category.canonical || category.canonicalPath || category.path;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const name = category.shortTitle || category.title;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categorías",
        item: `${siteUrl}/#sagas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: name,
        item: canonicalUrl,
      },
    ],
  };
}

export function getUtilityBreadcrumbSchema(page) {
  if (!page) return null;
  const canonicalPath = page.canonical || page.canonicalPath || page.path;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: canonicalUrl,
      },
    ],
  };
}

export function getCollectionPageSchema(category, categoryCapitulos = []) {
  if (!category) return null;
  const canonicalPath = category.canonical || category.canonicalPath || category.path;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const title = getCategoryTitle(category);
  const description = getCategoryDescription(category);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: title,
    description: description,
    inLanguage: "es",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Dragon Ball HD Sin Limites",
      url: `${siteUrl}/`,
    },
    about: {
      "@type": "TVSeries",
      name: category.shortTitle || category.title,
      inLanguage: "es",
    },
    mainEntity: {
      "@type": "ItemList",
      name: `Lista de capítulos de ${category.shortTitle || category.title}`,
      numberOfItems: categoryCapitulos.length,
      itemListElement: categoryCapitulos.map((capitulo, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: capitulo.titulo,
        url: `${siteUrl}${episodeHref(capitulo)}`,
      })),
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Dragon Ball HD Sin Limites",
    alternateName: [
      "Dragon Ball HD Sin Límites",
      "Dragon Ball Online Latino",
      "Dragon Ball HD",
      "Ver Dragon Ball Online",
    ],
    description:
      "Ver todos los capítulos de Dragon Ball, Dragon Ball Z, Dragon Ball Super, GT, Kai y películas completas online en audio latino y calidad HD en Dragon Ball HD Sin Límites.",
    inLanguage: "es",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/buscar/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Dragon Ball HD Sin Limites",
    alternateName: "Dragon Ball HD Sin Límites",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteUrl}/#logo`,
      url: `${siteUrl}/og-image.webp`,
      contentUrl: `${siteUrl}/og-image.webp`,
      caption: "Dragon Ball HD Sin Límites",
      width: 1200,
      height: 630,
    },
    image: `${siteUrl}/og-image.webp`,
    description:
      "Plataforma de streaming dedicada a la difusión y preservación de todas las series, sagas y películas del universo Dragon Ball en español latino y calidad HD.",
    sameAs: [
      "https://twitter.com/dbhdsinlimites",
      "https://www.facebook.com/dbhdsinlimites",
      "https://www.youtube.com/@dragonballhdsinlimites",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contacto/`,
      availableLanguage: ["Spanish"],
    },
  };
}

export function generateHomeFeaturedItemListSchema(featuredEpisodes = []) {
  const items = (featuredEpisodes || []).slice(0, 10).map((capitulo, index) => {
    const rawImage = capitulo.imagen || "/og-image.webp";
    const imageUrl = rawImage.startsWith("http") ? rawImage : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
    const epUrl = `${siteUrl}/capitulo/${capitulo.slug}/`;

    return {
      "@type": "ListItem",
      position: index + 1,
      name: capitulo.titulo || `Capítulo ${capitulo.numero || index + 1}`,
      url: epUrl,
      image: imageUrl,
      item: {
        "@type": "TVEpisode",
        "@id": `${epUrl}#episode`,
        name: capitulo.titulo,
        url: epUrl,
        image: imageUrl,
        ...(capitulo.numero && capitulo.numero !== 9999 ? { episodeNumber: capitulo.numero } : {}),
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#featured-episodes`,
    name: "Episodios Destacados de Dragon Ball",
    description:
      "Últimos capítulos y episodios destacados de Dragon Ball disponibles online en audio latino HD.",
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export function generateHomeSagasItemListSchema(sections = []) {
  const items = (sections || []).map((section, index) => {
    const rawCover = section.cover || "/og-image.webp";
    const coverUrl = rawCover.startsWith("http") ? rawCover : `${siteUrl}${rawCover.startsWith("/") ? "" : "/"}${rawCover}`;
    const secUrl = `${siteUrl}${section.href}`;

    return {
      "@type": "ListItem",
      position: index + 1,
      name: section.title,
      url: secUrl,
      image: coverUrl,
      item: {
        "@type": "CollectionPage",
        "@id": `${secUrl}#collection`,
        name: section.title,
        url: secUrl,
        description: `Ver todos los capítulos de ${section.title} online en audio latino HD.`,
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#sagas-list`,
    name: "Sagas y Categorías de Dragon Ball Online",
    description:
      "Todas las sagas completas de Dragon Ball: DB, DBZ, GT, Super, Kai y Películas en audio latino HD.",
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export function getEpisodeJsonLd(capitulo, extraSchemas = []) {
  if (!capitulo) return null;
  const tvSchema = getEpisodeTVSchema(capitulo);
  const videoSchema = getEpisodeVideoSchema(capitulo);

  const graph = [
    tvSchema,
    videoSchema,
    ...(Array.isArray(extraSchemas) ? extraSchemas : [extraSchemas]),
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

