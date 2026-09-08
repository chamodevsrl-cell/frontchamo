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
  href: string;
  label: string;
  eyebrow: string;
  bullets: readonly [string, string, string];
  image: string;
  imageAlt: string;
  /** Fondo pastel suave de la tarjeta */
  tint: string;
};

/** Categorías destacadas del home (layout tipo “Explorar”) */
export const mainCategories: MainCategory[] = [
  {
    href: "/categorias/ferreteria",
    label: "Ferretería",
    eyebrow: "Insumos al por mayor",
    bullets: ["Precio por volumen", "MOQ flexible", "Despacho nacional"],
    image:
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
    imageAlt: "Herramientas de ferretería en uso",
    tint: "#f3f5f7",
  },
  {
    href: "/categorias/electricos",
    label: "Electricidad",
    eyebrow: "Material eléctrico",
    bullets: ["Cableado y protección", "Marcas confiables", "Soporte técnico"],
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
    imageAlt: "Trabajo en tablero eléctrico",
    tint: "#f5f2ec",
  },
  {
    href: "/categorias/seguridad",
    label: "Seguridad",
    eyebrow: "EPP e industrial",
    bullets: ["Normas aplicables", "Stock continuo", "Asesoría de uso"],
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
    imageAlt: "Trabajo industrial con equipo de seguridad",
    tint: "#eef2f6",
  },
  {
    href: "/categorias/hogar",
    label: "Hogar",
    eyebrow: "Para el día a día",
    bullets: ["Importación directa", "Stock listo", "Asesoría comercial"],
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    imageAlt: "Productos para el hogar",
    tint: "#f6f0f2",
  },
];

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
