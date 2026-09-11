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

export type MainCategory = {
  slug: string;
  href: string;
  label: string;
  /** Título en el banner de `/categorias/[slug]` (mayúsculas, p. ej. ELÉCTRICOS) */
  bannerTitle: string;
  eyebrow: string;
  bullets: readonly [string, string, string];
  image: string;
  imageAlt: string;
  /**
   * Foto ancha del banner de detalle. Hoy reutiliza `image`; reemplazar por un
   * collage de marcas/productos de la línea cuando el cliente lo envíe.
   */
  bannerImage?: string;
  /** Fondo pastel suave de la tarjeta */
  tint: string;
};

/** Categorías destacadas del home (layout tipo “Explorar”) — fuente única del Navbar */
export const mainCategories: MainCategory[] = [
  {
    slug: "ferreteria",
    href: "/categorias/ferreteria",
    label: "Ferretería",
    bannerTitle: "FERRETERÍA",
    eyebrow: "Insumos al por mayor",
    bullets: ["Precio por volumen", "MOQ flexible", "Despacho nacional"],
    image: "/images/categorias/ferreteria.jpg",
    imageAlt: "Herramientas de ferretería en uso",
    tint: "#f3f5f7",
  },
  {
    slug: "electricos",
    href: "/categorias/electricos",
    label: "Electricidad",
    bannerTitle: "ELÉCTRICOS",
    eyebrow: "Material eléctrico",
    bullets: ["Cableado y protección", "Marcas confiables", "Soporte técnico"],
    image: "/images/categorias/electricidad.jpg",
    imageAlt: "Trabajo en tablero eléctrico",
    tint: "#f5f2ec",
  },
  {
    slug: "seguridad",
    href: "/categorias/seguridad",
    label: "Seguridad",
    bannerTitle: "SEGURIDAD",
    eyebrow: "EPP e industrial",
    bullets: ["Normas aplicables", "Stock continuo", "Asesoría de uso"],
    image: "/images/categorias/seguridad.jpg",
    imageAlt: "Trabajo industrial con equipo de seguridad",
    tint: "#eef2f6",
  },
  {
    slug: "hogar",
    href: "/categorias/hogar",
    label: "Hogar",
    bannerTitle: "HOGAR",
    eyebrow: "Para el día a día",
    bullets: ["Importación directa", "Stock listo", "Asesoría comercial"],
    image: "/images/categorias/hogar.jpg",
    imageAlt: "Productos para el hogar",
    tint: "#f6f0f2",
  },
  {
    slug: "herramientas",
    href: "/categorias/herramientas",
    label: "Herramientas",
    bannerTitle: "HERRAMIENTAS",
    eyebrow: "Eléctricas y manuales",
    bullets: ["Marcas líderes", "Garantía mayorista", "Stock rotativo"],
    image: "/images/categorias/herramientas.jpg",
    imageAlt: "Herramientas eléctricas profesionales",
    tint: "#eef6f2",
  },
  {
    slug: "construccion",
    href: "/categorias/construccion",
    label: "Construcción",
    bannerTitle: "CONSTRUCCIÓN",
    eyebrow: "Obra y acabados",
    bullets: ["Materiales de obra", "Despacho a obra", "Cotización rápida"],
    image: "/images/categorias/construccion.jpg",
    imageAlt: "Sitio de construcción",
    tint: "#f4f1ea",
  },
  {
    slug: "pinturas",
    href: "/categorias/pinturas",
    label: "Pinturas",
    bannerTitle: "PINTURAS",
    eyebrow: "Acabados y color",
    bullets: ["Línea profesional", "Volúmenes mayoristas", "Asesoría de color"],
    image: "/images/categorias/pinturas.jpg",
    imageAlt: "Pintura y acabados",
    tint: "#f2f0f7",
  },
];

export function getCategoryBySlug(slug: string) {
  return mainCategories.find((category) => category.slug === slug);
}

/** Logos en public/images/marcas/ */
export const distributorBrands = [
  { id: "indeco", name: "INDECO", src: "/images/marcas/indeco.svg" },
  { id: "bticino", name: "BTICINO", src: "/images/marcas/bticino.svg" },
  { id: "3m", name: "3M", src: "/images/marcas/3m.svg" },
  { id: "sika", name: "SIKA", src: "/images/marcas/sika.svg" },
  { id: "artesco", name: "ARTESCO", src: "/images/marcas/artesco.svg" },
  { id: "ledvance", name: "LEDVANCE", src: "/images/marcas/ledvance.svg" },
  { id: "schneider", name: "SCHNEIDER", src: "/images/marcas/schneider.svg" },
  { id: "stanley", name: "STANLEY", src: "/images/marcas/stanley.svg" },
  { id: "truper", name: "TRUPER", src: "/images/marcas/truper.svg" },
  { id: "philips", name: "PHILIPS", src: "/images/marcas/philips.svg" },
] as const;
