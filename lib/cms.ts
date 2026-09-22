import {
  ADDRESS_DISPLAY,
  ADDRESS_HINT,
  EMAIL,
  HOURS_DISPLAY,
  HOURS_HINT,
  MAP_EMBED_URL,
  MAP_URL,
  PHONE_DISPLAY,
  SOCIAL_LINKS,
} from "@/data/contact";
import { mainCategories, type MainCategory } from "@/data/home";
import { slides as defaultSlides, type Slide } from "@/data/media";
import {
  pageBannerCatalog,
  PAGE_BANNER_IDS,
  type PageBannerId,
} from "@/data/page-banners";
import { defaultTeam, type TeamMember } from "@/data/team";

export const CMS_KEY = "chamo-cms-v1";

export type CmsSlideOverride = {
  id: number;
  alt?: string;
  src?: string;
  hidden?: boolean;
};

export type CmsCategoryOverride = {
  slug: string;
  label?: string;
  eyebrow?: string;
  bullets?: [string, string, string];
  image?: string;
  imageAlt?: string;
  bannerTitle?: string;
};

export type CmsCustomCategory = {
  slug: string;
  label: string;
  eyebrow: string;
  image: string;
  imageAlt?: string;
  bannerTitle?: string;
  bullets?: [string, string, string];
  tint?: string;
};

export type CmsPaymentMethod = {
  id: string;
  label: string;
  hint: string;
  image: string;
};

export type CmsFooter = {
  tagline: string;
  address: string;
  addressHint: string;
  phone: string;
  /** Número del botón flotante y de cotizaciones. Si queda vacío, se usa `phone`. */
  whatsapp: string;
  email: string;
  hours: string;
  hoursHint: string;
  mapUrl: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  newsletterBlurb: string;
  paymentMethods: CmsPaymentMethod[];
};

export type CmsPageBannerOverride = {
  id: PageBannerId;
  src?: string;
  alt?: string;
  hidden?: boolean;
};

export type CmsTeamMember = TeamMember;

/** Imagen de la franja de ofertas (/ofertas) que enlaza a un producto o a una URL. */
export type CmsOfferBannerTile = {
  id: string;
  image: string;
  alt: string;
  /** `FeaturedProduct.id` (data/products.ts) al que lleva esta imagen. */
  productId: string;
  /**
   * URL o ruta destino (p. ej. `/categorias/electricos`, `https://wa.me/…`).
   * Si viene con contenido, gana sobre `productId` — la imagen navega ahí en
   * vez de abrir el modal del producto.
   */
  url: string;
  /** Texto sobre la imagen; si queda vacío se usa el nombre del producto. */
  label: string;
};

export type CmsState = {
  slides: CmsSlideOverride[];
  categories: CmsCategoryOverride[];
  customCategories: CmsCustomCategory[];
  footer: CmsFooter;
  pageBanners: CmsPageBannerOverride[];
  team: CmsTeamMember[];
  offerBanner: CmsOfferBannerTile[];
};

export type ResolvedPageBanner = {
  id: PageBannerId;
  label: string;
  href: string;
  src: string;
  alt: string;
  hidden: boolean;
};

const DEFAULT_PAYMENTS: CmsPaymentMethod[] = [
  { id: "visa", label: "Visa", hint: "Crédito / Débito", image: "" },
  { id: "mastercard", label: "Mastercard", hint: "Crédito / Débito", image: "" },
  { id: "yape", label: "Yape", hint: "Billetera digital", image: "" },
  { id: "plin", label: "Plin", hint: "Billetera digital", image: "" },
];

export function defaultFooter(): CmsFooter {
  const social = Object.fromEntries(
    SOCIAL_LINKS.map((item) => [item.id, item.href]),
  ) as Record<string, string>;
  return {
    tagline:
      "Tu aliado en cada proyecto. Ferretería e importaciones mayoristas para distribuidores en todo el Perú.",
    address: ADDRESS_DISPLAY,
    addressHint: ADDRESS_HINT,
    phone: PHONE_DISPLAY,
    whatsapp: PHONE_DISPLAY,
    email: EMAIL,
    hours: HOURS_DISPLAY,
    hoursHint: HOURS_HINT,
    mapUrl: MAP_URL,
    mapEmbedUrl: MAP_EMBED_URL,
    facebookUrl: social.facebook ?? "https://facebook.com",
    instagramUrl: social.instagram ?? "https://instagram.com",
    youtubeUrl: social.youtube ?? "https://youtube.com",
    newsletterBlurb: "Suscríbete a nuestro boletín",
    paymentMethods: DEFAULT_PAYMENTS.map((item) => ({ ...item })),
  };
}

export const emptyCmsState: CmsState = {
  slides: [],
  categories: [],
  customCategories: [],
  footer: defaultFooter(),
  pageBanners: [],
  team: defaultTeam.map((member) => ({ ...member })),
  offerBanner: [],
};

