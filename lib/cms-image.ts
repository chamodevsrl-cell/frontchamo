export const MAX_CMS_IMAGE_BYTES = 1.5 * 1024 * 1024;
export const MAX_PROFILE_IMAGE_BYTES = 2.5 * 1024 * 1024;
export const MAX_BANNER_IMAGE_BYTES = 3.5 * 1024 * 1024;

export function isCmsInlineSrc(src: string) {
  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

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
