# Usuarios del panel: tarjetas con foto + modal de editar (habilitar/deshabilitar/borrar)

- **Fecha:** 2026-09-16
- **Solicitud:** que `/admin/usuarios` muestre cada usuario como una tarjeta (foto
  de perfil, rol, último acceso, nombre, correo, estado) y que al hacer clic en
  "Editar" se abra un modal con las opciones de habilitar/deshabilitar y borrar
  al usuario.
- **Archivos:** `components/admin/AdminUsersCards.tsx` (nuevo, reemplaza
  `AdminUsersTable.tsx`), `app/admin/(panel)/usuarios/page.tsx`,
  `services/adminApi.ts`, `app/admin/actions.ts`, `API_CONTRACT.md`.

## Qué había antes

`/admin/usuarios` era una tabla plana (Usuario / Rol / Último acceso / Estado)
con un `<select>` inline para cambiar el estado. No había foto, ni forma de
borrar una cuenta — solo activar/suspender.

## Código nuevo

Grilla de tarjetas (mismo patrón que `AdminCategoriesCards.tsx`): cada una con
`AccountAvatar` (foto real si el usuario ya la subió en `/cuenta/perfil` —
se lee de `chamo-profiles-v1` vía `parseProfiles()`, o iniciales si no tiene),
nombre, correo, badge de rol, badge de estado (verde/ámbar) y "Último acceso".
El botón **Editar** abre un modal (`createPortal`, `role="dialog"`) con:

- Rol, estado y último acceso en detalle.
- **Habilitar usuario** / **Deshabilitar usuario** (`updateUserStatusAction`).
- **Borrar usuario** (`deleteUserAction`, nuevo) con confirmación en dos pasos
  ("¿Seguro?" → "Sí, borrar" / "Cancelar") antes de llamar al mock.
- Si el usuario del modal es la **misma cuenta con sesión abierta**, ambos
  botones quedan deshabilitados con una nota explicando por qué (para no poder
  suspenderte o borrarte a ti mismo y quedar fuera del panel).

`services/adminApi.ts` suma `deleteUser(userId)` (mock, con el mismo
`// TODO Backend` que el resto) y `app/admin/actions.ts` su
`deleteUserAction`. `API_CONTRACT.md` documenta `DELETE /api/v1/users/:userId`.

El botón dorado "Nuevo usuario" del banner (`AdminPageHero`) seguía apuntando a
`#nuevo-usuario`, que antes hacía scroll a un formulario fijo debajo de la
tabla; ahora ese mismo hash abre el modal de alta (mismo patrón de
`AdminCategoriesCards`: un `useEffect` escucha `hashchange`).

**Ajuste de diseño (misma tarde):** el cliente mandó de referencia un carnet de
empleado (foto grande, nombre, puesto, franja de color arriba) y pidió que la
tarjeta se pareciera a eso. Primera pasada: sin QR ni reverso. La tarjeta quedó
con una franja superior `admin-page-hero` (mismo fondo de marca que ya usan los
banners del panel) con "CHAMO IMPORT" y el badge de estado, el avatar de 88px
superpuesto (`-mt-8`, borde blanco) como una foto de carnet, el rol como
pastilla azul debajo del nombre, y un divisor punteado antes de "Último
acceso".

**Reverso con volteo (misma tarde, segunda pasada):** el cliente pidió que sí
se pudiera voltear la tarjeta como en la referencia. Se agregó `UserBadgeCard`
(dentro de `AdminUsersCards.tsx`) con volteo 3D CSS puro (`app/globals.css`:
`.badge-flip` / `.badge-flip-inner` / `.badge-face` / `.badge-face-back`,
`perspective` + `rotateY(180deg)` + `backface-visibility: hidden`, sin
librería nueva; respeta `prefers-reduced-motion` igual que el resto del
sitio). Un botón circular (ícono `RotateCw`) junto a "Editar" voltea la
tarjeta; el reverso (fondo `brand-dark`) muestra **Rol** (nombre + descripción
+ cantidad de secciones habilitadas), **Contacto** (correo y, si lo cargó en
`/cuenta/perfil`, teléfono) y **Alta** (`createdAt`), con un botón "Volver"
(ícono `RotateCcw`) para regresar al frente. Sigue sin QR — no aportaba nada
funcional para un carnet interno de staff.

**Proporción vertical + logo + color por rol (misma tarde, tercera pasada):**
la tarjeta pasó de ~340×ancho-de-columna a `max-w-[240px] h-[440px]` (grilla
`sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, más columnas → cada tarjeta más
angosta) para parecerse a un carnet real. Donde decía el texto "Chamo Import"
ahora va el **logo oficial** (`LOGO_SRC` de `data/media.ts`) sobre una placa
blanca, tanto en el frente como en el reverso — así se lee bien encima de
cualquier color. La franja superior del frente ya no usa el fondo fijo
`admin-page-hero`: `roleBannerColor(roleId)` en `AdminUsersCards.tsx` hashea el
`id` del rol (estable aunque le cambien el nombre) contra una paleta fija de 8
colores (rojo, azul, verde, morado, naranja, turquesa, marino, fucsia) para
que **cada rol tenga siempre el mismo color** — Administrador salió azul
marino, Editor turquesa, Almacén naranja; si se crea un rol nuevo (p. ej.
"Gerente General") le toca un color de la misma paleta de forma automática y
consistente, sin tocar código.

**Grilla más junta, borde azul y logo más grande (misma tarde, cuarta pasada):**
`gap-5` → `gap-3` entre tarjetas; el borde pasó de `border border-brand-dark/10`
(gris apenas visible) a `border-2 border-brand-primary` (azul brillante) en
frente y reverso; el logo del frente creció de `h-6` a `h-9` y el del reverso
de `h-4` a `h-6`. La grilla ya no empieza en 1 columna: `grid-cols-2
lg:grid-cols-3 xl:grid-cols-4`, así en móvil se ven **2 tarjetas por fila**
desde el principio (antes era 1 columna hasta el punto de quiebre `sm:`).

## Verificación

Probado en vivo: las 4 cuentas semilla se ven en tarjetas (incluida la foto
personalizada que ya tenía THE WINTER desde `/cuenta/perfil`); editar Katia
Ríos → Deshabilitar → Habilitar refleja el badge al instante; el paso de
confirmación de borrar se prueba y se cancela (no se borró la cuenta demo);
editar la propia cuenta (THE WINTER) muestra ambos botones deshabilitados y el
clic no hace nada; voltear la tarjeta de THE WINTER muestra rol, descripción,
secciones habilitadas, correo, el teléfono guardado en `/cuenta/perfil` y la
fecha de alta, y "Volver" regresa al frente sin saltos; confirmado que
Administrador (THE WINTER/Admin Demo, mismo rol) siempre sale del mismo color,
y que Editor (Katia) y Almacén (Julio) salen en colores distintos entre sí y
del de Administrador. Probado también en viewport móvil (375px): las 4
tarjetas se ven de 2 en 2, sin volver a caer en 1 columna. `npm run lint`,
`npm run build` y `npm test` (28/28) en verde.

## Recomendación

- El backend real debería rechazar igual el auto-borrado/auto-suspensión por
  si el front se bypassea (nota ya en `API_CONTRACT.md`).
- Si se agrega edición de **rol** desde este mismo modal más adelante, seguir
  el mismo patrón de confirmación que "Borrar" para cambios sensibles
  (p. ej. quitarte permisos de Usuarios/Roles a ti mismo).
