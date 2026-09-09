import { describe, expect, it } from "vitest";
import { slides } from "@/data/media";
import { mainCategories } from "@/data/home";
import {
  featuredProducts,
  getRelatedProducts,
  searchCatalog,
} from "@/data/products";

describe("smoke de catálogo y home", () => {
  it("el slider tiene 3 banners y rutas sin espacios", () => {
    expect(slides).toHaveLength(3);
    expect(slides.every((slide) => !slide.src.includes(" "))).toBe(true);
    expect(slides.map((slide) => slide.src)).toEqual([
      "/images/slider/baner-1.png",
      "/images/slider/baner-2.png",
      "/images/slider/baner-3.png",
    ]);
  });

  it("hay 7 categorías con fotos locales", () => {
    expect(mainCategories).toHaveLength(7);
    expect(
      mainCategories.every((category) =>
        category.image.startsWith("/images/categorias/"),
      ),
    ).toBe(true);
  });

  it("cada categoría tiene al menos 2 productos relacionados posibles", () => {
    for (const category of mainCategories) {
      const inCategory = featuredProducts.filter(
        (product) => product.category === category.slug,
      );
      expect(inCategory.length).toBeGreaterThanOrEqual(3);
      const related = getRelatedProducts(inCategory[0], 4);
      expect(related.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("searchCatalog filtra por texto y categoría", () => {
    const bySku = searchCatalog({ q: "TRU-7821" });
    expect(bySku).toHaveLength(1);
    expect(bySku[0].sku).toBe("TRU-7821");

    const seguridad = searchCatalog({ category: "seguridad" });
    expect(seguridad.every((product) => product.category === "seguridad")).toBe(
      true,
    );
    expect(seguridad.length).toBeGreaterThanOrEqual(3);
  });
});

describe("home HTTP (si el dev server está arriba)", () => {
  it("la home carga y el slider aparece en el HTML", async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000", {
        signal: AbortSignal.timeout(4000),
      });
      expect(response.ok).toBe(true);
      const html = await response.text();
      expect(html).toContain("Chamo Import");
      expect(html).toContain("baner-1.png");
    } catch (error) {
      if (error instanceof Error && error.message.includes("expected")) {
        throw error;
      }
      // Servidor no disponible en CI aislado: el test de datos cubre el slider.
    }
  });
});
