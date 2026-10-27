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


## Recuperación técnica — octubre 2026

El dominio público actual es https://www.dragonballhdsinlimites.net/. La URL antigua de Vercel registrada en GitHub ya no existe.

- `npm ci --include=dev` instala también las herramientas de compilación.
- `npm run build` migra, optimiza, genera el índice compacto/redirecciones y exporta `out/`.
- `npm test` comprueba SEO, enlaces internos, sitemap y redirecciones históricas.
- `npm run preview -- 3137` muestra el sitio en `http://127.0.0.1:3137`, interpretando también las redirecciones de Vercel.

`vercel.json` se genera desde `config/vercel-base.json` y los alias de migración. Debe quedar actualizado y versionado antes de subir: Vercel lee su configuración antes de ejecutar el build. GitHub Pages no interpreta redirecciones de Vercel.

Las fichas sin reproductor se conservan con noindex; agregar un reproductor válido a la fuente y recompilar permite incluirlas de nuevo. No se deben inventar vistas, fechas de subida ni duraciones para conseguir resultados enriquecidos.

Ver [diagnóstico comprobado](DIAGNOSTICO-2026-10-27.md).
