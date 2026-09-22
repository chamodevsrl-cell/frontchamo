import { CONTACT_BANNER_ALT, CONTACT_BANNER_SRC } from "@/data/contact";
import { NOSOTROS_BANNER_ALT, NOSOTROS_BANNER_SRC } from "@/data/company";

export const PAGE_BANNER_IDS = [
  "nosotros",
  "contacto",
  "ofertas",
  "catalogo",
] as const;

export type PageBannerId = (typeof PAGE_BANNER_IDS)[number];

export type PageBannerSeed = {
  id: PageBannerId;
  label: string;
  href: string;
  src: string;
  alt: string;
};

export const pageBannerCatalog: readonly PageBannerSeed[] = [
  {
    id: "nosotros",
    label: "Nosotros",
    href: "/nosotros",
    src: NOSOTROS_BANNER_SRC,
    alt: NOSOTROS_BANNER_ALT,
  },
  {
    id: "contacto",
    label: "Contacto",
    href: "/contacto",
    src: CONTACT_BANNER_SRC,
    alt: CONTACT_BANNER_ALT,
  },
  {
    id: "ofertas",
    label: "Ofertas",
    href: "/ofertas",
    src: "/images/categorias/pinturas.jpg",
    alt: "Ofertas y descuentos mayoristas de Chamo Import",
  },
  {
    id: "catalogo",
    label: "Catálogo",
    href: "/catalogo",
    src: "/images/categorias/ferreteria.jpg",
    alt: "Catálogo mayorista de ferretería e importaciones",
  },
];
