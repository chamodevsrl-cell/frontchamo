export type ProductSpec = {
  label: string;
  value: string;
};

export type FeaturedProduct = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  /** Slug de categoría (misma familia → relacionados) */
  category: string;
  categoryLabel: string;
  price: number;
  oldPrice: number;
  wholesalePrice: number;
  /** Porcentaje de descuento (0-100), no un monto. */
  discountPercent?: number;
  badge: "oferta" | "destacado";
  stock: number;
  /** Galería completa; `images[0]` es la imagen principal (no hay campo `image` aparte). */
  images: string[];
  description: string;
  features: string[];
  /** Ficha técnica (tabla del modal) */
  specs: ProductSpec[];
  packaging: {
    unidad: string;
    docena: string;
    caja: string;
  };
  warning: string;
};

export type CatalogFilters = {
  q?: string;
  category?: string;
  brand?: string;
};

const TOOL_IMAGES = [
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
  "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
  "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80",
] as const;

const DEFAULT_WARNING =
  "Verifique el contenido del empaque: unidad, docena o caja. El precio mayorista aplica según volumen.";

function gallery(seed: number): string[] {
  const start = seed % TOOL_IMAGES.length;
  return Array.from(
    { length: 5 },
    (_, i) => TOOL_IMAGES[(start + i) % TOOL_IMAGES.length],
  );
}

type ProductDraft = Omit<FeaturedProduct, "images" | "warning"> & {
  imageIndex: number;
  warning?: string;
};

const EXAMPLE_SPEC_FILL: ProductSpec[] = [
  { label: "Material", value: "Según ficha de ejemplo del SKU" },
  { label: "Dimensiones", value: "Según presentación mayorista (ficha de ejemplo)" },
  { label: "Peso aprox.", value: "Consultar empaque (ficha de ejemplo)" },
  { label: "País de origen", value: "Importación (ficha de ejemplo)" },
  { label: "Garantía", value: "Garantía de importador — ficha de ejemplo" },
];

const DIMENSION_ALIASES = new Set([
  "dimensiones",
  "tamaño",
  "longitud",
  "diámetro",
  "presentación",
  "ancho",
  "sección",
]);

export function fillExampleSpecs(specs: ProductSpec[]): ProductSpec[] {
  const labels = new Set(specs.map((spec) => spec.label.toLowerCase()));
  const hasDimensions = [...labels].some((label) => DIMENSION_ALIASES.has(label));
  const extra = EXAMPLE_SPEC_FILL.filter((spec) => {
    if (labels.has(spec.label.toLowerCase())) return false;
    if (spec.label === "Dimensiones" && hasDimensions) return false;
    return true;
  });
  return [...specs, ...extra];
}

function makeProduct(draft: ProductDraft): FeaturedProduct {
  const { imageIndex, warning, ...rest } = draft;
  return {
    ...rest,
    specs: fillExampleSpecs(rest.specs),
    images: gallery(imageIndex),
    warning: warning ?? DEFAULT_WARNING,
  };
}

