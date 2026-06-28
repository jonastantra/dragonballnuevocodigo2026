const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "capitulos.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT_ROOT = path.join(PUBLIC_DIR, "optimized");
const TARGET_WIDTH = 520;
const QUALITY = 72;

function localPublicPath(urlPath) {
  if (!urlPath || /^https?:\/\//i.test(urlPath)) return "";
  const clean = String(urlPath).split("?")[0].split("#")[0].replace(/^\/+/, "");
  if (!/\.(jpe?g|png|webp)$/i.test(clean)) return "";
  return path.join(PUBLIC_DIR, clean);
}

function optimizedUrl(urlPath) {
  const clean = String(urlPath).split("?")[0].split("#")[0].replace(/^\/+/, "");
  return `/optimized/${clean.replace(/\.(jpe?g|png|webp)$/i, ".webp")}`;
}

async function ensureOptimized(inputPath, outputPath) {
  if (fs.existsSync(outputPath)) return false;
  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await sharp(inputPath)
      .rotate()
      .resize({
        width: TARGET_WIDTH,
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outputPath);
    return true;
  } catch (err) {
    console.error(`Saltando ${path.relative(ROOT, inputPath)}: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error("No existe data/capitulos.json. Ejecuta primero la migracion.");
  }

  const capitulos = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const seen = new Map();
  let generated = 0;
  let reused = 0;
  let updated = 0;

  for (const capitulo of capitulos) {
    const source = localPublicPath(capitulo.imagen);
    if (!source || !fs.existsSync(source)) continue;

    const nextUrl = optimizedUrl(capitulo.imagen);
    const output = path.join(PUBLIC_DIR, nextUrl.replace(/^\/+/, ""));

    if (!seen.has(source)) {
      const didGenerate = await ensureOptimized(source, output);
      seen.set(source, nextUrl);
      if (didGenerate) generated += 1;
      else reused += 1;
    }

    if (capitulo.imagen !== nextUrl) {
      capitulo.imagen = nextUrl;
      updated += 1;
    }
  }

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(capitulos, null, 2)}\n`, "utf8");
  console.log(`Imagenes optimizadas nuevas: ${generated}`);
  console.log(`Imagenes optimizadas reutilizadas: ${reused}`);
  console.log(`Capitulos apuntando a WebP: ${updated}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