export function parseCms(raw: string | null): CmsState {
  if (!raw) return cloneCms(emptyCmsState);
  try {
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    return {
      slides: Array.isArray(parsed.slides)
        ? parsed.slides.filter(isSlideOverride)
        : [],
      categories: Array.isArray(parsed.categories)
        ? parsed.categories.filter(isCategoryOverride)
        : [],
      customCategories: Array.isArray(parsed.customCategories)
        ? parsed.customCategories.filter(isCustomCategory)
        : [],
      footer: mergeFooter(defaultFooter(), parsed.footer),
      pageBanners: Array.isArray(parsed.pageBanners)
        ? parsed.pageBanners.filter(isPageBannerOverride)
        : [],
      team: Array.isArray(parsed.team)
        ? parsed.team.filter(isTeamMember)
        : defaultTeam.map((member) => ({ ...member })),
      offerBanner: Array.isArray(parsed.offerBanner)
        ? parsed.offerBanner.filter(isOfferBannerTile).map((tile) => ({
            id: tile.id,
            image: tile.image,
            productId: typeof tile.productId === "string" ? tile.productId : "",
            url: typeof tile.url === "string" ? tile.url : "",
            alt: typeof tile.alt === "string" ? tile.alt : "",
            label: typeof tile.label === "string" ? tile.label : "",
          }))
        : [],
    };
  } catch {
    return cloneCms(emptyCmsState);
  }
}

export function cloneCms(state: CmsState): CmsState {
  return JSON.parse(JSON.stringify(state)) as CmsState;
}

function isSlideOverride(value: unknown): value is CmsSlideOverride {
  return !!value && typeof (value as CmsSlideOverride).id === "number";
}

function isCategoryOverride(value: unknown): value is CmsCategoryOverride {
  return (
    !!value &&
    typeof (value as CmsCategoryOverride).slug === "string" &&
    (value as CmsCategoryOverride).slug.length > 0
  );
}

function isCustomCategory(value: unknown): value is CmsCustomCategory {
  const item = value as CmsCustomCategory;
  return (
    !!item &&
    typeof item.slug === "string" &&
    item.slug.length > 0 &&
    typeof item.label === "string" &&
    typeof item.image === "string"
  );
}

function isPageBannerId(value: unknown): value is PageBannerId {
  return (
    typeof value === "string" &&
    (PAGE_BANNER_IDS as readonly string[]).includes(value)
  );
}

function isPageBannerOverride(value: unknown): value is CmsPageBannerOverride {
  return !!value && isPageBannerId((value as CmsPageBannerOverride).id);
}

function isTeamMember(value: unknown): value is CmsTeamMember {
  const member = value as CmsTeamMember;
  return (
    !!member &&
    typeof member.id === "string" &&
    member.id.length > 0 &&
    typeof member.name === "string" &&
    typeof member.role === "string" &&
    typeof member.photo === "string"
  );
}

function isOfferBannerTile(value: unknown): value is CmsOfferBannerTile {
  const tile = value as CmsOfferBannerTile;
  return (
    !!tile &&
    typeof tile.id === "string" &&
    tile.id.length > 0 &&
    typeof tile.image === "string"
  );
}

function isPaymentMethod(value: unknown): value is CmsPaymentMethod {
  const method = value as CmsPaymentMethod;
  return (
    !!method &&
    typeof method.id === "string" &&
    method.id.length > 0 &&
    typeof method.label === "string"
  );
}

export function mergeFooter(
  defaults: CmsFooter,
  override: Partial<CmsFooter> | undefined,
): CmsFooter {
  if (!override) return defaults;
  const payments = Array.isArray(override.paymentMethods)
    ? override.paymentMethods.filter(isPaymentMethod).map((method) => ({
        id: method.id,
        label: method.label,
        hint: typeof method.hint === "string" ? method.hint : "",
        image: typeof method.image === "string" ? method.image : "",
      }))
    : defaults.paymentMethods;
  return {
    tagline: pickText(override.tagline, defaults.tagline),
    address: pickText(override.address, defaults.address),
    addressHint: pickText(override.addressHint, defaults.addressHint),
    phone: pickText(override.phone, defaults.phone),
    whatsapp: typeof override.whatsapp === "string" ? override.whatsapp : "",
    email: pickText(override.email, defaults.email),
    hours: pickText(override.hours, defaults.hours),
    hoursHint: pickText(override.hoursHint, defaults.hoursHint),
    mapUrl: pickText(override.mapUrl, defaults.mapUrl),
    mapEmbedUrl: pickText(override.mapEmbedUrl, defaults.mapEmbedUrl),
    facebookUrl: pickText(override.facebookUrl, defaults.facebookUrl),
    instagramUrl: pickText(override.instagramUrl, defaults.instagramUrl),
    youtubeUrl: pickText(override.youtubeUrl, defaults.youtubeUrl),
    newsletterBlurb: pickText(override.newsletterBlurb, defaults.newsletterBlurb),
    paymentMethods: payments.length > 0 ? payments : defaults.paymentMethods,
  };
}

