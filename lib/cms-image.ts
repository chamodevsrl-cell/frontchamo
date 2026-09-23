export const MAX_CMS_IMAGE_BYTES = 1.5 * 1024 * 1024;
export const MAX_PROFILE_IMAGE_BYTES = 2.5 * 1024 * 1024;
export const MAX_BANNER_IMAGE_BYTES = 3.5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGE_BYTES = 60 * 1024 * 1024;

/** Ayuda para el editor de marcas (usa MAX_CMS_IMAGE_BYTES vía CmsImageField). */
export const MAX_LOGO_IMAGE_HINT =
  "Mejor PNG o SVG con fondo transparente, horizontal y de hasta 1.5 MB.";

export function isCmsInlineSrc(src: string) {
  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

/**
 * Lee el archivo como data URL (base64) para guardarlo directo en el estado/CMS local.
 * TODO Backend: antes de conectar cualquier endpoint que reciba el resultado de esta función
 * (productos, perfil, CMS), subir el archivo a `POST /api/v1/uploads` y guardar la URL
 * devuelta en vez del data URL completo — ver API_CONTRACT_TIENDA.md §5 (no viable en
 * producción mandar 60 MB en base64 por imagen dentro de un JSON).
 */
export function readCmsImageFile(
  file: File,
  maxBytes = MAX_CMS_IMAGE_BYTES,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Elige un archivo de imagen."));
      return;
    }
    if (file.size > maxBytes) {
      const maxMb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
      reject(new Error(`La imagen supera ${maxMb} MB. Usa una más liviana.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}
