# Dragon Ball HD Sin Limites - Migracion Estatica

Proyecto Next.js App Router para reemplazar WordPress con un sitio 100% estatico.

## 1. Script de extraccion y limpieza

```bash
npm run migrar
```

El script `migrar.js` busca primero `data.csv`; si no existe, usa el CSV exportado de WordPress que esta en la carpeta. Genera `data/capitulos.json` con:

```json
{ "titulo": "...", "slug": "...", "imagen": "...", "iframe": "..." }
```

Limpia reproductores quitando `width`, `height`, `style`, `frameborder`, eventos inline y diagonales escapadas `\/`. Tambien agrega atributos seguros como `loading="lazy"` y `referrerpolicy`, respetando el campo `player1` del CSV.

Las imagenes de WordPress se resuelven desde `uploads/` y se copian a `public/uploads/`, que es la carpeta que Next/Vercel sirve como archivos estaticos.

## 2. Sitio Next.js

Archivos principales:

- `app/page.js`: home estatica con hero, buscador predictivo, filtros rapidos y grid.
- `components/CapituloExplorer.js`: buscador cliente rapido sobre el JSON.
- `app/capitulo/[slug]/page.js`: pagina estatica por capitulo con `generateStaticParams`.
- `app/layout.js`: metadata SEO global.
- `app/sitemap.js` y `app/robots.js`: indexacion estatica.

## 3. Produccion

```bash
npm run build
```

El build ejecuta la migracion y exporta el sitio estatico en `out/`, listo para Vercel o hosting estatico.
