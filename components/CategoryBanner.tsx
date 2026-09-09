import PageBanner from "@/components/PageBanner";
import type { MainCategory } from "@/data/home";

type CategoryBannerProps = {
  category: MainCategory;
  brands?: readonly string[];
};

export default function CategoryBanner({
  category,
  brands = [],
}: CategoryBannerProps) {
  return (
    <PageBanner
      title={category.bannerTitle}
      eyebrow={category.eyebrow}
      subtitle={category.bullets.join(" · ")}
      image={category.bannerImage ?? category.image}
      imageAlt={category.imageAlt}
      crumbs={[
        { href: "/categorias", label: "Categorías" },
        { label: category.label },
      ]}
      brands={brands}
      cta={{ href: "#productos-categoria", label: "Explorar ahora" }}
    />
  );
}
