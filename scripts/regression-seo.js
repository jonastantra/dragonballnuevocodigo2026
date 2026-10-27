const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToRegexp } = require('next/dist/compiled/path-to-regexp');
const chapters = require('../data/capitulos.json');
const redirects = require('../data/redirect-map.json');
const config = require('../vercel.json');
const origin = 'https://www.dragonballhdsinlimites.net';
const sitemap = fs.readFileSync('out/sitemap.xml', 'utf8');
const rules = config.redirects.map(r => ({...r, re: pathToRegexp(r.source)}));
let checked = 0, links = 0;
const missing = new Set();
const cache = new Map();
function exists(url) {
  const target = new URL(url, origin);
  if (target.origin !== origin) return true;
  const pathname = decodeURIComponent(target.pathname);
  if (!cache.has(pathname)) {
    const file = path.join('out', pathname);
    cache.set(pathname, fs.existsSync(file) && (fs.statSync(file).isFile() || fs.existsSync(path.join(file, 'index.html'))));
  }
  return cache.get(pathname);
}
assert(config.redirects.length <= 2048);
for (const [source, destination] of Object.entries(redirects)) {
  const match = rules.find(r => r.re.test(source));
  assert.equal(match?.destination, destination, source);
  assert.equal(match?.statusCode, 301);
  const noSlash = source.length > 1 && source.endsWith('/') ? source.slice(0, -1) : source;
  const matchNoSlash = rules.find(r => r.re.test(noSlash));
  assert.equal(matchNoSlash?.destination, destination, noSlash);
  assert(exists(destination), destination);
  checked++;
}
const rawCapitulos = JSON.stringify(chapters);
assert(!rawCapitulos.includes('c028543'), 'No corrupted WP placeholder hashes');
assert(!rawCapitulos.includes('waaw.to/embed/'), 'No broken waaw.to/embed/ 404 URLs');
assert(!rawCapitulos.includes('pokemonlaserielatino.xyz'), 'No expired pokemonlaserielatino mirror URLs');
assert(!rawCapitulos.includes('src="AQUI"'), 'No placeholder AQUI iframe embeds');
assert(chapters.every(c => Boolean(c.imagen) && exists(c.imagen)), 'All 1070 episodes have an existing local image');
assert(!rules.some(r => r.re.test('/search-index.json')));
assert(!rules.some(r => r.re.test('/no-existe-prueba-pancho-2026/')));
for (const c of chapters) {
  const h = fs.readFileSync(path.join('out', c.url, 'index.html'), 'utf8');
  assert.equal((h.match(/<h1\b/g)||[]).length, 1, c.url);
  assert(h.includes(`<link rel="canonical" href="${origin}${c.url}"`), c.url);
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(h);
  assert.equal(noindex, !c.players.length, c.url);
  assert.equal(sitemap.includes(`<loc>${origin}${c.url}</loc>`), Boolean(c.players.length), c.url);
  assert(!h.includes('userInteractionCount'), 'Fake view counts');
  for (const match of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(match[1]);
  for (const match of h.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (!url.startsWith('/')) continue;
    links++;
    if (!exists(url)) missing.add(url);
  }
}
assert.equal(missing.size, 0, [...missing].join('\n'));
const home = fs.readFileSync('out/index.html', 'utf8');
assert(Buffer.byteLength(home) < 120000, 'Home must not embed the full catalog');
assert(!fs.readFileSync('out/404.html','utf8').includes('rel="canonical"'), '404 must not claim home canonical');
assert(!sitemap.includes('<lastmod>2026-05-20'), 'No fabricated timestamps');
console.log(JSON.stringify({chapters:chapters.length,redirects:checked,internalLinksAndAssets:links,missing:missing.size,playable:chapters.filter(c=>c.players.length).length,homeBytes:Buffer.byteLength(home)},null,2));
