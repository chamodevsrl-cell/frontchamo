# Registro de cambios (antes / después)

Esta carpeta documenta **cada solicitud de cambio** del proyecto: qué había antes, qué se cambió, el código relevante y una recomendación.

## Convención

1. Un archivo Markdown por solicitud (o por bloque de avance relacionado).
2. Nombre sugerido: `AAAA-MM-DD-descripcion-corta.md`
3. Usar la plantilla en [`_plantilla.md`](./_plantilla.md).
4. Al terminar un cambio solicitado, se crea o actualiza el `.md` **antes** del commit a Git.

## Índice reciente

| Fecha | Cambio | Archivo |
| --- | --- | --- |
| 2026-09-11 | Nuevo apartado A.12 "Dashboard" en la documentación técnica | [2026-09-11-dashboard-doc-section.md](./2026-09-11-dashboard-doc-section.md) |
| 2026-09-11 | Contrato API del panel admin (tipos, mock, login, `API_CONTRACT.md`) | [2026-09-11-admin-api-contract.md](./2026-09-11-admin-api-contract.md) |
| 2026-09-11 | Panel admin: sidebar, header y dashboard base | [2026-09-11-admin-panel-layout.md](./2026-09-11-admin-panel-layout.md) |
| 2026-09-11 | Revisión merge-readiness: cierre de 5 bugs pendientes de `main` | [2026-09-11-merge-ready-fixes.md](./2026-09-11-merge-ready-fixes.md) |
| 2026-09-11 | Fix build roto + carrito con precio guardado + nombres listos para backend | [2026-09-11-backend-ready-fixes.md](./2026-09-11-backend-ready-fixes.md) |
| 2026-09-11 | Fix: doble loader del logo (reduced-motion) + rol admin | [2026-09-11-fix-loader-admin-role.md](./2026-09-11-fix-loader-admin-role.md) |
| 2026-09-11 | Bugs: doble loader (reduced-motion), rol de admin, precio del carrito + nombres backend | [2026-09-11-bugs-admin-loader-carrito.md](./2026-09-11-bugs-admin-loader-carrito.md) |
| 2026-09-11 | Loader de nav interna (mismo que entrada) + carrito detrás de la costura | [2026-09-11-loader-nav-carrito-costura.md](./2026-09-11-loader-nav-carrito-costura.md) |
| 2026-09-11 | Preloader: logo, engranaje y fade-out a 2.5 s | [2026-09-11-preloader-2-5s-logo-engranaje.md](./2026-09-11-preloader-2-5s-logo-engranaje.md) |
| 2026-09-10 | Ejecutar sugerencias: login, comparar, admin, collages | [2026-09-10-sugerencias-login-comparar-admin.md](./2026-09-10-sugerencias-login-comparar-admin.md) |
| 2026-09-10 | Bugs en intro del carrito y preloader (revisión Claude Code) | [2026-09-10-bugs-intro-preloader.md](./2026-09-10-bugs-intro-preloader.md) |
| 2026-09-10 | Preloader con logo y engranaje oficiales | [2026-09-10-preloader-logo-engranaje.md](./2026-09-10-preloader-logo-engranaje.md) |
| 2026-09-10 | Preloader Framer Motion (carga inicial) | [2026-09-10-preloader-framer.md](./2026-09-10-preloader-framer.md) |
| 2026-09-10 | Intro del carrito: puertas + carrito que frena y sigue | [2026-09-10-intro-carrito.md](./2026-09-10-intro-carrito.md) |
| 2026-09-10 | Bugs: intro scrolleable, WhatsApp bloqueado, toast de favoritos | [2026-09-10-bugs-cambios-recientes.md](./2026-09-10-bugs-cambios-recientes.md) |
| 2026-09-10 | Intro solo al entrar, refrescar o clic en el logo | [2026-09-10-intro-logo-refresh.md](./2026-09-10-intro-logo-refresh.md) |
| 2026-09-10 | Intro solo al cargar el sitio y al entrar a Nosotros | [2026-09-10-intro-solo-nosotros.md](./2026-09-10-intro-solo-nosotros.md) |
| 2026-09-10 | Página de contacto completa (canales, formulario WhatsApp, mapa) | [2026-09-10-seccion-contacto.md](./2026-09-10-seccion-contacto.md) |
| 2026-09-10 | Intro también al cambiar de página (Categorías, etc.) + responsive | [2026-09-10-intro-navegacion.md](./2026-09-10-intro-navegacion.md) |
| 2026-09-10 | Cierre auditoría UX: favoritos, fallback marcas, testimonios, WhatsApp por categoría | [2026-09-10-cierre-auditoria-ux.md](./2026-09-10-cierre-auditoria-ux.md) |
| 2026-09-10 | Auditoría UX/UI y funcional (sitio corriendo, bugs confirmados) | [2026-09-10-auditoria-ux-funcional.md](./2026-09-10-auditoria-ux-funcional.md) |
| 2026-09-09 | Intro de entrada: puertas azules + engranaje | [2026-09-09-intro-engranaje.md](./2026-09-09-intro-engranaje.md) |
| 2026-09-09 | Dev server: allowedDevOrigins incluye localhost | [2026-09-09-dev-server-localhost.md](./2026-09-09-dev-server-localhost.md) |
| 2026-09-09 | Iconos Lucide (carrito, categorías, productos; sin emoji) | [2026-09-09-iconos-lucide.md](./2026-09-09-iconos-lucide.md) |
| 2026-09-09 | Productos destacados: una sola fila (carrusel como categorías) | [2026-09-09-destacados-una-fila.md](./2026-09-09-destacados-una-fila.md) |
| 2026-09-09 | Encabezados sticker: Catálogo, Nosotros, Ofertas, Contacto | [2026-09-09-encabezados-stamp.md](./2026-09-09-encabezados-stamp.md) |
| 2026-09-09 | Slider: quitar placeholder azul; solo banners + fade-in | [2026-09-09-slider-sin-placeholder.md](./2026-09-09-slider-sin-placeholder.md) |
| 2026-09-09 | Banner Nosotros + misión/visión + animaciones de scroll | [2026-09-09-nosotros-banner-animaciones.md](./2026-09-09-nosotros-banner-animaciones.md) |
| 2026-09-09 | Banner de categoría: imagen ancha + título centrado | [2026-09-09-banner-categoria.md](./2026-09-09-banner-categoria.md) |
| 2026-09-09 | Ejecutar SUGERENCIAS.md en orden (páginas, catálogo, WhatsApp, tests) | [2026-09-09-sugerencias-prioridad.md](./2026-09-09-sugerencias-prioridad.md) |
| 2026-09-08 | Auditoría: sincronizar CLAUDE.md/MANUAL.md con el código real | [2026-09-08-auditoria-sync-docs.md](./2026-09-08-auditoria-sync-docs.md) |
| 2026-09-08 | Navbar hover: solo texto, sin bloque | [2026-09-08-navbar-hover-solo-texto.md](./2026-09-08-navbar-hover-solo-texto.md) |
| 2026-09-08 | Navbar: barra dorada en ítem activo | [2026-09-08-navbar-barra-dorada-activa.md](./2026-09-08-navbar-barra-dorada-activa.md) |
| 2026-09-08 | Ficha técnica: diseño tabla cabecera + filas | [2026-09-08-ficha-tecnica-diseno-tabla.md](./2026-09-08-ficha-tecnica-diseno-tabla.md) |
| 2026-09-08 | Modal ficha técnica + relacionados | [2026-09-08-modal-ficha-relacionados.md](./2026-09-08-modal-ficha-relacionados.md) |
| 2026-09-08 | Carrusel categorías en PC con flechas | [2026-09-08-categorias-carrusel-flechas-pc.md](./2026-09-08-categorias-carrusel-flechas-pc.md) |
| 2026-09-08 | Categorías en carrusel (como productos) | [2026-09-08-categorias-carrusel.md](./2026-09-08-categorias-carrusel.md) |
| 2026-09-08 | Consolidar docs en 3 secciones (cambios / sugerencias / técnica+usuario) | [2026-09-08-consolidar-3-secciones-docs.md](./2026-09-08-consolidar-3-secciones-docs.md) |
| 2026-09-08 | +3 categorías y docs vivas (manual/técnica/usuario/sugerencias) | [2026-09-08-categorias-mas-tres-y-docs-vivas.md](./2026-09-08-categorias-mas-tres-y-docs-vivas.md) |
| 2026-09-08 | Categorías layout Explorar + borde brillante | [2026-09-08-categorias-layout-explorar.md](./2026-09-08-categorias-layout-explorar.md) |
| 2026-09-08 | Marcas distribuidoras debajo del slider | [2026-09-08-marcas-debajo-del-slider.md](./2026-09-08-marcas-debajo-del-slider.md) |
| 2026-09-08 | Banner completo sin recorte (responsive) | [2026-09-08-slider-banner-completo-responsive.md](./2026-09-08-slider-banner-completo-responsive.md) |
| 2026-09-08 | Slider a todo el ancho (full-bleed) | [2026-09-08-slider-full-bleed.md](./2026-09-08-slider-full-bleed.md) |
| 2026-09-08 | Fix carga de banners + banners 2 y 3 | [2026-09-08-slider-banners-fix-y-assets.md](./2026-09-08-slider-banners-fix-y-assets.md) |
