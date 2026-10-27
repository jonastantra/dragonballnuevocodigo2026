# Diagnóstico y correcciones — Dragon Ball HD Sin Límites

Fecha: 27 de octubre de 2026. Estado: **correcciones locales verificadas, no publicadas**.

## Qué se comprobó en producción

- `https://dragonballnuevocodigo2026.vercel.app` devuelve HTTP 404 y `DEPLOYMENT_NOT_FOUND`. Es la dirección registrada en GitHub, no el dominio público actual.
- `https://dragonballhdsinlimites.net/` redirige con 308 a `https://www.dragonballhdsinlimites.net/`, que responde 200. El sitio no está completamente caído.
- El HTML servido en www declara una dirección canónica sin www. Sitemap, imágenes y datos estructurados también usan esa variante. Se generan saltos innecesarios y señales inconsistentes; esto por sí solo no demuestra una penalización.
- Una URL histórica exacta de Dragon Ball Heroes devuelve 404, mientras que su equivalente `/capitulo/.../` responde 200.
- Portada publicada: aproximadamente 368 KB de HTML. La ficha 404 incluye un índice grande de capítulos y declara la portada como canónica.
- El código calcula vistas falsas a partir del ID, fechas de subida a partir de la carpeta de una imagen y duraciones supuestas. También declara perfiles sociales sin verificación.
- El CSV contiene fichas sin reproductor y al menos una respuesta de IA en inglés en lugar de una sinopsis. No es un catálogo de 1,070 videos comprobados.

**No se cuenta con Search Console ni historial de tráfico/indexación.** No se puede atribuir la caída a una actualización de Google, una acción manual, retiradas de contenido o una penalización. Estos son obstáculos técnicos observados, no una explicación demostrada de toda la caída histórica. Ningún cambio garantiza el primer lugar.

## Qué cambió

1. Dominio canónico unificado con el destino público actual `https://www.dragonballhdsinlimites.net`.
2. Generación reproducible de 5,900 redirecciones históricas exactas, agrupadas en 1,070 reglas compatibles con el límite de 2,048 de Vercel; además se redirigen alias de categorías. Se quitaron reglas genéricas que redirigían hasta archivos y URLs inexistentes a capítulos inexistentes. Las rutas desconocidas conservan 404.
3. Dos alias contradictorios se resuelven dando prioridad al slug actual exacto. No se usan coincidencias aproximadas para redirigir visitantes.
4. Se eliminó el índice completo de la página 404. El buscador obtiene un índice compacto solo al visitarlo, con búsqueda por todas las palabras, carga, errores y límite de resultados explícitos.
5. Portada, header, menú, buscador móvil y categorías reorganizados. Se muestran primero las sagas y sus capítulos con fuente configurada. Heroes tiene categoría propia.
6. El botón de reproducción ya es accesible por teclado. Se mantiene la carga bajo demanda y la selección de servidor.
7. Las 153 fichas sin reproductor original se conservan, pero con noindex y sin presencia en el sitemap. No se borraron datos ni se inventaron fuentes de video. Las páginas utilitarias vacías tampoco se presentan como contenido indexable.
8. Se eliminaron vistas, fechas, duraciones y perfiles sociales no respaldados. No se emite VideoObject sin una fecha de subida comprobada. Se conserva TVEpisode/Movie y navegación estructurada sin esos datos falsos.
9. Se retiraron las fechas de modificación fijas del sitemap. Google puede rastrear URLs con parámetros para leer sus señales canónicas/noindex; el buscador permanece noindex.
10. Optimización de imágenes idempotente: ya no agrega carpetas `optimized/optimized` en cada ejecución y elimina la carpeta duplicada `public/optimized/optimized/` (899 archivos duplicados). Además, se recuperaron las 21 portadas faltantes y las 3 portadas que apuntaban a `/wp-content/uploads/` (404), logrando 1,070/1,070 capítulos con imagen local verificada.
11. Se retiró la dependencia de descarga de Google Fonts al compilar. Se usa tipografía del sistema.
12. Next, React y herramientas de imágenes/CSS actualizados. `npm ci --include=dev` asegura que la compilación tenga sus herramientas incluso con NODE_ENV=production.
13. La integración continua ejecuta la batería SEO y las regresiones después de compilar.
14. **Reparación de 341+ reproductores de video rotos en `scripts/migrar.js`**:
    - `waaw.to/f/<id>` ya no se reescribe erróneamente a `waaw.to/embed/<id>` (que devolvía HTTP 404 en 271 videos; `/f/<id>` responde HTTP 200 OK).
    - 70 enlaces e iframes del dominio espejo expirado `pokemonlaserielatino.xyz` se normalizan a `https://waaw.to/f/` y `https://waaw.to/watch_video.php` (HTTP 200 OK).
    - Se decodifica el hash residual de `wpdb::prepare` (`{c028543aafc3976f67633fd5fc91d12d729f54bec8d9e21796445b4c431ff5c7}` -> `%`), reparando 4 películas cuyos parámetros `watch_video.php?v=...` estaban corruptos y limpiando 46 alias.
    - Se convierten enlaces `mega.nz/file/` a `mega.nz/embed/` (5 videos) y se extraen los 28 reproductores `drive.google.com/file/d/.../preview` desde `linkurl`.
    - Se descartan los 15 iframes placeholder `<iframe src="AQUI"></iframe>` de Dragon Ball Heroes para que no se indexen como reproductores válidos, y se recuperan los reproductores de los episodios paralelos `12827` (DBZ 271) y `8582` (DBS Sub 104).
