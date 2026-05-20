const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const SITE = "https://dragonballhdsinlimites.net";

const staticPaths = [
  "/",
  "/blog/",
  "/politica-de-privacidad/",
  "/terminos-y-condiciones/",
  "/aviso-legal/",
  "/contacto/",
  "/category/dragon-ball-super-latino/",
  "/category/dragon-ball-super-sub/",
  "/category/dragon-ball-gt/",
  "/category/dragon-ball-z/",
  "/category/dragon-ball-kai/",
  "/category/dragon-ball/",
  "/dragon-ball-todas-las-peliculas-y-especiales/",
  "/category/dragon-ball-todas-las-peliculas/dragon-ball-super-peliculas/",
  "/category/dragon-ball-todas-las-peliculas/dragon-ball-z-peliculas/",
  "/category/dragon-ball-todas-las-peliculas/dragon-ball-peliculas/",
  "/robots.txt",
  "/sitemap.xml",
];

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

function readCsvObjects(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  if (rows.length < 2) return [];
  const headers = uniqueHeaders(rows[0]);
  return rows.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ? String(row[index]).trim() : "";
    });
    return record;
  });
}

function normalizePath(value) {
  if (!value) return "";
  let raw = String(value).trim();
  try {
    if (/^https?:\/\//i.test(raw)) raw = new URL(raw).pathname;
  } catch (_error) {
    return "";
  }

  raw = raw.split("?")[0].split("#")[0].trim();
  if (!raw || raw === "/") return "/";
  const clean = raw.replace(/^\/+|\/+$/g, "");
  if (/\.[a-z0-9]{2,8}$/i.test(clean)) return `/${clean}`;
  return `/${clean}/`;
}

function outCandidates(urlPath) {
  const normalized = normalizePath(urlPath);
  if (normalized === "/robots.txt") return [path.join(OUT_DIR, "robots.txt")];
  if (normalized === "/sitemap.xml") return [path.join(OUT_DIR, "sitemap.xml")];
  if (/\.[a-z0-9]{2,8}$/i.test(normalized)) {
    return [path.join(OUT_DIR, normalized.replace(/^\/+/, ""))];
  }
  if (normalized === "/") return [path.join(OUT_DIR, "index.html")];

  const clean = normalized.replace(/^\/|\/$/g, "");
  const decoded = safeDecode(clean);
  const encoded = clean
    .split("/")
    .map((segment) => encodeURIComponent(safeDecode(segment)))
    .join("/");

  return [
    path.join(OUT_DIR, clean, "index.html"),
    path.join(OUT_DIR, decoded, "index.html"),
    path.join(OUT_DIR, encoded, "index.html"),
  ];
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
}

function existsInOut(urlPath) {
  return outCandidates(urlPath).some((candidate) => fs.existsSync(candidate));
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; DragonBallMigrationCheck/1.0)",
        },
        timeout: 15000,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => resolve({ statusCode: res.statusCode, body }));
      }
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ statusCode: 0, body: "" });
    });
    req.on("error", () => resolve({ statusCode: 0, body: "" }));
  });
}

function extractInternalLinks(html) {
  const links = new Set();
  const pattern = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = pattern.exec(html))) {
    const href = match[1].trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("//")) continue;
    if (href.startsWith("/")) links.add(normalizePath(href));
    if (href.startsWith(SITE)) links.add(normalizePath(href));
  }

  return links;
}

async function main() {
  const paths = new Set(staticPaths.map(normalizePath));
  const sources = {};

  function add(urlPath, source) {
    const normalized = normalizePath(urlPath);
    if (!normalized) return;
    paths.add(normalized);
    sources[normalized] = sources[normalized] || new Set();
    sources[normalized].add(source);
  }

  for (const capitulo of JSON.parse(fs.readFileSync(path.join(ROOT, "data", "capitulos.json"), "utf8"))) {
    add(capitulo.url, "capitulos.json:url");
    add(`/capitulo/${capitulo.slug}/`, "capitulos.json:fallback");
  }

  for (const record of readCsvObjects(path.join(ROOT, "data.csv"))) {
    add(record.permalink, "data.csv:permalink");
    if (record.wpoldslug) add(`/${record.wpoldslug}/`, "data.csv:wp_old_slug");
  }

  for (const record of readCsvObjects(path.join(ROOT, "data", "legacy-permalinks.csv"))) {
    add(record.permalink, "legacy-permalinks.csv:permalink");
  }

  const liveHome = await fetchUrl(SITE);
  let liveLinks = 0;
  if (liveHome.statusCode && liveHome.body) {
    for (const href of extractInternalLinks(liveHome.body)) {
      add(href, "live-home");
      liveLinks += 1;
    }
  }

  const missing = [...paths]
    .filter((urlPath) => !existsInOut(urlPath))
    .sort()
    .map((urlPath) => ({
      path: urlPath,
      sources: [...(sources[urlPath] || [])],
    }));

  const report = {
    checkedPaths: paths.size,
    liveHomeStatus: liveHome.statusCode,
    liveHomeInternalLinks: liveLinks,
    missingCount: missing.length,
    missing,
  };

  fs.writeFileSync(path.join(ROOT, "data", "404-check-report.json"), `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Rutas revisadas: ${report.checkedPaths}`);
  console.log(`Home original status: ${report.liveHomeStatus || "no disponible"}`);
  console.log(`Links internos en home original: ${report.liveHomeInternalLinks}`);
  console.log(`Faltantes en out/: ${report.missingCount}`);

  if (missing.length) {
    console.log(JSON.stringify(missing.slice(0, 30), null, 2));
    process.exitCode = 1;
  }
}

main();
