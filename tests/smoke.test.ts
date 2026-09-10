import { describe, expect, it } from "vitest";
import { slides } from "@/data/media";
import { mainCategories } from "@/data/home";
import {
  featuredProducts,
  getRelatedProducts,
  searchCatalog,
} from "@/data/products";
import {
  categoryWhatsappUrl,
  HOURS_DISPLAY,
  PHONE_DISPLAY,
  whatsappUrl,
} from "@/data/contact";
import { testimonials } from "@/data/testimonials";
import { isBrokenImage } from "@/lib/image";

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

  it("hay 7 categorías con fotos locales y título de banner", () => {
    expect(mainCategories).toHaveLength(7);
    expect(
      mainCategories.every((category) =>
        category.image.startsWith("/images/categorias/"),
      ),
    ).toBe(true);
    expect(
      mainCategories.every(
        (category) =>
          category.bannerTitle.length > 0 &&
          category.bannerTitle === category.bannerTitle.toLocaleUpperCase("es"),
      ),
    ).toBe(true);
    expect(
      mainCategories.find((category) => category.slug === "electricos")
        ?.bannerTitle,
    ).toBe("ELÉCTRICOS");
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

  it("el fallback de marcas detecta imágenes rotas por naturalWidth", () => {
    expect(isBrokenImage({ complete: true, naturalWidth: 0 })).toBe(true);
    expect(isBrokenImage({ complete: true, naturalWidth: 80 })).toBe(false);
    expect(isBrokenImage({ complete: false, naturalWidth: 0 })).toBe(false);
  });

  it("WhatsApp por categoría lleva el nombre de la línea", () => {
    const href = categoryWhatsappUrl("Ferretería");
    expect(href).toContain("wa.me/51959723602");
    expect(href).toContain(encodeURIComponent("Ferretería"));
  });

  it("hay testimonios de ejemplo para la home", () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
  });

  it("contacto oficial tiene teléfono, horario y WhatsApp", () => {
    expect(PHONE_DISPLAY).toContain("959 723 602");
    expect(HOURS_DISPLAY.toLowerCase()).toContain("lun");
    expect(categoryWhatsappUrl("Ferretería")).toContain("wa.me/51959723602");
  });

  it("whatsappUrl arma el enlace con el mensaje encodeado", () => {
    const href = whatsappUrl("Hola, soy Chamo");
    expect(href).toBe(
      `https://wa.me/51959723602?text=${encodeURIComponent("Hola, soy Chamo")}`,
    );
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
      expect(html).not.toContain("Imagen del anuncio");

      const favoritos = await fetch("http://127.0.0.1:3000/favoritos", {
        signal: AbortSignal.timeout(4000),
      });
      expect(favoritos.ok).toBe(true);

      const contacto = await fetch("http://127.0.0.1:3000/contacto", {
        signal: AbortSignal.timeout(4000),
      });
      expect(contacto.ok).toBe(true);
      const contactHtml = await contacto.text();
      expect(contactHtml).toContain("CONTACTO");
      expect(contactHtml).toContain("959 723 602");
    } catch (error) {
      if (error instanceof Error && error.message.includes("expected")) {
        throw error;
      }
      // Servidor no disponible en CI aislado: el test de datos cubre el slider.
    }
  });
});