15. **Redirecciones 301 con y sin barra final (`/?`) en `scripts/prepare-site.js`**:
    - Las reglas `/:legacy((?:...)/?)` ahora coinciden tanto con barra final (`/dragon-ball-z/237-.../`) como sin barra final (`/dragon-ball-z/237-...` y URLs `.html` antiguas de Blogger) en el router estricto de Vercel.
16. **Títulos exactos (`title: { absolute }`) y guía editorial completa en todas las categorías**:
    - Se evita que el template global agregue `| Dragon Ball HD Sin Limites` sobre títulos de episodios y categorías que ya tienen 55–60 caracteres, y se completó la guía editorial y `FAQPage` de `/category/dragon-ball-heroes/`.

## Comprobaciones

- `npm run build`: exportación estática completada.
- `npm test`: 143/143 comprobaciones SEO aprobadas.
- Regresiones sobre 1,070 fichas y 5,900 redirecciones históricas: aprobadas.
- 69,036 referencias internas y recursos revisados: cero rutas faltantes.
- Las 153 fichas sin fuente tienen noindex y están fuera del sitemap; las 917 con fuente declarada están incluidas.
- Portada corregida: 80,979 bytes de HTML, aproximadamente 78% menos que la respuesta publicada observada.
- `npm audit`: cero vulnerabilidades reportadas, frente a cinco iniciales.
- Navegador Chromium: portada en 390 y 1440 px sin desbordamiento horizontal ni imágenes rotas; buscador devuelve resultados; botón de reproducción inserta la fuente externa; sin errores JavaScript de la aplicación en esos recorridos.
- Dos fuentes externas de un episodio muestreado responden 200. Esto **no verifica reproducción completa, disponibilidad ni calidad de todos los videos**.
- `git diff --check`: sin errores de espacios.

Las reglas de Vercel se probaron con su sintaxis de rutas mediante `path-to-regexp` y con el servidor local de vista previa. Su aplicación real en la infraestructura pública **queda pendiente de publicar y verificar**. GitHub Pages por sí solo no interpreta las reglas de Vercel.

## Entrega y siguiente paso

Cambios en una copia aislada del repositorio, rama `fix/seo-recovery-20261027`. Imágenes de revisión en `artifacts/` (no se incluyen en Git).

Antes de subir, la instrucción local `~/mi-linux/maquina/PARA-OPENCLAW.md` pide el sí de John para GitHub. No se modificaron DNS, servicios, cuentas, campañas ni la configuración de producción.

GitHub registra una integración Vercel del equipo `paquidermechingon-4070s-projects`. La conexión Vercel disponible en esta sesión no tiene acceso a ese equipo (403). El flujo de GitHub existente podría desplegar al subir cambios; debe comprobarse el resultado real, no asumirlo.

Tras autorizar la publicación:

1. Subir el cambio al repositorio y comprobar las compilaciones/despliegues del SHA exacto.
2. Actualizar la dirección pública del repositorio a la URL www actual.
3. Verificar en el dominio público portada, recursos, categoría, episodio, búsqueda, sitemap, robots, redirecciones exactas y 404 desconocido.
4. Con acceso a Search Console: revisar Acciones manuales, Seguridad, Indexación, Sitemaps y retirar/actualizar mapas antiguos; enviar el sitemap limpio e inspeccionar URLs representativas. No se puede solicitar indexación de todo un catálogo con una API genérica.
5. Recuperar de respaldos o fuentes originales los reproductores faltantes antes de volver a indexar esas fichas. Comprobar enlaces externos por separado.
6. Medir resultados reales de indexación y clics después de la publicación; no confundir aprobación de pruebas con recuperación del posicionamiento.
