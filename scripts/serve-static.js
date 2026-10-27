const fs = require("fs");
const http = require("http");
const path = require("path");
const { pathToRegexp } = require("next/dist/compiled/path-to-regexp");
const redirectRules = require("../vercel.json").redirects.map(rule => { const keys = []; return { ...rule, keys, regex: pathToRegexp(rule.source, keys) }; });

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const PORT = Number(process.env.PORT || process.argv[2] || 3000);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
}

function resolveRequest(url) {
  const parsed = new URL(url, `http://localhost:${PORT}`);
  let pathname = safeDecode(parsed.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";

  const direct = path.resolve(OUT_DIR, pathname.replace(/^\/+/, ""));
  if (direct.startsWith(OUT_DIR + path.sep) && fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }

  const asDirectory = path.resolve(OUT_DIR, pathname.replace(/^\/+/, ""), "index.html");
  if (
    asDirectory.startsWith(OUT_DIR + path.sep) &&
    fs.existsSync(asDirectory) &&
    fs.statSync(asDirectory).isFile()
  ) {
    return asDirectory;
  }

  return path.join(OUT_DIR, "404.html");
}

const server = http.createServer((req, res) => {
  const requested = new URL(req.url, `http://localhost:${PORT}`);
  for (const rule of redirectRules) {
    const match = rule.regex.exec(safeDecode(requested.pathname));
    if (!match) continue;
    let destination = rule.destination;
    rule.keys.forEach((key, i) => { destination = destination.replace(new RegExp(':' + key.name + '[*?]?', 'g'), match[i + 1] || ''); });
    res.writeHead(rule.statusCode || 308, { location: destination + requested.search });
    res.end(); return;
  }
  const filePath = resolveRequest(req.url);
  const ext = path.extname(filePath).toLowerCase();
  const statusCode = path.basename(filePath) === "404.html" ? 404 : 200;

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end("Static server error");
      return;
    }

    res.writeHead(statusCode, {
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`) ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(req.method === "HEAD" ? undefined : content);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Static preview: http://localhost:${PORT}`);
});
