import { COMPANY_NAME, EMAIL, PHONE_DISPLAY } from "@/data/contact";

export const LEGAL_UPDATED = "9 de septiembre de 2026";

export const TERMS_PARAGRAPHS = [
  `Este sitio es un catálogo mayorista de ${COMPANY_NAME}. Los precios, stock y fichas técnicas publicados son referenciales hasta confirmar disponibilidad y condiciones comerciales.`,
  `Las solicitudes de cotización (formulario o WhatsApp) no constituyen una orden de compra. El pedido se confirma cuando ${COMPANY_NAME} emite una cotización o proforma aceptada por el cliente.`,
  "El uso del catálogo implica no copiar contenidos, imágenes o datos de productos con fines distintos a evaluar una compra mayorista.",
  `Para consultas: ${EMAIL} / ${PHONE_DISPLAY}.`,
] as const;

export const PRIVACY_PARAGRAPHS = [
  `${COMPANY_NAME} recolecta los datos que usted envía en el formulario de cotización o por WhatsApp (nombre, empresa, RUC, teléfono, correo y detalle del pedido) solo para atender la solicitud comercial.`,
  "No vendemos esas listas. El mensaje se abre en WhatsApp bajo su control; el boletín del pie de página es una suscripción voluntaria y aún no está conectado a un proveedor de correo.",
  `Para acceder, corregir o retirar sus datos, escriba a ${EMAIL}.`,
] as const;
