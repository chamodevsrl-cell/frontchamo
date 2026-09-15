const MAX_CMS_IMAGE_BYTES = 1.5 * 1024 * 1024;

export function isCmsInlineSrc(src: string) {
  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

export function readCmsImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Elige un archivo de imagen."));
      return;
    }
    if (file.size > MAX_CMS_IMAGE_BYTES) {
      reject(new Error("La imagen supera 1.5 MB. Usa una más liviana."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}
