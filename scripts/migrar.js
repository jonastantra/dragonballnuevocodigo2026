const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DEFAULT_OUTPUT = path.join(ROOT, "data", "capitulos.json");
const LEGACY_INPUT = path.join(ROOT, "data", "legacy-permalinks.csv");
const KNOWN_LEGACY_PAGES_INPUT = path.join(ROOT, "data", "known-legacy-pages.json");
const WP_UPLOADS_DIR = findWpUploadsDir();
const PUBLIC_UPLOADS_DIR = path.join(ROOT, "public", "uploads");

function findWpUploadsDir() {
  const nested = path.join(ROOT, "uploads", "uploads");
  if (fs.existsSync(nested)) return nested;
  return path.join(ROOT, "uploads");
}

function normalizeKey(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => String(item).trim()));
}

function uniqueHeaders(headers) {
  const seen = new Map();
  return headers.map((header) => {
    const base = normalizeKey(header) || "columna";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}${count + 1}`;
  });
}

function rowToObject(headers, values) {
  return headers.reduce((record, header, index) => {
    record[header] = values[index] ? String(values[index]).trim() : "";
    return record;
  }, {});
}

function readCsvObjects(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  if (rows.length < 2) return [];
  const headers = uniqueHeaders(rows[0]);
  return rows.slice(1).map((row) => rowToObject(headers, row));
}

function pick(record, keys) {
  for (const key of keys.map(normalizeKey)) {
    if (record[key]) return record[key];
  }
  return "";
}

function collectValues(record, keys) {
  const bases = new Set(keys.map(normalizeKey));
  return Object.entries(record)
    .filter(([key, value]) => value && [...bases].some((base) => key === base || key.startsWith(`${base}`)))
    .map(([, value]) => value);
}

function firstMatchingValue(record, matcher) {
  for (const [key, value] of Object.entries(record)) {
    if (value && matcher(key, value)) return value;
  }
  return "";
}

function decodeWpGarbage(value) {
  return String(value || "")
    .replace(/\uFEFF/g, "")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#034;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value) {
  return decodeWpGarbage(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanDescription(value, titulo) {
  const text = stripHtml(value);
  if (text && text.length > 20) return text;
  return `Disfruta ${titulo} online en Dragon Ball HD Sin Limites con reproductor responsivo y opciones alternativas de visualizacion.`;
}

function extractLinks(html) {
  const links = [];
  const source = decodeWpGarbage(html);
  const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = pattern.exec(source))) {
    const url = match[1].trim();
    const label = stripHtml(match[2]) || `Opcion ${links.length + 1}`;
    if (!/^https?:\/\//i.test(url)) continue;
    if (/wp-admin|wp-login|feed|xmlrpc/i.test(url)) continue;
    links.push({ label, url });
  }

  const seen = new Set();
  return links.filter((link) => {
    const key = link.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractEmbedUrl(html) {
  const href = html.match(/href=["']([^"']+)["']/i);
  if (href && /\/embed\/|mega\.nz\/embed|sendvid\.com\/embed/i.test(href[1])) {
    return href[1];
  }

  const url = html.match(/https?:\/\/[^\s"'<>]+/i);
  if (!url) return "";

  const value = url[0];
  if (/waaw\.to\/f\//i.test(value)) return value.replace("/f/", "/embed/");
  return value;
}

function extractHrefEmbeds(html) {
  const links = [];
  const source = decodeWpGarbage(html);
  const pattern = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = pattern.exec(source))) {
    links.push(match[1]);
  }

  return links
    .map((url) => {
      if (/waaw\.to\/f\//i.test(url)) return url.replace("/f/", "/embed/");
      if (/pokemonlaserielatino\.xyz\/f\//i.test(url)) return url.replace("/f/", "/embed/");
      return url;
    })
    .filter((url) => /\/embed\/|mega\.nz\/embed|sendvid\.com\/embed|ok\.ru\/videoembed/i.test(url))
    .map((url) => `<iframe src="${url}" allowfullscreen></iframe>`);
}

function ensureAttribute(markup, tagName, attribute, value) {
  const pattern = new RegExp(`\\s${attribute}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?`, "i");
  if (pattern.test(markup)) return markup;
  return markup.replace(new RegExp(`<${tagName}\\b`, "i"), `<${tagName} ${attribute}="${value}"`);
}

function cleanEmbed(value) {
  let html = decodeWpGarbage(value);
  if (!html) return "";

  const iframeMatch = html.match(/<iframe\b[\s\S]*?<\/iframe>/i);
  const videoMatch = html.match(/<video\b[\s\S]*?<\/video>/i);

  if (iframeMatch) {
    html = iframeMatch[0];
    html = html.replace(/src=(["'])(.*?)\1\s+(width|height)=/i, "src=$1$2$1 $3=");
    html = html.replace(/src=(["'])([^"']*?)\s+(width|height)=\1?[^"'\s>]*/i, "src=$1$2$1 $3=\"\"");
  } else {
    if (videoMatch) {
      html = videoMatch[0];
    } else {
      const embedUrl = extractEmbedUrl(html);
      if (!embedUrl) return "";
      html = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
    }
  }

  html = html
    .replace(/\s(width|height)=(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\sstyle=(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\sframeborder=(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\son[a-z]+=(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s?>/g, ">")
    .trim();

  html = html.replace(/src=(["'])\/\//i, "src=$1https://");

  if (/^<video\b/i.test(html)) {
    html = ensureAttribute(html, "video", "controls", "");
    html = ensureAttribute(html, "video", "preload", "metadata");
    html = ensureAttribute(html, "video", "playsinline", "");
    return html
      .replace(/\scontrols=""/i, " controls")
      .replace(/\splaysinline=""/i, " playsinline");
  }

  html = ensureAttribute(html, "iframe", "loading", "lazy");
  html = ensureAttribute(html, "iframe", "allowfullscreen", "");
  html = ensureAttribute(
    html,
    "iframe",
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  );
  html = ensureAttribute(html, "iframe", "referrerpolicy", "strict-origin-when-cross-origin");

  return html.replace(/\sallowfullscreen=""/i, " allowfullscreen");
}

function embedKey(markup) {
  const src = String(markup || "").match(/\s(?:src|href)=["']([^"']+)["']/i);
  if (src) return src[1].replace(/^\/\//, "https://").trim().toLowerCase();
  return String(markup || "").trim().toLowerCase();
}

function collectPlayers(record) {
  const rawCandidates = [
    pick(record, ["player1"]),
    pick(record, ["player2"]),
    pick(record, ["player3"]),
    pick(record, ["videplayer1"]),
    pick(record, ["video_player", "videoplayer"]),
    pick(record, ["players11"]),
  ];

  const players = [];
  const seen = new Set();

  for (const raw of rawCandidates) {
    const clean = cleanEmbed(raw);
    const key = embedKey(clean);
    if (clean && !seen.has(key)) {
      seen.add(key);
      players.push({
        label: `Opcion ${players.length + 1}`,
        embed: clean,
      });
    }
  }

  for (const raw of collectValues(record, ["linkurl"])) {
    for (const candidate of extractHrefEmbeds(raw)) {
      const clean = cleanEmbed(candidate);
      const key = embedKey(clean);
      if (clean && !seen.has(key)) {
        seen.add(key);
        players.push({
          label: `Opcion ${players.length + 1}`,
          embed: clean,
        });
      }
    }
  }

  return players;
}

function toWpUploadRelative(url) {
  const decoded = decodeWpGarbage(url);
  const match = decoded.match(/\/wp-content\/uploads\/([^"'|<>\s]+)/i);
  if (!match) return "";
  return match[1].replace(/\\/g, "/").replace(/^\/+/, "");
}

function isImagePath(value) {
  return /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(String(value || ""));
}

function copyLocalUpload(relativePath) {
  if (!relativePath || !isImagePath(relativePath)) return "";

  const cleanRelative = relativePath.split("?")[0].replace(/^\/+/, "");
  const source = path.resolve(WP_UPLOADS_DIR, cleanRelative);
  const target = path.resolve(PUBLIC_UPLOADS_DIR, cleanRelative);
  const uploadsRoot = path.resolve(WP_UPLOADS_DIR);
  const publicRoot = path.resolve(PUBLIC_UPLOADS_DIR);

  if (!source.startsWith(uploadsRoot) || !target.startsWith(publicRoot)) return "";

  if (fs.existsSync(target)) {
    return `/uploads/${cleanRelative.replace(/\\/g, "/")}`;
  }

  if (!fs.existsSync(source)) return "";

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return `/uploads/${cleanRelative.replace(/\\/g, "/")}`;
}

function resolveImage(value) {
  const candidates = String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const local = copyLocalUpload(toWpUploadRelative(candidate));
    if (local) return local;
  }

  for (const candidate of candidates) {
    const url = decodeWpGarbage(candidate);
    if (/^https?:\/\//i.test(url) && isImagePath(url)) return url;
  }

  return "";
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pathFromUrl(value) {
  const raw = decodeWpGarbage(value);
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    return normalizePath(parsed.pathname);
  } catch (_error) {
    return normalizePath(raw);
  }
}

function normalizePath(value) {
  const pathName = String(value || "").split("?")[0].split("#")[0].trim();
  if (!pathName || pathName === "/") return "";
  return `/${pathName.replace(/^\/+|\/+$/g, "")}/`;
}

function addUniquePath(list, value) {
  const normalized = normalizePath(value);
  if (normalized && !list.includes(normalized)) list.push(normalized);
}

function inferCategory(titulo, legacyCategory = "") {
  const source = `${legacyCategory} ${titulo}`.toLowerCase();

  if (/dragon ball super.*sub|super sub|\bdbs sub\b/.test(source)) {
    return { categoria: "Dragon Ball Super Sub", categoriaSlug: "dragon-ball-super-sub", saga: "super" };
  }
  if (/dragon ball super|dbs/.test(source)) {
    return { categoria: "Dragon Ball Super", categoriaSlug: "dragon-ball-super-latino", saga: "super" };
  }
  if (/dragon ball gt|\bdb gt\b/.test(source)) {
    return { categoria: "Dragon Ball GT", categoriaSlug: "dragon-ball-gt", saga: "gt" };
  }
  if (/dragon ball kai|\bdb kai\b/.test(source)) {
    return { categoria: "Dragon Ball Kai", categoriaSlug: "dragon-ball-kai", saga: "kai" };
  }
  if (/pelicula|pelicula|películas|peliculas|especial/.test(source)) {
    return {
      categoria: "Dragon Ball Peliculas",
      categoriaSlug: "dragon-ball-todas-las-peliculas",
      saga: "peliculas",
    };
  }
  if (/dragon ball z|\bdb z\b|^\s*\d+\s*-/.test(source)) {
    return { categoria: "Dragon Ball Z", categoriaSlug: "dragon-ball-z", saga: "z" };
  }
  return { categoria: "Dragon Ball", categoriaSlug: "dragon-ball", saga: "db" };
}

function episodeNumber(titulo) {
  const text = String(titulo || "");
  const patterns = [
    /\b(?:cap[ií]tulo|capitulo|episodio|episode)\s*(\d{1,4})\b/i,
    /\b(?:dragon ball super|dragon ball z|dragon ball gt|dragon ball kai|dragon ball)\D{0,20}(\d{1,4})\b/i,
    /^\D*(\d{1,4})\s*[-–]/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }

  return 9999;
}

function sortCapitulos(items) {
  const sagaOrder = { db: 1, z: 2, gt: 3, kai: 4, super: 5, peliculas: 6 };
  return [...items].sort((a, b) => {
    const sagaDiff = (sagaOrder[a.saga] || 99) - (sagaOrder[b.saga] || 99);
    if (sagaDiff) return sagaDiff;
    const numberDiff = (a.numero || 9999) - (b.numero || 9999);
    if (numberDiff) return numberDiff;
    return a.titulo.localeCompare(b.titulo, "es");
  });
}

function findInputCsv() {
  const explicit = process.argv[2] && path.resolve(ROOT, process.argv[2]);
  if (explicit && fs.existsSync(explicit)) return explicit;

  const preferred = [
    "data.csv",
    path.join(
      "uploads",
      "uploads",
      "wpallexport",
      "exports",
      "7e648dca5a1dd65f800fbf1ee8421fd0",
      "current-Entradas-Export-2026-May-20-0013.csv"
    ),
    "Entradas-Export-2026-May-20-0013.csv",
  ]
    .map((file) => path.join(ROOT, file))
    .find((file) => fs.existsSync(file));
  if (preferred) return preferred;

  const csvFiles = fs
    .readdirSync(ROOT)
    .filter((file) => file.toLowerCase().endsWith(".csv"))
    .map((file) => path.join(ROOT, file));

  if (csvFiles.length === 1) return csvFiles[0];
  throw new Error("No encontre data.csv ni un CSV unico en la carpeta del proyecto.");
}

function migrate() {
  const inputPath = findInputCsv();
  const outputPath = process.argv[3] ? path.resolve(ROOT, process.argv[3]) : DEFAULT_OUTPUT;
  const records = readCsvObjects(inputPath);

  if (records.length < 1) {
    throw new Error("El CSV no contiene filas suficientes para migrar.");
  }

  const legacyById = new Map();
  const legacyBySlug = new Map();
  const legacyRecords = readCsvObjects(LEGACY_INPUT);
  for (const record of legacyRecords) {
    const id = pick(record, ["id"]);
    const slug = pick(record, ["slug"]);
    const legacy = {
      path: pathFromUrl(pick(record, ["permalink"])),
      categoria: pick(record, ["categorias", "categorías"]),
      order: Number(pick(record, ["order"])) || 0,
    };
    if (id) legacyById.set(id, legacy);
    if (slug) legacyBySlug.set(slug, legacy);
  }

  const currentIds = new Set(records.map((record) => pick(record, ["id"])).filter(Boolean));
  const currentSlugs = new Set(records.map((record) => pick(record, ["slug", "post_name"])).filter(Boolean));

  const capitulos = records
    .map((record, index) => {
      const titulo = pick(record, ["titulo", "title", "post_title", "Título"]);
      const id = pick(record, ["id"]);
      const slug = pick(record, ["slug", "post_name"]) || slugify(titulo || `capitulo-${index + 1}`);
      const legacy = legacyById.get(id) || legacyBySlug.get(slug) || {};
      const sourceCategory = pick(record, ["categorias", "categorías"]) || legacy.categoria;
      const category = inferCategory(titulo, sourceCategory);
      const descripcion = cleanDescription(
        pick(record, ["content", "excerpt", "descripcion", "description"]),
        titulo
      );
      const imagen =
        pick(record, [
          "imageurl",
          "imagefeatured",
          "url2",
          "image url",
          "image featured",
          "url de la imagen destacada",
          "imagen destacada",
          "featured image",
          "featured_image",
          "thumbnail",
          "image",
          "imagen",
          "url",
          "filename",
          "filename2",
        ]) ||
        firstMatchingValue(record, (key, value) => {
          return /imagen|image|thumbnail|featured|url/.test(key) && /wp-content\/uploads|https?:\/\//i.test(value);
        });

      const players = collectPlayers(record);
      const seoTitle = pick(record, ["rankmathtitle", "aioseotitle"]);
      const seoDescription = pick(record, ["rankmathdescription", "aioseodescription"]);
      const links = extractLinks(collectValues(record, ["linkurl"]).join(" "));
      const aliases = [];
      addUniquePath(aliases, pathFromUrl(pick(record, ["permalink"])));
      addUniquePath(aliases, legacy.path);
      addUniquePath(aliases, `/${category.categoriaSlug}/${slug}/`);
      addUniquePath(aliases, `/capitulo/${slug}/`);
      addUniquePath(aliases, `/${slug}/`);
      addUniquePath(aliases, `/${slug}/feed/`);
      addUniquePath(aliases, id ? `/archivos/${id}/` : "");
      addUniquePath(aliases, pathFromUrl(pick(record, ["blogger_permalink", "bloggerpermalink"])));
      addUniquePath(aliases, pick(record, ["wpoldslug"]) ? `/${pick(record, ["wpoldslug"])}/` : "");

      return {
        id,
        titulo,
        slug,
        url: pathFromUrl(pick(record, ["permalink"])) || legacy.path || `/${category.categoriaSlug}/${slug}/`,
        categoria: category.categoria,
        categoriaSlug: category.categoriaSlug,
        saga: category.saga,
        numero: episodeNumber(titulo),
        descripcion,
        imagen: resolveImage(imagen),
        iframe: players[0]?.embed || "",
        players,
        links,
        aliases,
        seoTitle,
        seoDescription,
      };
    })
    .filter((capitulo) => capitulo.titulo && capitulo.slug);

  const sortedCapitulos = sortCapitulos(capitulos);
  const legacyPages = [];
  const legacyPagePaths = new Set();

  for (const record of legacyRecords) {
    const id = pick(record, ["id"]);
    const slug = pick(record, ["slug"]);
    const pagePath = pathFromUrl(pick(record, ["permalink"]));
    if (!pagePath || currentIds.has(id) || currentSlugs.has(slug)) continue;
    if (legacyPagePaths.has(pagePath)) continue;
    legacyPagePaths.add(pagePath);
    legacyPages.push({
      path: pagePath,
      title: pick(record, ["title"]) || "Dragon Ball HD Sin Limites",
      description: pick(record, ["excerpt"]) || "Pagina historica conservada durante la migracion estatica.",
      category: pick(record, ["categorias", "categorías"]) || "Blog",
    });
  }

  if (fs.existsSync(KNOWN_LEGACY_PAGES_INPUT)) {
    const knownPages = JSON.parse(fs.readFileSync(KNOWN_LEGACY_PAGES_INPUT, "utf8"));
    for (const page of knownPages) {
      const pagePath = normalizePath(page.path);
      if (!pagePath || legacyPagePaths.has(pagePath)) continue;
      legacyPagePaths.add(pagePath);
      legacyPages.push({
        path: pagePath,
        title: page.title || "Dragon Ball HD Sin Limites",
        description: page.description || "Pagina historica conservada durante la migracion estatica.",
        category: page.category || "Legacy",
      });
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(sortedCapitulos, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    path.join(path.dirname(outputPath), "legacy-pages.json"),
    `${JSON.stringify(legacyPages, null, 2)}\n`,
    "utf8"
  );

  const withIframe = sortedCapitulos.filter((capitulo) => capitulo.iframe).length;
  const withAlternativePlayers = sortedCapitulos.filter((capitulo) => capitulo.players.length > 1).length;
  const withImage = sortedCapitulos.filter((capitulo) => capitulo.imagen).length;
  const withLegacyPath = sortedCapitulos.filter((capitulo) => capitulo.url).length;
  const withDownloadLinks = sortedCapitulos.filter((capitulo) => capitulo.links.length).length;
  const totalDownloadLinks = sortedCapitulos.reduce((total, capitulo) => total + capitulo.links.length, 0);
  console.log(`CSV: ${path.relative(ROOT, inputPath)}`);
  console.log(`JSON: ${path.relative(ROOT, outputPath)}`);
  console.log(`Capitulos migrados: ${sortedCapitulos.length}`);
  console.log(`Con iframe limpio: ${withIframe}`);
  console.log(`Con alternativas: ${withAlternativePlayers}`);
  console.log(`Con imagen: ${withImage}`);
  console.log(`Con URL SEO antigua: ${withLegacyPath}`);
  console.log(`Con enlaces de descarga: ${withDownloadLinks}`);
  console.log(`Total enlaces de descarga: ${totalDownloadLinks}`);
  console.log(`Paginas legacy adicionales: ${legacyPages.length}`);
}

migrate();
