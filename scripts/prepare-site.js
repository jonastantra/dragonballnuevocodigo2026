const fs = require('node:fs');
const chapters = require('../data/capitulos.json');
const base = require('../config/vercel-base.json');
const normalize = value => {
  try { value = decodeURIComponent(value); } catch {}
  return '/' + value.replace(/^\/+|\/+$/g, '') + '/';
};
const aliases = new Map();
// Exact current slugs win over corrupt WordPress aliases pointing at other episodes.
for (const chapter of chapters) aliases.set(normalize('/' + chapter.slug), chapter.url);
let conflicts = 0;
for (const chapter of chapters) for (const raw of chapter.aliases || []) {
  const source = normalize(raw);
  if (source === chapter.url || source.startsWith('/capitulo/')) continue;
  if (aliases.has(source) && aliases.get(source) !== chapter.url) { conflicts++; continue; }
  aliases.set(source, chapter.url);
}
const groups = new Map();
for (const [source, destination] of aliases) {
  if (!groups.has(destination)) groups.set(destination, []);
  groups.get(destination).push(source.slice(1, -1));
}
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const redirects = [];
for (const [destination, paths] of groups) {
  let chunk = [];
  const flush = () => {
    if (chunk.length) redirects.push({ source: '/:legacy((?:' + chunk.join('|') + ')/?)', destination, statusCode: 301 });
    chunk = [];
  };
  for (const path of paths) {
    const pattern = escape(path);
    if (chunk.join('|').length + pattern.length > 3800) flush();
    chunk.push(pattern);
  }
  flush();
}
// Precise episode redirects must precede the old catch-all /:slug/feed -> home rule.
const siteSource = fs.readFileSync('lib/site.js', 'utf8').split('export const categoryAliases = [')[1].split('];')[0];
const categories = [...siteSource.matchAll(/path: "([^"]+)", canonicalPath: "([^"]+)"/g)].map(m => ({source: m[1], destination: m[2], statusCode: 301}));
base.redirects = [...redirects, ...categories, ...base.redirects];
if (base.redirects.length > 2048) throw new Error('Vercel redirect limit exceeded');
fs.writeFileSync('vercel.json', JSON.stringify(base, null, 2) + '\n');
fs.writeFileSync('data/redirect-map.json', JSON.stringify(Object.fromEntries(aliases)) + '\n');
const index = chapters.filter(chapter => chapter.players?.length).map(({ slug, titulo, imagen, categoria, categoriaSlug, saga, numero }) => ({ slug, titulo, imagen, categoria, categoriaSlug, saga, numero }));
fs.writeFileSync('public/search-index.json', JSON.stringify(index) + '\n');
console.log(`Prepared ${aliases.size} historical redirects in ${redirects.length} rules; ${conflicts} conflicting aliases resolved by exact-slug precedence.`);
