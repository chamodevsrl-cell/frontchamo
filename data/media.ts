export type Slide = {
  id: number;
  /** Ruta en /public/images/slider/ — deja el archivo vacío o agrégalo después */
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  /** Si el banner ya trae texto en la imagen, no superponer título */
  fullBleed?: boolean;
};

export const slides: Slide[] = [
  {
    id: 1,
    src: "/images/slider/baner 1.png",
    alt: "Campaña navideña Chamo Import",
    title: "Campaña navideña",
    subtitle: "Regala herramientas, construye grandes proyectos.",
    fullBleed: true,
  },
  {
    id: 2,
    src: "/images/slider/baner 2.png",
    alt: "Anuncio 2",
    title: "Envíos a todo el Perú",
    subtitle: "Atención mayorista y distribuidores",
  },
  {
    id: 3,
    src: "/images/slider/baner 3.png",
    alt: "Anuncio 3",
    title: "Precios mayoristas",
    subtitle: "Calidad importada, stock listo",
  },
];

/** Logo del Navbar / Footer */
export const LOGO_SRC = "/images/logo/logo-chamo-import.png";

/** Icono del sitio (favicon) */
export const ICON_SRC = "/images/icon/logo-chamo-import.png";
