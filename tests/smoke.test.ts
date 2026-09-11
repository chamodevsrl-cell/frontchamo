import { describe, expect, it } from "vitest";
import { slides } from "@/data/media";
import { mainCategories } from "@/data/home";
import {
  featuredProducts,
  getCategoryCollage,
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

  it("cada SKU tiene ficha de ejemplo con origen y garantía", () => {
    for (const product of featuredProducts) {
      const labels = product.specs.map((spec) => spec.label.toLowerCase());
      expect(labels.some((label) => label.includes("origen"))).toBe(true);
      expect(labels.some((label) => label.includes("garantía"))).toBe(true);
    }
  });

  it("el collage de categoría usa productos y marcas de esa línea", () => {
    const collage = getCategoryCollage("herramientas");
    expect(collage.images.length).toBeGreaterThanOrEqual(2);
    expect(collage.brands.length).toBeGreaterThan(0);
  });

  it("mergeCms oculta banners y pisa textos de categoría", async () => {
    const { mergeSlides, mergeCategories } = await import("@/lib/cms");
    const mergedSlides = mergeSlides(undefined, [{ id: 1, hidden: true }]);
    expect(mergedSlides.every((slide) => slide.id !== 1)).toBe(true);
    const categories = mergeCategories(undefined, [
      { slug: "ferreteria", label: "Ferretería VIP" },
    ]);
    expect(
      categories.find((category) => category.slug === "ferreteria")?.label,
    ).toBe("Ferretería VIP");
  });

  it("hash de cuenta local es determinista con el mismo salt", async () => {
    const { hashPassword, createAccount } = await import("@/lib/auth-local");
    const first = await hashPassword("secret1", "abc");
    const second = await hashPassword("secret1", "abc");
    expect(first).toBe(second);
    const created = await createAccount([], {
      name: "Chamo",
      email: "chamo@example.com",
      password: "secret1",
    });
    expect(created.ok).toBe(true);
    if (created.ok) {
      expect(created.account.role).toBe("admin");
      expect(created.account.id).toBeTruthy();
    }

    const customer = await createAccount(
      created.ok ? [created.account] : [],
      {
        name: "Cliente",
        email: "cliente@example.com",
        password: "secret1",
      },
    );
    expect(customer.ok).toBe(true);
    if (customer.ok && created.ok) {
      expect(customer.account.role).toBe("customer");
      expect(customer.account.id).toBeTruthy();
      expect(customer.account.id).not.toBe(created.account.id);
    }
  });

  it("migra cuentas viejas sin role: la primera es admin", async () => {
    const { parseAccounts, hydrateSessionUser } = await import("@/lib/auth-local");
    const migrated = parseAccounts(
      JSON.stringify([
        {
          name: "Chamo",
          email: "chamo@example.com",
          salt: "abc",
          passwordHash: "def",
        },
        {
          name: "Otro",
          email: "otro@example.com",
          salt: "abc",
          passwordHash: "def",
        },
      ]),
    );
    expect(migrated[0]?.role).toBe("admin");
    expect(migrated[1]?.role).toBe("customer");
    const session = hydrateSessionUser(
      {
        id: "stale-id-from-before-the-id-field-existed",
        name: "Chamo",
        email: "chamo@example.com",
        role: "customer",
      },
      migrated,
    );
    expect(session?.role).toBe("admin");
    expect(session?.id).toBe(migrated[0]?.id);
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

  it("el dashboard admin tiene gráfica de 7 días y ranking demo", async () => {
    const { adminSalesLast7Days, adminTopProducts } = await import("@/data/admin");
    expect(adminSalesLast7Days).toHaveLength(7);
    expect(adminTopProducts.length).toBe(5);
    expect(adminTopProducts.every((item) => item.image && item.unitsSold > 0)).toBe(
      true,
    );
  });
});

describe("contrato admin (tipos + mock API + sesión)", () => {
  it("parseAdminSession acepta JSON plano y encodeURIComponent", async () => {
    const { parseAdminSession, serializeAdminSession, encodeAdminSessionCookie } =
      await import("@/lib/auth");
    const session = {
      id: "usr_1",
      name: "Admin Demo",
      email: "admin@local.test",
      role: "admin" as const,
      token: "tok_test",
    };
    expect(parseAdminSession(serializeAdminSession(session))).toEqual(session);
    expect(parseAdminSession(encodeAdminSessionCookie(session))).toEqual(session);
    expect(parseAdminSession("no-json")).toBeNull();
    expect(parseAdminSession(null)).toBeNull();
  });

  it("loginAdmin solo acepta las credenciales mock", async () => {
    const { loginAdmin, AdminApiError, MOCK_ADMIN_EMAIL, MOCK_ADMIN_PASSWORD } =
      await import("@/services/adminApi");
    const session = await loginAdmin({
      email: MOCK_ADMIN_EMAIL,
      password: MOCK_ADMIN_PASSWORD,
    });
    expect(session.email).toBe(MOCK_ADMIN_EMAIL);
    expect(session.role).toBe("admin");
    expect(session.token.length).toBeGreaterThan(0);
    await expect(
      loginAdmin({ email: MOCK_ADMIN_EMAIL, password: "wrong-password" }),
    ).rejects.toBeInstanceOf(AdminApiError);
  });

  it("getDashboardKPIs expone las 4 cifras del contrato", async () => {
    const { getDashboardKPIs } = await import("@/services/adminApi");
    const kpis = await getDashboardKPIs();
    expect(Object.keys(kpis).sort()).toEqual(
      ["lowStockCount", "newClientsCount", "pendingOrders", "totalSales"].sort(),
    );
    expect(kpis.totalSales).toBeGreaterThan(0);
    expect(kpis.pendingOrders).toBeGreaterThanOrEqual(0);
    expect(kpis.lowStockCount).toBeGreaterThanOrEqual(0);
    expect(kpis.newClientsCount).toBeGreaterThanOrEqual(0);
  });

  it("getCategories devuelve el contrato Category completo", async () => {
    const { getCategories } = await import("@/services/adminApi");
    const categories = await getCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
      expect(typeof category.id).toBe("string");
      expect(typeof category.name).toBe("string");
      expect(typeof category.subcategoriesCount).toBe("number");
      expect(["active", "hidden"]).toContain(category.status);
      expect(typeof category.image).toBe("string");
    }
  });

  it("getProducts filtra por q y createProduct agrega un SKU", async () => {
    const { getProducts, createProduct } = await import("@/services/adminApi");
    const bySku = await getProducts({ q: "TRU-7821" });
    expect(bySku).toHaveLength(1);
    expect(bySku[0]?.sku).toBe("TRU-7821");
    expect(bySku[0]?.categoryId).toBeTruthy();
    expect(Array.isArray(bySku[0]?.images)).toBe(true);

    const created = await createProduct({
      sku: "TST-ADMIN-0001",
      name: "SKU de prueba admin",
      brand: "DEMO",
      categoryId: "ferreteria",
      subcategoryId: "ferreteria-general",
      price: 10,
      stock: 5,
      minStock: 2,
      status: "active",
      images: ["/logo.png"],
      descriptionShort: "Corto",
      descriptionFull: "Largo",
      isFeatured: false,
    });
    expect(created.id).toMatch(/^prd_/);
    expect(created.createdAt).toMatch(/T/);
    const found = await getProducts({ q: "TST-ADMIN-0001" });
    expect(found.some((item) => item.sku === "TST-ADMIN-0001")).toBe(true);
  });

  it("getOrders y updateOrderStatus cambian el estado", async () => {
    const { getOrders, updateOrderStatus } = await import("@/services/adminApi");
    const pending = await getOrders("pending");
    expect(pending.length).toBeGreaterThan(0);
    const first = pending[0];
    if (!first) throw new Error("se esperaba un pedido pending");
    const updated = await updateOrderStatus(first.id, "confirmed");
    expect(updated.status).toBe("confirmed");
    const confirmed = await getOrders("confirmed");
    expect(confirmed.some((order) => order.id === first.id)).toBe(true);
    await updateOrderStatus(first.id, "pending");
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

      const comparar = await fetch("http://127.0.0.1:3000/comparar", {
        signal: AbortSignal.timeout(4000),
      });
      expect(comparar.ok).toBe(true);

      const contacto = await fetch("http://127.0.0.1:3000/contacto", {
        signal: AbortSignal.timeout(4000),
      });
      expect(contacto.ok).toBe(true);
      const contactHtml = await contacto.text();
      expect(contactHtml).toContain("CONTACTO");
      expect(contactHtml).toContain("959 723 602");

      const admin = await fetch("http://127.0.0.1:3000/admin", {
        signal: AbortSignal.timeout(4000),
        redirect: "manual",
      });
      expect([307, 302, 303, 308]).toContain(admin.status);
      expect(admin.headers.get("location") ?? "").toContain("/admin/login");

      const login = await fetch("http://127.0.0.1:3000/admin/login", {
        signal: AbortSignal.timeout(4000),
      });
      expect(login.ok).toBe(true);
      const loginHtml = await login.text();
      expect(loginHtml).toMatch(/Panel de administración|admin@local.test/);
    } catch (error) {
      if (error instanceof Error && error.message.includes("expected")) {
        throw error;
      }
      // Servidor no disponible en CI aislado: el test de datos cubre el slider.
    }
  });
});
