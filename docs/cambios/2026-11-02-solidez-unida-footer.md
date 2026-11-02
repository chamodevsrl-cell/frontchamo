# Solidez en Cifras unida al footer

- **Fecha:** 2026-11-02
- **Solicitud:** Juntar la franja de cifras con el footer, divididas por una línea amarilla fina que llegue casi a los extremos.
- **Archivos:** `components/CompanyStats.tsx`
- **Commit:** (local)

## Qué había antes

`mb-12/16/20` dejaba un hueco gris entre Solidez en Cifras y el footer (ambos `brand-dark`).

## Código nuevo

Sin margen inferior. Debajo de las cifras, una raya `brand-gold` de 1px casi a todo el ancho (`max-w-[1600px]`, con el mismo padding lateral del footer).

## Recomendación

Solo afecta el home (ahí vive `CompanyStats`). El resto de páginas sigue con el footer suelto.
