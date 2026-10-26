import { COMPANY_NAME } from "@/data/contact";

/** Ficha comercial oficial (SUNAT / requerimiento 2026-10-26). */
export const COMPANY_FOUNDED = 2013;
export const COMPANY_FOUNDED_DISPLAY = "18 de marzo de 2013";
export const COMPANY_CITY = "Lima, Perú";
export const COMPANY_RUC = "20552044895";
export const COMPANY_TYPE =
  "Sociedad Comercial de Responsabilidad Limitada";
export const COMPANY_SUNAT_STATUS = "Activo";
export const COMPANY_SUNAT_CONDITION = "Habido";
export const COMPANY_ACTIVITY =
  "Venta al por menor de artículos de ferretería";
export const COMPANY_YEARS_MARKET = 13;
export const COMPANY_CLIENTS_PER_DAY = 100;
export const COMPANY_DISPATCH_PROVINCES = "20–30";

export const NOSOTROS_BANNER_SRC = "/images/categorias/construccion.jpg";
export const NOSOTROS_BANNER_ALT =
  "Equipo y operaciones de Chamo Import en Lima";

export const companySites = [
  {
    id: "fiscal",
    label: "Dirección fiscal",
    address: "Jr. Andahuaylas N° 955 Int. 60",
    place: "Lima — Lima — Lima",
    pickup: true,
  },
  {
    id: "cusco",
    label: "Anexo",
    address: "Jr. Cusco N° 716 Int. 301",
    place: "Lima",
    pickup: true,
  },
  {
    id: "andahuaylas-929",
    label: "Anexo",
    address: "Jr. Andahuaylas N° 929 Int. 301",
    place: "Lima",
    pickup: true,
  },
] as const;

export const companyStats = [
  {
    id: "years",
    prefix: "+",
    value: String(COMPANY_YEARS_MARKET),
    suffix: "",
    label: "Años en el Mercado",
    hint: "Importación continua y directa",
    accentAll: false,
  },
  {
    id: "clients",
    prefix: "+",
    value: "100",
    suffix: "/día",
    label: "Clientes Atendidos",
    hint: "Ferreterías y distribuidores",
    accentAll: false,
  },
  {
    id: "dispatch",
    prefix: "",
    value: COMPANY_DISPATCH_PROVINCES,
    suffix: "",
    label: "Despachos a Provincia",
    hint: "Envíos diarios a todo el Perú",
    accentAll: false,
  },
  {
    id: "legal",
    prefix: "",
    value: "100%",
    suffix: "",
    label: "Facturación Legal",
    hint: `RUC ${COMPANY_RUC} verificado`,
    accentAll: true,
  },
] as const;

export const companyProfile = {
  name: COMPANY_NAME,
  headline: "Importamos y distribuimos para que tu ferretería no se quede sin stock.",
  story: `${COMPANY_NAME} (RUC ${COMPANY_RUC}) opera en ${COMPANY_CITY} desde el ${COMPANY_FOUNDED_DISPLAY}. Atendemos ferreterías, distribuidores y obras que necesitan precio por volumen, despacho a provincia y una sola conversación para armar el pedido. Compramos en caja, docena o pallet: el catálogo cubre ferretería, electricidad, seguridad, hogar, herramientas, construcción y pinturas. Más de ${COMPANY_YEARS_MARKET} años de trayectoria, contribuyente ${COMPANY_SUNAT_STATUS.toLowerCase()} y ${COMPANY_SUNAT_CONDITION.toLowerCase()}.`,
  highlights: [
    { label: "Desde", value: String(COMPANY_FOUNDED) },
    { label: "RUC", value: COMPANY_RUC },
    { label: "Sede", value: "Lima" },
    { label: "Cobertura", value: "Todo el Perú" },
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
