export const trustItems = [
  {
    id: "envios",
    title: "Envíos a todo el Perú",
    subtitle: "Rápidos y seguros.",
    icon: "truck" as const,
  },
  {
    id: "mayorista",
    title: "Venta mayorista",
    subtitle: "Precios especiales por volumen.",
    icon: "package" as const,
  },
  {
    id: "pagos",
    title: "Yape / Plin / Tarjetas",
    subtitle: "Paga como prefieras.",
    icon: "wallet" as const,
  },
  {
    id: "distribuidores",
    title: "Atención a distribuidores",
    subtitle: "Asesoría personalizada.",
    icon: "users" as const,
  },
] as const;

export const mainCategories = [
  {
    href: "/categorias/herramientas-electricas",
    label: "Herramientas eléctricas",
    accent: "#127EC9",
  },
  {
    href: "/categorias/herramientas-manuales",
    label: "Herramientas manuales",
    accent: "#0B3554",
  },
  {
    href: "/categorias/ferreteria",
    label: "Ferretería",
    accent: "#127EC9",
  },
  {
    href: "/categorias/electricos",
    label: "Eléctricos",
    accent: "#E4B714",
  },
  {
    href: "/categorias/tuberias",
    label: "Tuberías y conexiones",
    accent: "#0B3554",
  },
  {
    href: "/categorias/pinturas",
    label: "Pinturas",
    accent: "#127EC9",
  },
  {
    href: "/categorias/seguridad",
    label: "Seguridad industrial",
    accent: "#0B3554",
  },
  {
    href: "/categorias/construccion",
    label: "Construcción",
    accent: "#127EC9",
  },
  {
    href: "/categorias/agricola",
    label: "Agrícola",
    accent: "#E4B714",
  },
] as const;

/** Logos en public/images/marcas/ — nombres de archivo sugeridos */
export const distributorBrands = [
  { id: "indeco", name: "INDECO", src: "/images/marcas/indeco.png" },
  { id: "bticino", name: "BTICINO", src: "/images/marcas/bticino.png" },
  { id: "3m", name: "3M", src: "/images/marcas/3m.png" },
  { id: "sika", name: "SIKA", src: "/images/marcas/sika.png" },
  { id: "artesco", name: "ARTESCO", src: "/images/marcas/artesco.png" },
  { id: "ledvance", name: "LEDVANCE", src: "/images/marcas/ledvance.png" },
  { id: "schneider", name: "SCHNEIDER", src: "/images/marcas/schneider.png" },
  { id: "stanley", name: "STANLEY", src: "/images/marcas/stanley.png" },
  { id: "truper", name: "TRUPER", src: "/images/marcas/truper.png" },
  { id: "philips", name: "PHILIPS", src: "/images/marcas/philips.png" },
] as const;
