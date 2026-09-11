"use client";

import PageBanner from "@/components/PageBanner";
import type { MainCategory } from "@/data/home";
import { categoryWhatsappUrl } from "@/data/contact";
import { useSiteContent } from "@/components/ContentProvider";

type CategoryBannerProps = {
  category: MainCategory;
  brands?: readonly string[];
};

export default function CategoryBanner({
  category,
  brands = [],
}: CategoryBannerProps) {
  const { categories } = useSiteContent();
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
        href: categoryWhatsappUrl(resolved.label),
        label: "Cotizar esta línea",
        external: true,
      }}
    />
  );
}
