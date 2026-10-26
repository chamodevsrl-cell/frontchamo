# Solidez en Cifras + ficha comercial oficial

- **Fecha:** 2026-10-26
- **Solicitud:** Poner debajo de testimonios una sección tipo “Solidez en Cifras” con los datos de la ficha de requerimiento (RUC, trayectoria, sedes, horario).
- **Archivos:** `components/CompanyStats.tsx`, `app/page.tsx`, `data/company.ts`, `data/contact.ts`
- **Commit:** (local)

## Qué había antes

El home terminaba en testimonios. `company.ts` decía fundación 2016 (placeholder). Horario del footer: Lun–Sáb 8:00am–6:00pm. Dirección genérica “Lima, Perú”.

## Código nuevo

Franja `brand-dark` a todo el ancho bajo testimonios, con `mb-12/16/20` para no pegarse al footer: +13 años, +100 clientes/día, 20–30 despachos a provincia, 100% facturación legal (RUC 20552044895). Dirección fiscal Jr. Andahuaylas 955 Int. 60. Horario Lun–Sáb 9–19; domingos/feriados 11–18 (el “6am” de la ficha se tomó como 6pm).

## Recomendación

Si el CMS local (`chamo-cms-v1`) ya guardó el horario viejo en el navegador, hay que re-guardar Footer en `/admin/ajustes/footer` o borrar esa clave. El mapa sigue el pin anterior hasta confirmar coordenadas de Andahuaylas 955.
