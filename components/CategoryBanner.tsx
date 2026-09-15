"use client";

import PageBanner from "@/components/PageBanner";
import type { MainCategory } from "@/data/home";
import { useSiteContent } from "@/components/ContentProvider";
import { useCmsWhatsappHref } from "@/components/useCmsWhatsappHref";

type CategoryBannerProps = {
  category: MainCategory;
  brands?: readonly string[];
};

export default function CategoryBanner({
  category,
  brands = [],
}: CategoryBannerProps) {
  const { categories } = useSiteContent();
  const whatsappHref = useCmsWhatsappHref();
  const resolved =
    categories.find((item) => item.slug === category.slug) ?? category;

  return (
    <PageBanner
      title={resolved.bannerTitle}
      eyebrow={resolved.eyebrow}
      subtitle={resolved.bullets.join(" · ")}
      image={resolved.bannerImage ?? resolved.image}
      imageAlt={resolved.imageAlt}
      collageSlug={resolved.slug}
      crumbs={[
        { href: "/", label: "Inicio" },
        { href: "/categorias", label: "Categorías" },
        { label: resolved.label },
      ]}
      brands={brands}
      cta={{ href: "#productos-categoria", label: "Explorar ahora" }}
      ctaAlt={{
        href: whatsappHref(
          `Hola, quiero cotizar productos de la línea ${resolved.label} al por mayor.`,
        ),
        label: "Cotizar esta línea",
        external: true,
      }}
    />
  );
}
