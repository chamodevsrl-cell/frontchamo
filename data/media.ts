export type Slide = {
  id: number;
  /** Ruta en /public/images/slider/ — deja el archivo vacío o agrégalo después */
  src: string;
  alt: string;
  title: string;
  subtitle: string;
};

export const slides: Slide[] = [
  {
    id: 1,
    src: "/images/slider/baner%201.png",
    alt: "Anuncio 1",
    title: "Herramientas profesionales",
    subtitle: "Todo para tu ferretería y obra",
  },
  {
    id: 2,
    src: "/images/slider/baner%202.png",
    alt: "Anuncio 2",
    title: "Envíos a todo el Perú",
    subtitle: "Atención mayorista y distribuidores",
  },
  {
    id: 3,
    src: "/images/slider/baner%203.png",
    alt: "Anuncio 3",
    title: "Precios mayoristas",
    subtitle: "Calidad importada, stock listo",
  },
];

/** Logo del Navbar / Footer */
export const LOGO_SRC = "/images/logo/logo-chamo-import.png";

/** Icono del sitio (favicon) */
export const ICON_SRC = "/images/icon/logo-chamo-import.png";
