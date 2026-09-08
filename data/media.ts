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
    alt: "Herramientas profesionales DeWalt y Bosch",
    title: "Herramientas profesionales",
    subtitle: "Marcas líderes para obra y ferretería",
    fullBleed: true,
  },
  {
    id: 3,
    src: "/images/slider/baner 3.png",
    alt: "Envíos Chamo Import a toda la sierra del Perú",
    title: "Envíos a todo el Perú",
    subtitle: "Llevamos tus productos a toda la sierra",
    fullBleed: true,
  },
];

/** Logo del Navbar / Footer */
export const LOGO_SRC = "/images/logo/logo-chamo-import.png";

/** Icono del sitio (favicon) */
export const ICON_SRC = "/images/icon/logo-chamo-import.png";
