# Nuevo apartado "Dashboard" en la documentación técnica

- **Fecha:** 2026-09-11
- **Solicitud:** "Documenta todo lo nuevo, crea un nuevo apartado de documentación llamado 'dashboard document' dentro de toda la documentación técnica donde se vea cómo se creó, cómo funciona y las credenciales para ingresar."
- **Archivos:** `docs/MANUAL.md`
- **Commit:** (pendiente al momento de escribir esta nota)

## Qué había antes

El panel `/admin` (v2, sesión propia + contrato de backend) ya estaba documentado,
pero repartido: un resumen corto en `A.5c Panel de administración`, un par de líneas
en `CLAUDE.md`, y el detalle técnico de los endpoints en `API_CONTRACT.md` (pensado
para el desarrollador de backend, no como referencia general del panel). No había un
solo lugar que explicara, junto, cómo se construyó, cómo funciona hoy y con qué
credenciales se entra.

## Código nuevo

Se agregó **`A.12 🎛️ Dashboard — Panel de administración`** en `docs/MANUAL.md`
(Parte A, técnica), con seis subsecciones:

- **A.12.1** Qué es.
- **A.12.2** Cómo se creó — las dos etapas (v1 admin liviano ligado a la cuenta de la
  tienda → v2 panel completo con sesión propia) y la tabla de archivos clave.
- **A.12.3** Cómo funciona — el flujo de login → cookie → layout protegido →
  `AdminShell`, y una tabla de qué secciones del sidebar son reales (Dashboard,
  Productos, Pedidos, Banners, Categorías) y cuáles siguen siendo placeholder (Marcas,
  Clientes, Inventario, Ofertas, Reportes, Configuración).
- **A.12.4** Credenciales para ingresar — `admin@local.test` / `admin123`, con el
  aviso de que es una cuenta mock a borrar cuando el login real esté conectado.
- **A.12.5** Aclara que la sesión del panel (`lib/auth.ts`) y la cuenta de la tienda
  (`lib/auth-local.ts`) son dos sistemas distintos — punto de confusión frecuente.
- **A.12.6** Cómo conectar el backend real, resumiendo `API_CONTRACT.md`.

`A.5c` (el resumen corto que ya existía) se dejó como está, solo con un enlace al
nuevo A.12 para no duplicar el detalle.

## Recomendación

- Cuando el backend real reemplace el mock, actualizar A.12.4 (quitar las
  credenciales de prueba) y la tabla de A.12.3 (columna "Estado").
- Si se completan las secciones placeholder (Marcas, Clientes, etc.), sumarlas a la
  tabla de A.12.3 como ✅ Real.
