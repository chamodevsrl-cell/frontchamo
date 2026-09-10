/** Datos de contacto reutilizados en Navbar, Footer, WhatsApp y páginas. */

export const COMPANY_NAME = "Chamo Import S.R.L.";

export const PHONE_DISPLAY = "+51 959 723 602";
export const PHONE_TEL = "+51959723602";
export const WHATSAPP_NUMBER = "51959723602";

/** Provisional: confirmar con el cliente antes de darlo por oficial. */
export const EMAIL = "ventas@chamoimport.com";

export const MAP_URL = "https://maps.app.goo.gl/mrh3WueTJErXS2sg6";
export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=-12.0530247,-77.0263088&z=17&output=embed";

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function categoryWhatsappUrl(categoryLabel: string) {
  return whatsappUrl(
    `Hola, quiero cotizar productos de la línea ${categoryLabel} al por mayor.`,
  );
}
