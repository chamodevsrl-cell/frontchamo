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
| 2026-09-22 | Ofertas: título "¡Mega ofertas!" arriba de la grilla de 4 secciones | [2026-09-22-ofertas-titulo-mega-ofertas.md](./2026-09-22-ofertas-titulo-mega-ofertas.md) |
| 2026-09-22 | Ofertas: separador entre la grilla y las tarjetas + bordes más gruesos | [2026-09-22-ofertas-separador-bordes-mas-gruesos.md](./2026-09-22-ofertas-separador-bordes-mas-gruesos.md) |
| 2026-09-22 | Ofertas: la grilla de 4 secciones reemplaza el banner completo (sin título encima) | [2026-09-22-ofertas-4-secciones-sin-titulo-encima.md](./2026-09-22-ofertas-4-secciones-sin-titulo-encima.md) |
| 2026-09-22 | Fix: guardar en el panel rompía la página cuando el navegador se quedaba sin espacio | [2026-09-22-fix-crash-localstorage-lleno.md](./2026-09-22-fix-crash-localstorage-lleno.md) |
| 2026-09-22 | Ofertas: rediseño del banner — sin panel oscuro, 4 secciones con borde | [2026-09-22-ofertas-rediseno-4-secciones-sin-panel.md](./2026-09-22-ofertas-rediseno-4-secciones-sin-panel.md) |
| 2026-09-22 | Se revierte la franja de imágenes de Ofertas (a rediseñar desde cero) | [2026-09-22-ofertas-revertir-franja-imagenes.md](./2026-09-22-ofertas-revertir-franja-imagenes.md) |
| 2026-09-22 | Ofertas: se quita el banner anterior + límite de 3-4 imágenes + fix de imagen vacía | [2026-09-22-ofertas-quitar-banner-anterior-limite-3-4.md](./2026-09-22-ofertas-quitar-banner-anterior-limite-3-4.md) |
| 2026-09-22 | Ofertas: editor de franja movido a /admin/ofertas + % de descuento en productos | [2026-09-22-ofertas-panel-dedicado-descuento-porcentaje.md](./2026-09-22-ofertas-panel-dedicado-descuento-porcentaje.md) |
| 2026-09-22 | Ofertas: banner reemplazado por franja de imágenes que enlazan a un producto | [2026-09-22-franja-imagenes-ofertas.md](./2026-09-22-franja-imagenes-ofertas.md) |
| 2026-09-22 | Carpeta de handoff para el backend dev (`docs/backend-handoff/`) + fix de choque de nombres de endpoint | [2026-09-22-carpeta-backend-handoff.md](./2026-09-22-carpeta-backend-handoff.md) |
| 2026-09-22 | Contrato HTTP de la tienda pública (`API_CONTRACT_TIENDA.md`) + `// TODO Backend` en el código | [2026-09-22-contrato-api-tienda-backend-ready.md](./2026-09-22-contrato-api-tienda-backend-ready.md) |
| 2026-09-22 | Split de componentes grandes del panel (AdminNewProductForm, AdminUsersCards) | [2026-09-22-split-admin-componentes-grandes.md](./2026-09-22-split-admin-componentes-grandes.md) |
| 2026-09-21 | MANUAL.md: guía completa para conectar backend (tienda + panel, no solo admin) | [2026-09-21-manual-conectar-backend-tienda.md](./2026-09-21-manual-conectar-backend-tienda.md) |
| 2026-09-21 | Simplificar animaciones de transición: un solo loader, solo en admin/perfil | [2026-09-21-simplificar-loader-transiciones.md](./2026-09-21-simplificar-loader-transiciones.md) |
| 2026-09-21 | Productos: Ver/Editar/Eliminar en la lista + oferta + presentaciones de venta | [2026-09-21-productos-crud-oferta-presentaciones.md](./2026-09-21-productos-crud-oferta-presentaciones.md) |
| 2026-09-21 | Límite de imagen de producto: 60 MB en el wizard de alta | [2026-09-21-limite-imagen-producto-60mb.md](./2026-09-21-limite-imagen-producto-60mb.md) |
| 2026-09-21 | Header del panel: botón "Ver sitio" (pestaña nueva) + reloj junto al perfil | [2026-09-21-panel-ver-sitio-reloj.md](./2026-09-21-panel-ver-sitio-reloj.md) |
| 2026-09-16 | Editar usuario completo (nombre/correo/contraseña/roles) + varios roles por usuario | [2026-09-16-editar-usuario-multirol.md](./2026-09-16-editar-usuario-multirol.md) |
| 2026-09-16 | Usuarios del panel: tarjetas con foto + modal editar/habilitar/borrar | [2026-09-16-usuarios-tarjetas-modal.md](./2026-09-16-usuarios-tarjetas-modal.md) |
| 2026-09-16 | Animación de entrada solo en transiciones clave (admin, perfil, login/logout) | [2026-09-16-intro-solo-en-transiciones-clave.md](./2026-09-16-intro-solo-en-transiciones-clave.md) |
| 2026-09-16 | Área cliente: cualquier rol edita su perfil | [2026-09-16-editar-perfil.md](./2026-09-16-editar-perfil.md) |
| 2026-09-15 | Ajustes desglosado: Footer y Canales de atención | [2026-09-15-ajustes-footer-canales.md](./2026-09-15-ajustes-footer-canales.md) |
| 2026-09-15 | Categorías en cartas + imagen por URL/galería en todo el panel | [2026-09-15-categorias-cartas-imagenes.md](./2026-09-15-categorias-cartas-imagenes.md) |
| 2026-09-15 | Cursor personalizado: negro puro, blanco al pasar sobre imágenes | [2026-09-15-cursor-negro-blanco-imagenes.md](./2026-09-15-cursor-negro-blanco-imagenes.md) |
| 2026-09-15 | Banner azul/oro en cada pestaña del panel admin | [2026-09-15-admin-page-hero.md](./2026-09-15-admin-page-hero.md) |
| 2026-09-15 | CMS: footer editable, banners por página y equipo en cartas | [2026-09-15-cms-footer-banners-equipo.md](./2026-09-15-cms-footer-banners-equipo.md) |
| 2026-09-15 | Alta de producto: wizard de 4 fases + subir imágenes desde archivos/galería | [2026-09-15-wizard-producto-imagenes.md](./2026-09-15-wizard-producto-imagenes.md) |
| 2026-09-15 | Admin entra por “Mi cuenta”; Comparar sale de la barra; ícono Administrar | [2026-09-15-admin-login-tienda.md](./2026-09-15-admin-login-tienda.md) |
| 2026-09-15 | Login del panel valida contra Usuarios/Roles + cuenta THE WINTER | [2026-09-15-admin-login-usuarios.md](./2026-09-15-admin-login-usuarios.md) |
| 2026-09-15 | Panel admin: secciones Usuarios y Roles (permisos por sección, mock API) | [2026-09-15-admin-usuarios-roles.md](./2026-09-15-admin-usuarios-roles.md) |
| 2026-09-11 | `FRONTEND_DOCUMENTATION.md`: variables por componente + cómo conectar backend + manual de uso | [2026-09-11-frontend-documentation.md](./2026-09-11-frontend-documentation.md) |
| 2026-09-11 | Fix: categorías del alta de producto ahora pasan por `getCategories()` del mock | [2026-09-11-categorias-mock-api.md](./2026-09-11-categorias-mock-api.md) |
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
| 2026-09-10 | Bugs en Navbar/CategoriesGrid/ProductModal (de `main`, cerrados el 2026-09-11) | [2026-09-10-bugs-navbar-categorias-modal.md](./2026-09-10-bugs-navbar-categorias-modal.md) |
| 2026-09-10 | Bugs en el resto del proyecto: /login, boletín, favoritos/comparar, cursor (de `main`, cerrados el 2026-09-11) | [2026-09-10-bugs-resto-proyecto.md](./2026-09-10-bugs-resto-proyecto.md) |
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