export const featuredProducts: FeaturedProduct[] = [
  makeProduct({
    id: "1",
    name: 'Taladro percutor 1/2" 750W industrial',
    brand: "TRUPER",
    sku: "TRU-7821",
    category: "herramientas",
    categoryLabel: "Herramientas",
    price: 89.9,
    oldPrice: 105.0,
    wholesalePrice: 79.9,
    discountPercent: 14,
    badge: "oferta",
    stock: 45,
    imageIndex: 0,
    description:
      "Taladro percutor profesional para concreto, metal y madera. Ideal para obra y taller, con empuñadura ergonómica y mandril de 1/2\".",
    features: [
      "Potencia 750W / 2800 RPM",
      "Percusión para concreto",
      "Mandril metálico 13 mm",
      "Cable reforzado 2 m",
    ],
    specs: [
      { label: "Potencia", value: "750 W" },
      { label: "Velocidad", value: "0 – 2800 RPM" },
      { label: "Mandril", value: '1/2" (13 mm) metálico' },
      { label: "Percusión", value: "Sí (concreto)" },
      { label: "Cable", value: "2 m reforzado" },
      { label: "Uso", value: "Obra / taller industrial" },
    ],
    packaging: {
      unidad: "1 taladro + llave mandril",
      docena: "12 unidades (caja mayorista)",
      caja: "24 unidades por master box",
    },
  }),
  makeProduct({
    id: "2",
    name: 'Amoladora angular 4 1/2" 850W',
    brand: "BOSCH",
    sku: "BOS-GWS850",
    category: "herramientas",
    categoryLabel: "Herramientas",
    price: 219.9,
    oldPrice: 274.9,
    wholesalePrice: 199.9,
    discountPercent: 20,
    badge: "oferta",
    stock: 32,
    imageIndex: 1,
    description:
      "Amoladora compacta para corte y desbaste. Protector de disco y interruptor de seguridad para uso intensivo.",
    features: [
      'Disco 115 mm (4 1/2")',
      "850W de potencia",
      "Arranque suave",
      "Empuñadura auxiliar",
    ],
    specs: [
      { label: "Potencia", value: "850 W" },
      { label: "Disco", value: '115 mm (4 1/2")' },
      { label: "Arranque", value: "Suave" },
      { label: "Empuñadura", value: "Auxiliar incluida" },
      { label: "Uso", value: "Corte y desbaste" },
      { label: "Marca", value: "Bosch" },
    ],
    packaging: {
      unidad: "1 amoladora + protector",
      docena: "12 unidades",
      caja: "18 unidades por caja",
    },
  }),
  makeProduct({
    id: "3",
    name: "Juego de llaves mixtas 12 piezas",
    brand: "STANLEY",
    sku: "STA-12MIX",
    category: "ferreteria",
    categoryLabel: "Ferretería",
    price: 149.9,
    oldPrice: 179.9,
    wholesalePrice: 132.0,
    discountPercent: 17,
    badge: "destacado",
    stock: 60,
    imageIndex: 2,
    description:
      "Juego cromado de llaves mixtas métricas. Acabado durable y estuche organizado para ferretería y taller.",
    features: [
      "Medidas 8 a 19 mm",
      "Acero al cromo vanadio",
      "Estuche rígido incluido",
      "Boca abierta + estrella",
    ],
    specs: [
      { label: "Material", value: "Acero cromo vanadio" },
      { label: "Piezas", value: "12" },
      { label: "Medidas", value: "8 – 19 mm" },
      { label: "Acabado", value: "Cromado" },
      { label: "Tipo", value: "Mixta (abierta + estrella)" },
      { label: "Estuche", value: "Rígido incluido" },
    ],
    packaging: {
      unidad: "1 juego (12 pz)",
      docena: "12 juegos",
      caja: "24 juegos por caja",
    },
  }),
  makeProduct({
    id: "4",
    name: "Foco LED A60 9W luz fría E27",
    brand: "PHILIPS",
    sku: "PHI-A609W",
    category: "electricos",
    categoryLabel: "Electricidad",
    price: 12.5,
    oldPrice: 15.9,
    wholesalePrice: 9.9,
    discountPercent: 21,
    badge: "oferta",
    stock: 500,
    imageIndex: 3,
    description:
      "Foco LED eficiente para uso residencial y comercial. Bajo consumo y larga vida útil.",
    features: [
      "9W equivalente a 60W",
      "Luz fría 6500K",
      "Casquillo E27",
      "Vida útil ~15,000 h",
    ],
    specs: [
      { label: "Potencia", value: "9 W" },
      { label: "Equivalencia", value: "≈ 60 W incandescente" },
      { label: "Temperatura", value: "6500 K (luz fría)" },
      { label: "Casquillo", value: "E27" },
      { label: "Vida útil", value: "≈ 15,000 h" },
      { label: "Uso", value: "Residencial / comercial" },
    ],
    packaging: {
      unidad: "1 foco",
      docena: "12 focos",
      caja: "50 focos por caja",
    },
  }),
  makeProduct({
    id: "5",
    name: "Cinta aislante PVC 18 mm x 20 m",
    brand: "3M",
    sku: "3M-PVC1820",
    category: "electricos",
    categoryLabel: "Electricidad",
    price: 8.9,
    oldPrice: 11.5,
    wholesalePrice: 6.5,
    badge: "destacado",
    stock: 240,
    imageIndex: 4,
    description:
      "Cinta aislante de alta adherencia para instalaciones eléctricas. Resistente a humedad y temperatura.",
    features: [
      "Ancho 18 mm / largo 20 m",
      "Aislamiento hasta 600V",
      "Adhesivo de calidad",
      "Color negro",
    ],
    specs: [
      { label: "Ancho", value: "18 mm" },
      { label: "Largo", value: "20 m" },
      { label: "Material", value: "PVC" },
      { label: "Aislamiento", value: "Hasta 600 V" },
      { label: "Color", value: "Negro" },
      { label: "Marca", value: "3M" },
    ],
    packaging: {
      unidad: "1 rollo",
      docena: "12 rollos",
      caja: "100 rollos por caja",
    },
  }),
  makeProduct({
    id: "6",
    name: "Interruptor simple empotrable",
    brand: "BTICINO",
    sku: "BTI-INT01",
    category: "electricos",
    categoryLabel: "Electricidad",
    price: 18.9,
    oldPrice: 22.0,
    wholesalePrice: 15.5,
    discountPercent: 14,
    badge: "oferta",
    stock: 180,
    imageIndex: 5,
    description:
      "Interruptor unipolar de línea residencial. Montaje empotrado con placa incluida según kit.",
    features: [
      "10A / 250V",
      "Contactos de plata",
      "Diseño compacto",
      "Fácil instalación",
    ],
    specs: [
      { label: "Corriente", value: "10 A" },
      { label: "Voltaje", value: "250 V" },
      { label: "Tipo", value: "Unipolar empotrable" },
      { label: "Contactos", value: "Plata" },
      { label: "Montaje", value: "Empotrado" },
      { label: "Marca", value: "Bticino" },
    ],
    packaging: {
      unidad: "1 interruptor",
      docena: "12 unidades",
      caja: "60 unidades por caja",
    },
  }),
  makeProduct({
    id: "7",
    name: "Cable THW 2.5 mm² rollo 100 m",
    brand: "INDECO",
    sku: "IND-THW25",
    category: "electricos",
    categoryLabel: "Electricidad",
    price: 189.0,
    oldPrice: 220.0,
    wholesalePrice: 175.0,
    discountPercent: 14,
    badge: "oferta",
    stock: 28,
    imageIndex: 6,
    description:
      "Cable de cobre THW para instalaciones fijas. Cumple normas técnicas para uso residencial y comercial.",
    features: [
      "Sección 2.5 mm²",
      "Rollo 100 metros",
      "Aislamiento PVC",
      "Uso interior",
    ],
    specs: [
      { label: "Sección", value: "2.5 mm²" },
      { label: "Longitud", value: "100 m (rollo)" },
      { label: "Tipo", value: "THW cobre" },
      { label: "Aislamiento", value: "PVC" },
      { label: "Uso", value: "Interior / instalaciones fijas" },
      { label: "Marca", value: "Indeco" },
    ],
    packaging: {
      unidad: "1 rollo 100 m",
      docena: "12 rollos",
      caja: "No aplica (por pallet)",
    },
  }),
  makeProduct({
    id: "8",
    name: "Candado laminado 40 mm",
    brand: "STANLEY",
    sku: "STA-PAD40",
    category: "seguridad",
    categoryLabel: "Seguridad",
    price: 24.9,
    oldPrice: 29.9,
    wholesalePrice: 21.0,
    badge: "destacado",
    stock: 95,
    imageIndex: 7,
    description:
      "Candado laminado resistente a la corrosión. Ideal para portones, almacenes y herramientas.",
    features: [
      "Cuerpo 40 mm",
      "Arco endurecido",
      "2 llaves incluidas",
      "Acabado anticorrosivo",
    ],
    specs: [
      { label: "Tamaño", value: "40 mm" },
      { label: "Tipo", value: "Laminado" },
      { label: "Arco", value: "Endurecido" },
      { label: "Llaves", value: "2 incluidas" },
      { label: "Acabado", value: "Anticorrosivo" },
      { label: "Marca", value: "Stanley" },
    ],
    packaging: {
      unidad: "1 candado + 2 llaves",
      docena: "12 candados",
      caja: "48 candados por caja",
    },
  }),
  makeProduct({
    id: "9",
    name: "Atornillador inalámbrico 12V",
    brand: "BOSCH",
    sku: "BOS-GSR12",
    category: "herramientas",
    categoryLabel: "Herramientas",
    price: 259.0,
    oldPrice: 299.0,
    wholesalePrice: 239.0,
    discountPercent: 13,
    badge: "destacado",
    stock: 22,
    imageIndex: 0,
    description:
      "Atornillador compacto para ensamble y mantenimiento. Incluye batería y cargador según kit mayorista.",
    features: [
      "12V litio",
      "Portabrocas 10 mm",
      "Luz LED de trabajo",
      "2 velocidades",
    ],
    specs: [
      { label: "Voltaje", value: "12 V" },
      { label: "Portabrocas", value: "10 mm" },
      { label: "Velocidades", value: "2" },
      { label: "Batería", value: "Litio (kit)" },
      { label: "Uso", value: "Ensamble / mantenimiento" },
      { label: "Marca", value: "Bosch" },
    ],
    packaging: {
      unidad: "1 atornillador + batería",
      docena: "6 unidades (kit)",
      caja: "12 unidades por caja",
    },
  }),
  makeProduct({
    id: "10",
    name: "Juego de destornilladores 6 piezas",
    brand: "STANLEY",
    sku: "STA-DS06",
    category: "ferreteria",
    categoryLabel: "Ferretería",
    price: 39.9,
    oldPrice: 49.9,
    wholesalePrice: 34.5,
    discountPercent: 20,
    badge: "oferta",
    stock: 110,
    imageIndex: 2,
    description:
      "Juego plano y estrella para ferretería general. Mangos antideslizantes y puntas templadas.",
    features: [
      "3 planos + 3 estrella",
      "Acero templado",
      "Mango ergonómico",
      "Uso profesional",
    ],
    specs: [
      { label: "Piezas", value: "6" },
      { label: "Tipos", value: "Plano y Phillips" },
      { label: "Material", value: "Acero templado" },
      { label: "Mango", value: "Antideslizante" },
      { label: "Uso", value: "Ferretería / taller" },
      { label: "Marca", value: "Stanley" },
    ],
    packaging: {
      unidad: "1 juego (6 pz)",
      docena: "12 juegos",
      caja: "36 juegos por caja",
    },
  }),
  makeProduct({
    id: "11",
    name: "Cerradura de sobreponer 3 golpes",
    brand: "STANLEY",
    sku: "STA-CER3G",
    category: "ferreteria",
    categoryLabel: "Ferretería",
    price: 54.9,
    oldPrice: 64.9,
    wholesalePrice: 47.0,
    discountPercent: 15,
    badge: "destacado",
    stock: 70,
    imageIndex: 1,
    description:
      "Cerradura metálica de sobreponer para puertas de madera. Incluye 3 llaves según presentación.",
    features: [
      "3 golpes",
      "Cuerpo metálico",
      "3 llaves",
      "Instalación superficial",
    ],
    specs: [
      { label: "Tipo", value: "Sobreponer 3 golpes" },
      { label: "Material", value: "Acero" },
      { label: "Llaves", value: "3 incluidas" },
      { label: "Montaje", value: "Superficial" },
      { label: "Uso", value: "Puertas de madera" },
      { label: "Marca", value: "Stanley" },
    ],
    packaging: {
      unidad: "1 cerradura + 3 llaves",
      docena: "12 unidades",
      caja: "24 unidades por caja",
    },
  }),
  makeProduct({
    id: "12",
    name: "Casco de seguridad con suspensión",
    brand: "3M",
    sku: "3M-CASCO01",
    category: "seguridad",
    categoryLabel: "Seguridad",
    price: 32.9,
    oldPrice: 39.9,
    wholesalePrice: 27.5,
    discountPercent: 18,
    badge: "oferta",
    stock: 150,
    imageIndex: 6,
    description:
      "Casco dieléctrico para obra y almacén. Suspensión ajustable y ranura para accesorios.",
    features: [
      "Clase E dieléctrico",
      "Suspensión 4 puntos",
      "Ajuste de ruleta",
      "Color amarillo",
    ],
    specs: [
      { label: "Tipo", value: "Casco de seguridad" },
      { label: "Clase", value: "E (dieléctrico)" },
      { label: "Suspensión", value: "4 puntos" },
      { label: "Color", value: "Amarillo" },
      { label: "Uso", value: "Obra / industrial" },
      { label: "Marca", value: "3M" },
    ],
    packaging: {
      unidad: "1 casco",
      docena: "12 cascos",
      caja: "20 cascos por caja",
    },
  }),
  makeProduct({
    id: "13",
    name: "Guantes de nitrilo recubierto talla L",
    brand: "3M",
    sku: "3M-GNL",
    category: "seguridad",
    categoryLabel: "Seguridad",
    price: 14.5,
    oldPrice: 18.0,
    wholesalePrice: 11.9,
    discountPercent: 19,
    badge: "destacado",
    stock: 320,
    imageIndex: 7,
    description:
      "Guantes de trabajo con recubrimiento de nitrilo para agarre en seco y ligera humedad.",
    features: [
      "Talla L",
      "Palma nitrilo",
      "Dorso transpirable",
      "Uso general",
    ],
    specs: [
      { label: "Talla", value: "L" },
      { label: "Recubrimiento", value: "Nitrilo" },
      { label: "Par", value: "1 par" },
      { label: "Uso", value: "Manejo de materiales" },
      { label: "Norma (ejemplo)", value: "EN 388" },
      { label: "Marca", value: "3M" },
    ],
    packaging: {
      unidad: "1 par",
      docena: "12 pares",
      caja: "120 pares por caja",
    },
  }),
  makeProduct({
    id: "14",
    name: "Organizador de herramientas 15\"",
    brand: "STANLEY",
    sku: "STA-ORG15",
    category: "hogar",
    categoryLabel: "Hogar",
    price: 69.9,
    oldPrice: 84.9,
    wholesalePrice: 61.0,
    discountPercent: 18,
    badge: "oferta",
    stock: 40,
    imageIndex: 4,
    description:
      "Caja organizadora para el hogar y taller liviano. Compartimentos internos y cierre seguro.",
    features: [
      '15"',
      "Bandeja extraíble",
      "Cierre metálico",
      "Asa ergonómica",
    ],
    specs: [
      { label: "Tamaño", value: '15"' },
      { label: "Material", value: "Plástico reforzado" },
      { label: "Bandeja", value: "Extraíble" },
      { label: "Cierre", value: "Metálico" },
      { label: "Uso", value: "Hogar / taller" },
      { label: "Marca", value: "Stanley" },
    ],
    packaging: {
      unidad: "1 organizador",
      docena: "6 unidades",
      caja: "12 unidades por caja",
    },
  }),
  makeProduct({
    id: "15",
    name: "Manguera jardín 1/2\" x 20 m",
    brand: "TRUPER",
    sku: "TRU-MANG20",
    category: "hogar",
    categoryLabel: "Hogar",
    price: 44.9,
    oldPrice: 54.9,
    wholesalePrice: 38.0,
    discountPercent: 18,
    badge: "destacado",
    stock: 85,
    imageIndex: 5,
    description:
      "Manguera de 3 capas para riego doméstico. Incluye conectores básicos según kit.",
    features: [
      '1/2" x 20 m',
      "3 capas",
      "Refuerzo textil",
      "Uso residencial",
    ],
    specs: [
      { label: "Diámetro", value: '1/2"' },
      { label: "Longitud", value: "20 m" },
      { label: "Capas", value: "3" },
      { label: "Uso", value: "Riego residencial" },
      { label: "Conectores", value: "Kit básico" },
      { label: "Marca", value: "Truper" },
    ],
    packaging: {
      unidad: "1 manguera 20 m",
      docena: "6 unidades",
      caja: "12 unidades por caja",
    },
  }),
  makeProduct({
    id: "16",
    name: "Lámpara LED de escritorio 7W",
    brand: "PHILIPS",
    sku: "PHI-LAMP7",
    category: "hogar",
    categoryLabel: "Hogar",
    price: 79.9,
    oldPrice: 95.0,
    wholesalePrice: 69.0,
    discountPercent: 16,
    badge: "oferta",
    stock: 54,
    imageIndex: 3,
    description:
      "Lámpara de escritorio con brazo flexible y luz neutra. Ideal para hogar y oficina.",
    features: [
      "7W LED",
      "Brazo flexible",
      "Luz 4000K",
      "Base estable",
    ],
    specs: [
      { label: "Potencia", value: "7 W" },
      { label: "Temperatura", value: "4000 K" },
      { label: "Brazo", value: "Flexible" },
      { label: "Uso", value: "Escritorio / hogar" },
      { label: "Alimentación", value: "220 V" },
      { label: "Marca", value: "Philips" },
    ],
    packaging: {
      unidad: "1 lámpara",
      docena: "12 unidades",
      caja: "24 unidades por caja",
    },
  }),
  makeProduct({
    id: "17",
    name: "Disco de corte metal 4 1/2\"",
    brand: "TRUPER",
    sku: "TRU-DC115",
    category: "construccion",
    categoryLabel: "Construcción",
    price: 6.9,
    oldPrice: 8.5,
    wholesalePrice: 5.2,
    discountPercent: 19,
    badge: "oferta",
    stock: 400,
    imageIndex: 1,
    description:
      "Disco abrasivo para corte de metal en amoladora 4 1/2\". Consumible de alta rotación en obra.",
    features: [
      "115 x 1.0 x 22.2 mm",
      "Corte de metal",
      "Alta velocidad",
      "Uso en amoladora",
    ],
    specs: [
      { label: "Diámetro", value: "115 mm (4 1/2\")" },
      { label: "Espesor", value: "1.0 mm" },
      { label: "Orificio", value: "22.2 mm" },
      { label: "Material", value: "Metal" },
      { label: "RPM máx. (ejemplo)", value: "13,300" },
      { label: "Marca", value: "Truper" },
    ],
    packaging: {
      unidad: "1 disco",
      docena: "25 discos (pack)",
      caja: "100 discos por caja",
    },
  }),
  makeProduct({
    id: "18",
    name: "Nivel de aluminio 24\" 3 burbujas",
    brand: "STANLEY",
    sku: "STA-NIV24",
    category: "construccion",
    categoryLabel: "Construcción",
    price: 42.9,
    oldPrice: 52.0,
    wholesalePrice: 37.5,
    discountPercent: 17,
    badge: "destacado",
    stock: 66,
    imageIndex: 0,
    description:
      "Nivel de aluminio para obra y acabados. Tres burbujas para horizontal, vertical y 45°.",
    features: [
      '24"',
      "3 viales",
      "Cuerpo de aluminio",
      "Superficie fresada",
    ],
    specs: [
      { label: "Longitud", value: '24"' },
      { label: "Viales", value: "3" },
      { label: "Material", value: "Aluminio" },
      { label: "Uso", value: "Obra / acabados" },
      { label: "Precisión (ejemplo)", value: "0.5 mm/m" },
      { label: "Marca", value: "Stanley" },
    ],
    packaging: {
      unidad: "1 nivel",
      docena: "12 unidades",
      caja: "24 unidades por caja",
    },
  }),
  makeProduct({
    id: "19",
    name: "Cinta métrica 5 m x 19 mm",
    brand: "STANLEY",
    sku: "STA-CM5",
    category: "construccion",
    categoryLabel: "Construcción",
    price: 18.9,
    oldPrice: 23.5,
    wholesalePrice: 15.9,
    discountPercent: 20,
    badge: "oferta",
    stock: 210,
    imageIndex: 2,
    description:
      "Cinta métrica compacta para medición en obra. Freno y clip para cinturón.",
    features: [
      "5 m x 19 mm",
      "Cinta recubierta",
      "Freno de palanca",
      "Clip metálico",
    ],
    specs: [
      { label: "Longitud", value: "5 m" },
      { label: "Ancho de cinta", value: "19 mm" },
      { label: "Carcasa", value: "ABS" },
      { label: "Freno", value: "Palanca" },
      { label: "Uso", value: "Obra / taller" },
      { label: "Marca", value: "Stanley" },
    ],
    packaging: {
      unidad: "1 cinta",
      docena: "12 unidades",
      caja: "48 unidades por caja",
    },
  }),
  makeProduct({
    id: "20",
    name: "Rodillo de pintura 9\" con mango",
    brand: "TRUPER",
    sku: "TRU-ROD9",
    category: "pinturas",
    categoryLabel: "Pinturas",
    price: 16.9,
    oldPrice: 21.0,
    wholesalePrice: 13.5,
    discountPercent: 20,
    badge: "oferta",
    stock: 175,
    imageIndex: 7,
    description:
      "Rodillo de felpa para látex en interiores. Mango atornillable incluido.",
    features: [
      'Felpa 9"',
      "Pelo medio",
      "Mango incluido",
      "Uso interior",
    ],
    specs: [
      { label: "Ancho", value: '9"' },
      { label: "Felpa", value: "Pelo medio" },
      { label: "Uso", value: "Látex interior" },
      { label: "Mango", value: "Incluido" },
      { label: "Núcleo", value: "Plástico" },
      { label: "Marca", value: "Truper" },
    ],
    packaging: {
      unidad: "1 rodillo + mango",
      docena: "12 unidades",
      caja: "36 unidades por caja",
    },
  }),
  makeProduct({
    id: "21",
    name: "Pintura látex interior 1 galón blanco",
    brand: "SIKA",
    sku: "SIK-LAT1G",
    category: "pinturas",
    categoryLabel: "Pinturas",
    price: 64.9,
    oldPrice: 74.9,
    wholesalePrice: 57.0,
    discountPercent: 13,
    badge: "destacado",
    stock: 90,
    imageIndex: 5,
    description:
      "Látex lavable para interiores. Presentación de 1 galón, color blanco listo para aplicar.",
    features: [
      "1 galón",
      "Acabado mate",
      "Lavable",
      "Bajo olor",
    ],
    specs: [
      { label: "Presentación", value: "1 galón" },
      { label: "Color", value: "Blanco" },
      { label: "Acabado", value: "Mate" },
      { label: "Rendimiento (ejemplo)", value: "10–12 m²/galón" },
      { label: "Uso", value: "Interior" },
      { label: "Marca", value: "Sika" },
    ],
    packaging: {
      unidad: "1 galón",
      docena: "4 galones (pack)",
      caja: "4 galones por caja",
    },
  }),
  makeProduct({
    id: "22",
    name: "Thinner estándar galón",
    brand: "SIKA",
    sku: "SIK-THI1G",
    category: "pinturas",
    categoryLabel: "Pinturas",
    price: 28.9,
    oldPrice: 34.0,
    wholesalePrice: 24.5,
    discountPercent: 15,
    badge: "oferta",
    stock: 120,
    imageIndex: 4,
    description:
      "Disolvente para limpieza de herramientas y dilución según ficha del recubrimiento.",
    features: [
      "1 galón",
      "Uso general",
      "Tapa sellada",
      "Almacén ventilado",
    ],
    specs: [
      { label: "Presentación", value: "1 galón" },
      { label: "Tipo", value: "Thinner estándar" },
      { label: "Uso", value: "Limpieza / dilución" },
      { label: "Envase", value: "Metálico" },
      { label: "Almacenamiento", value: "Lugar ventilado" },
      { label: "Marca", value: "Sika" },
    ],
    packaging: {
      unidad: "1 galón",
      docena: "4 galones (pack)",
      caja: "4 galones por caja",
    },
  }),
];

