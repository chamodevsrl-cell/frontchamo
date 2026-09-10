/** Datos de contacto reutilizados en Navbar, Footer, WhatsApp y páginas. */

export const COMPANY_NAME = "Chamo Import S.R.L.";

export const PHONE_DISPLAY = "+51 959 723 602";
export const PHONE_TEL = "+51959723602";
export const WHATSAPP_NUMBER = "51959723602";

/** Provisional: confirmar con el cliente antes de darlo por oficial. */
export const EMAIL = "ventas@chamoimport.com";

export const ADDRESS_DISPLAY = "Lima, Perú";
export const ADDRESS_HINT =
  "Coordinamos visita y despacho. Abre el mapa para la ubicación.";
export const HOURS_DISPLAY = "Lun - Sáb 8:00am a 6:00pm";
export const HOURS_HINT = "Atención mayorista y distribuidores";

export const MAP_URL = "https://maps.app.goo.gl/mrh3WueTJErXS2sg6";
export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=-12.0530247,-77.0263088&z=17&output=embed";

export const CONTACT_BANNER_SRC = "/images/categorias/herramientas.jpg";
export const CONTACT_BANNER_ALT =
  "Atención mayorista de Chamo Import — herramientas y despacho";

/** Placeholders de redes hasta confirmar perfiles oficiales. */
export const SOCIAL_LINKS = [
  { id: "facebook", href: "https://facebook.com", label: "Facebook" },
  { id: "instagram", href: "https://instagram.com", label: "Instagram" },
  { id: "youtube", href: "https://youtube.com", label: "YouTube" },
] as const;

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function categoryWhatsappUrl(categoryLabel: string) {
  return whatsappUrl(
    `Hola, quiero cotizar productos de la línea ${categoryLabel} al por mayor.`,
  );
}
