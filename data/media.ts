export type Slide = {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const slides: Slide[] = [
  {
    id: 1,
    src: "/images/slider/baner-1.png",
    alt: "Campaña navideña Chamo Import",
    width: 1983,
    height: 793,
  },
  {
    id: 2,
    src: "/images/slider/baner-2.png",
    alt: "Herramientas profesionales DeWalt y Bosch",
    width: 2170,
    height: 725,
  },
  {
    id: 3,
    src: "/images/slider/baner-3.png",
    alt: "Envíos Chamo Import a toda la sierra del Perú",
    width: 2170,
    height: 725,
  },
];

/** Logo del Navbar / Footer */
export const LOGO_SRC = "/images/logo/logo-chamo-import.png";

/** Icono del sitio (favicon) */
export const ICON_SRC = "/images/icon/logo-chamo-import.png";