export const homeFeaturedProducts = featuredProducts.slice(0, 8);

export function getProductById(id: string) {
  return featuredProducts.find((product) => product.id === id);
}

export function getProductsByCategory(category: string) {
  return featuredProducts.filter((product) => product.category === category);
}

export function getCategoryCollage(slug: string, limit = 4) {
  const products = getProductsByCategory(slug);
  return {
    images: products.slice(0, limit).map((product) => ({
      src: product.images[0],
      alt: product.name,
    })),
    brands: [...new Set(products.map((product) => product.brand))],
  };
}

export function getCatalogBrands() {
  return [...new Set(featuredProducts.map((product) => product.brand))].sort(
    (a, b) => a.localeCompare(b, "es"),
  );
}

export function searchCatalog({
  q = "",
  category = "",
  brand = "",
}: CatalogFilters = {}): FeaturedProduct[] {
  const query = q.trim().toLowerCase();
  const categorySlug = category.trim().toLowerCase();
  const brandName = brand.trim().toLowerCase();

  return featuredProducts.filter((product) => {
    if (categorySlug && product.category !== categorySlug) return false;
    if (brandName && product.brand.toLowerCase() !== brandName) return false;
    if (!query) return true;
    const haystack =
      `${product.name} ${product.brand} ${product.sku} ${product.categoryLabel} ${product.description}`.toLowerCase();
    return haystack.includes(query);
  });
}

/** Productos de la misma categoría (excluye el actual) */
export function getRelatedProducts(
  product: FeaturedProduct,
  limit = 4,
): FeaturedProduct[] {
  return featuredProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}
