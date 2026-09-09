import { COMPANY_NAME } from "@/data/contact";

/** Perfil de empresa de ejemplo (textos placeholder hasta ficha oficial del cliente). */
export const COMPANY_FOUNDED = 2016;
export const COMPANY_CITY = "Lima, Perú";

export const NOSOTROS_BANNER_SRC = "/images/categorias/construccion.jpg";
export const NOSOTROS_BANNER_ALT =
  "Equipo y operaciones de Chamo Import en Lima";

export const companyProfile = {
  name: COMPANY_NAME,
  headline: "Importamos y distribuimos para que tu ferretería no se quede sin stock.",
  story: `${COMPANY_NAME} nació en ${COMPANY_CITY} como un mayorista de ferretería e importaciones. Atendemos ferreterías, distribuidores y obras que necesitan precio por volumen, despacho a provincia y una sola conversación para armar el pedido. Compramos en caja, docena o pallet: el catálogo cubre ferretería, electricidad, seguridad, hogar, herramientas, construcción y pinturas.`,
  highlights: [
    { label: "Desde", value: String(COMPANY_FOUNDED) },
    { label: "Sede", value: "Lima" },
    { label: "Cobertura", value: "Todo el Perú" },
    { label: "Canal", value: "Mayorista" },
  ],
};

export const companyMission =
  "Abastecer a ferreterías y distribuidores con mercadería de rotación, precios claros por volumen y una atención que resuelve el pedido — no que lo complica.";

export const companyVision =
  "Ser el aliado mayorista de referencia en el Perú para ferretería, electricidad, herramientas y obra: stock predecible, marcas confiables y una cotización que llega el mismo día.";

export const companyValues = [
  {
    title: "Volumen real",
    text: "Trabajamos para quien compra por caja, docena o pallet. El precio mayorista no es un adorno.",
  },
  {
    title: "Despacho nacional",
    text: "Lima es la base; la sierra y provincia entran en la misma conversación de cotización.",
  },
  {
    title: "Línea completa",
    text: "Ferretería, eléctricos, seguridad, hogar, herramientas, construcción y pinturas en un solo catálogo.",
  },
] as const;
