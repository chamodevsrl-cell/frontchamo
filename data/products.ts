export type FeaturedProduct = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  oldPrice: number;
  wholesalePrice: number;
  discount?: number;
  badge: "oferta" | "destacado";
  stock: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  packaging: {
    unidad: string;
    docena: string;
    caja: string;
  };
  warning: string;
};

const TOOL_IMAGES = [
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
  "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  "https://images.unsplash.com/photo-1426927308491-6380b6a58064?w=800&q=80",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
  "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80",
] as const;

function gallery(seed: number): string[] {
  const start = seed % TOOL_IMAGES.length;
  return Array.from({ length: 5 }, (_, i) => TOOL_IMAGES[(start + i) % TOOL_IMAGES.length]);
}

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "1",
    name: "Taladro percutor 1/2\" 750W industrial",
    brand: "TRUPER",
    sku: "TRU-7821",
    price: 89.9,
    oldPrice: 105.0,
    wholesalePrice: 79.9,
    discount: 14,
    badge: "oferta",
    stock: 45,
    image: TOOL_IMAGES[0],
    images: gallery(0),
    description:
      "Taladro percutor profesional para concreto, metal y madera. Ideal para obra y taller, con empuñadura ergonómica y mandril de 1/2\".",
    features: [
      "Potencia 750W / 2800 RPM",
      "Percusión para concreto",
      "Mandril metálico 13 mm",
      "Cable reforzado 2 m",
    ],
    packaging: {
      unidad: "1 taladro + llave mandril",
      docena: "12 unidades (caja mayorista)",
      caja: "24 unidades por master box",
    },
    warning:
      "Verifique el contenido del empaque: unidad, docena o caja. El precio mayorista aplica según volumen.",
  },
  {
    id: "2",
    name: "Amoladora angular 4 1/2\" 850W",
    brand: "BOSCH",
    sku: "BOS-GWS850",
    price: 219.9,
    oldPrice: 274.9,
    wholesalePrice: 199.9,
    discount: 20,
    badge: "oferta",
    stock: 32,
    image: TOOL_IMAGES[1],
    images: gallery(1),
    description:
      "Amoladora compacta para corte y desbaste. Protector de disco y interruptor de seguridad para uso intensivo.",
    features: [
      "Disco 115 mm (4 1/2\")",
      "850W de potencia",
      "Arranque suave",
      "Empuñadura auxiliar",
    ],
    packaging: {
      unidad: "1 amoladora + protector",
      docena: "12 unidades",
      caja: "18 unidades por caja",
    },
    warning:
      "Confirme si su pedido es por unidad, docena o caja completa antes de despachar.",
  },
  {
    id: "3",
    name: "Juego de llaves mixtas 12 piezas",
    brand: "STANLEY",
    sku: "STA-12MIX",
    price: 149.9,
    oldPrice: 179.9,
    wholesalePrice: 132.0,
    discount: 17,
    badge: "destacado",
    stock: 60,
    image: TOOL_IMAGES[2],
    images: gallery(2),
    description:
      "Juego cromado de llaves mixtas métricas. Acabado durable y estuche organizado para ferretería y taller.",
    features: [
      "Medidas 8 a 19 mm",
      "Acero al cromo vanadio",
      "Estuche rígido incluido",
      "Boca abierta + estrella",
    ],
    packaging: {
      unidad: "1 juego (12 pz)",
      docena: "12 juegos",
      caja: "24 juegos por caja",
    },
    warning:
      "El contenido varía según presentación: unidad (1 juego), docena o caja master.",
  },
  {
    id: "4",
    name: "Foco LED A60 9W luz fría E27",
    brand: "PHILIPS",
    sku: "PHI-A609W",
    price: 12.5,
    oldPrice: 15.9,
    wholesalePrice: 9.9,
    discount: 21,
    badge: "oferta",
    stock: 500,
    image: TOOL_IMAGES[3],
    images: gallery(3),
    description:
      "Foco LED eficiente para uso residencial y comercial. Bajo consumo y larga vida útil.",
    features: [
      "9W equivalente a 60W",
      "Luz fría 6500K",
      "Casquillo E27",
      "Vida útil ~15,000 h",
    ],
    packaging: {
      unidad: "1 foco",
      docena: "12 focos",
      caja: "50 focos por caja",
    },
    warning:
      "Importante: pedidos mayoristas se despachan por docena o caja. Indique la presentación al cotizar.",
  },
  {
    id: "5",
    name: "Cinta aislante PVC 18 mm x 20 m",
    brand: "3M",
    sku: "3M-PVC1820",
    price: 8.9,
    oldPrice: 11.5,
    wholesalePrice: 6.5,
    badge: "destacado",
    stock: 240,
    image: TOOL_IMAGES[4],
    images: gallery(4),
    description:
      "Cinta aislante de alta adherencia para instalaciones eléctricas. Resistente a humedad y temperatura.",
    features: [
      "Ancho 18 mm / largo 20 m",
      "Aislamiento hasta 600V",
      "Adhesivo de calidad",
      "Color negro",
    ],
    packaging: {
      unidad: "1 rollo",
      docena: "12 rollos",
      caja: "100 rollos por caja",
    },
    warning:
      "Revise el empaque: unidad (rollo), docena o caja. No mezclar presentaciones en un mismo ítem.",
  },
  {
    id: "6",
    name: "Interruptor simple empotrable",
    brand: "BTICINO",
    sku: "BTI-INT01",
    price: 18.9,
    oldPrice: 22.0,
    wholesalePrice: 15.5,
    discount: 14,
    badge: "oferta",
    stock: 180,
    image: TOOL_IMAGES[5],
    images: gallery(5),
    description:
      "Interruptor unipolar de línea residencial. Montaje empotrado con placa incluida según kit.",
    features: [
      "10A / 250V",
      "Contactos de plata",
      "Diseño compacto",
      "Fácil instalación",
    ],
    packaging: {
      unidad: "1 interruptor",
      docena: "12 unidades",
      caja: "60 unidades por caja",
    },
    warning:
      "El contenido del pedido puede ser unidad, docena o caja. Confirme stock por presentación.",
  },
  {
    id: "7",
    name: "Cable THW 2.5 mm² rollo 100 m",
    brand: "INDECO",
    sku: "IND-THW25",
    price: 189.0,
    oldPrice: 220.0,
    wholesalePrice: 175.0,
    discount: 14,
    badge: "oferta",
    stock: 28,
    image: TOOL_IMAGES[6],
    images: gallery(6),
    description:
      "Cable de cobre THW para instalaciones fijas. Cumple normas técnicas para uso residencial y comercial.",
    features: [
      "Sección 2.5 mm²",
      "Rollo 100 metros",
      "Aislamiento PVC",
      "Uso interior",
    ],
    packaging: {
      unidad: "1 rollo 100 m",
      docena: "12 rollos",
      caja: "No aplica (por pallet)",
    },
    warning:
      "Venta por unidad (rollo), docena o volumen especial. Verifique metraje al recibir.",
  },
  {
    id: "8",
    name: "Candado laminado 40 mm",
    brand: "STANLEY",
    sku: "STA-PAD40",
    price: 24.9,
    oldPrice: 29.9,
    wholesalePrice: 21.0,
    badge: "destacado",
    stock: 95,
    image: TOOL_IMAGES[7],
    images: gallery(7),
    description:
      "Candado laminado resistente a la corrosión. Ideal para portones, almacenes y herramientas.",
    features: [
      "Cuerpo 40 mm",
      "Arco endurecido",
      "2 llaves incluidas",
      "Acabado anticorrosivo",
    ],
    packaging: {
      unidad: "1 candado + 2 llaves",
      docena: "12 candados",
      caja: "48 candados por caja",
    },
    warning:
      "Advertencia de contenido: indique si requiere unidad, docena o caja al momento de la compra.",
  },
];