function pickText(value: string | undefined, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function mergeSlides(
  defaults: readonly Slide[] = defaultSlides,
  overrides: CmsSlideOverride[] = [],
): Slide[] {
  const visible = defaults.flatMap((slide) => {
    const over = overrides.find((item) => item.id === slide.id);
    if (over?.hidden) return [];
    return [
      {
        ...slide,
        alt: over?.alt?.trim() || slide.alt,
        src: over?.src?.trim() || slide.src,
      },
    ];
  });
  return visible.length > 0 ? visible : [...defaults];
}

export function customCategoryToMain(item: CmsCustomCategory): MainCategory {
  const bullets = item.bullets?.filter(Boolean);
  return {
    slug: item.slug,
    href: `/categorias/${item.slug}`,
    label: item.label,
    bannerTitle:
      item.bannerTitle?.trim().toLocaleUpperCase("es") ||
      item.label.toLocaleUpperCase("es"),
    eyebrow: item.eyebrow?.trim() || item.label,
    bullets:
      bullets && bullets.length === 3
        ? (bullets as [string, string, string])
        : ["Línea mayorista", "Stock de rotación", "Cotiza por WhatsApp"],
    image: item.image,
    imageAlt: item.imageAlt?.trim() || item.label,
    tint: item.tint || "#e8f3fb",
  };
}

export function mergeCategories(
  defaults: readonly MainCategory[] = mainCategories,
  overrides: CmsCategoryOverride[] = [],
  extras: CmsCustomCategory[] = [],
): MainCategory[] {
  const mapped = defaults.map((category) => {
    const over = overrides.find((item) => item.slug === category.slug);
    if (!over) return category;
    const bullets = over.bullets?.map((bullet) => bullet.trim()).filter(Boolean);
    return {
      ...category,
      label: over.label?.trim() || category.label,
      eyebrow: over.eyebrow?.trim() || category.eyebrow,
      bullets:
        bullets && bullets.length === 3
          ? (bullets as [string, string, string])
          : category.bullets,
      image: over.image?.trim() || category.image,
      imageAlt: over.imageAlt?.trim() || category.imageAlt,
      bannerTitle:
        over.bannerTitle?.trim().toLocaleUpperCase("es") || category.bannerTitle,
    };
  });
  const known = new Set(mapped.map((item) => item.slug));
  const extraMapped = extras
    .filter((item) => !known.has(item.slug))
    .map(customCategoryToMain);
  return [...mapped, ...extraMapped];
}

export function mergePageBanners(
  overrides: CmsPageBannerOverride[] = [],
): ResolvedPageBanner[] {
  return pageBannerCatalog.map((item) => {
    const over = overrides.find((entry) => entry.id === item.id);
    return {
      id: item.id,
      label: item.label,
      href: item.href,
      src: over?.src?.trim() || item.src,
      alt: over?.alt?.trim() || item.alt,
      hidden: over?.hidden ?? false,
    };
  });
}

export function visibleTeam(members: CmsTeamMember[]): CmsTeamMember[] {
  return members.filter((member) => !member.hidden);
}

export function phoneDigits(display: string) {
  return display.replace(/\D/g, "");
}

export function phoneToTel(display: string) {
  const digits = phoneDigits(display);
  if (!digits) return "";
  if (digits.startsWith("51")) return `+${digits}`;
  return `+51${digits}`;
}

export function phoneToWhatsapp(display: string) {
  const digits = phoneDigits(display);
  if (!digits) return "";
  return digits.startsWith("51") ? digits : `51${digits}`;
}

export function footerWhatsapp(footer: CmsFooter) {
  return footer.whatsapp.trim() || footer.phone;
}

export function cmsWhatsappUrl(phone: string, text: string) {
  const number = phoneToWhatsapp(phone);
  if (!number) return `https://wa.me/?text=${encodeURIComponent(text)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Abre WhatsApp con gesto de usuario (evita el popup blocker). */
export function openCmsWhatsapp(footer: CmsFooter, text: string) {
  if (typeof document === "undefined") return;
  const href = cmsWhatsappUrl(footerWhatsapp(footer), text);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function footerSocialLinks(footer: CmsFooter) {
  return [
    { id: "facebook" as const, href: footer.facebookUrl.trim(), label: "Facebook" },
    { id: "instagram" as const, href: footer.instagramUrl.trim(), label: "Instagram" },
    { id: "youtube" as const, href: footer.youtubeUrl.trim(), label: "YouTube" },
  ].filter((item) => item.href.length > 0);
}

export function slugifyLabel(label: string): string {
  const base = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "categoria";
}

export function uniqueCategorySlug(
  label: string,
  taken: Iterable<string>,
): string {
  const used = new Set(taken);
  const base = slugifyLabel(label);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
