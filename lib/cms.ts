import { mainCategories, type MainCategory } from "@/data/home";
import { slides as defaultSlides, type Slide } from "@/data/media";

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

export type CmsState = {
  slides: CmsSlideOverride[];
  categories: CmsCategoryOverride[];
};

export const emptyCmsState: CmsState = { slides: [], categories: [] };

export function parseCms(raw: string | null): CmsState {
  if (!raw) return emptyCmsState;
  try {
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    return {
      slides: Array.isArray(parsed.slides) ? parsed.slides.filter(isSlideOverride) : [],
      categories: Array.isArray(parsed.categories)
        ? parsed.categories.filter(isCategoryOverride)
        : [],
    };
  } catch {
    return emptyCmsState;
  }
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

export function mergeCategories(
  defaults: readonly MainCategory[] = mainCategories,
  overrides: CmsCategoryOverride[] = [],
): MainCategory[] {
  return defaults.map((category) => {
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
}
