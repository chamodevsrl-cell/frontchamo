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
import type { AdminPermission } from "@/types/admin";

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

  it("parseFavoriteItems migra el formato viejo y resolveCategoryLabel lee la línea", async () => {
    const { parseFavoriteItems } = await import("@/lib/favorites");
    const { resolveCategoryLabel } = await import("@/data/products");
    const migrated = parseFavoriteItems(JSON.stringify(["1", "2", "1"]));
    expect(migrated).toEqual([
      { productId: "1", addedAt: "2026-01-01T00:00:00.000Z" },
      { productId: "2", addedAt: "2026-01-01T00:00:00.000Z" },
    ]);
    const modern = parseFavoriteItems(
      JSON.stringify([{ productId: "3", addedAt: "2026-09-16T00:00:00.000Z" }]),
    );
    expect(modern[0]?.productId).toBe("3");
    expect(resolveCategoryLabel("electricos")).toBe("Electricidad");
    expect(resolveCategoryLabel("no-existe", "Fallback")).toBe("Fallback");
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
    const withExtra = mergeCategories(undefined, [], [
      {
        slug: "pintura",
        label: "Pintura",
        eyebrow: "Látex y esmalte",
        image: "/images/categorias/herramientas.jpg",
      },
    ]);
    expect(withExtra.some((item) => item.slug === "pintura" && item.label === "Pintura")).toBe(
      true,
    );
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
      roleId: "role_admin",
      permissions: ["dashboard", "productos", "usuarios", "roles"] as AdminPermission[],
    };
    expect(parseAdminSession(serializeAdminSession(session))).toEqual(session);
    expect(parseAdminSession(encodeAdminSessionCookie(session))).toEqual(session);
    expect(parseAdminSession("no-json")).toBeNull();
    expect(parseAdminSession(null)).toBeNull();
  });

  it("heroForAdminPath pone título y CTA de cada pestaña", async () => {
    const { heroForAdminPath } = await import("@/lib/admin-hero");
    expect(heroForAdminPath("/admin")).toEqual({ title: "Dashboard" });
    expect(heroForAdminPath("/admin/roles")).toEqual({
      title: "Roles y permisos",
      action: { href: "#nuevo-rol", label: "Nuevo rol" },
    });
    expect(heroForAdminPath("/admin/productos")).toMatchObject({
      title: "Productos",
      action: { href: "/admin/productos/nuevo", label: "Crear producto" },
    });
    expect(heroForAdminPath("/admin/productos/nuevo").title).toBe("Nuevo producto");
    expect(heroForAdminPath("/admin/categorias")).toEqual({
      title: "Categorías",
      action: { href: "#nueva-categoria", label: "Nueva categoría" },
    });
    expect(heroForAdminPath("/admin/ajustes")).toEqual({ title: "Ajustes" });
    expect(heroForAdminPath("/admin/ajustes/footer")).toEqual({ title: "Footer" });
    expect(heroForAdminPath("/admin/ajustes/canales")).toEqual({
      title: "Canales de atención",
    });
  });

  it("loginAdmin valida contra PanelUser (nombre o correo) y respeta roles", async () => {
    const {
      loginAdmin,
      AdminApiError,
      MOCK_ADMIN_EMAIL,
      MOCK_ADMIN_PASSWORD,
      MOCK_WINTER_NAME,
      MOCK_WINTER_EMAIL,
      MOCK_WINTER_PASSWORD,
    } = await import("@/services/adminApi");

    const winterByName = await loginAdmin({
      email: MOCK_WINTER_NAME,
      password: MOCK_WINTER_PASSWORD,
    });
    expect(winterByName.name).toBe(MOCK_WINTER_NAME);
    expect(winterByName.email).toBe(MOCK_WINTER_EMAIL);
    expect(winterByName.role).toBe("admin");
    expect(winterByName.roleId).toBe("role_admin");
    expect(winterByName.permissions).toContain("dashboard");
    expect(winterByName.permissions).toContain("usuarios");

    const winterByEmail = await loginAdmin({
      email: MOCK_WINTER_EMAIL,
      password: MOCK_WINTER_PASSWORD,
    });
    expect(winterByEmail.id).toBe(winterByName.id);

    const adminSession = await loginAdmin({
      email: MOCK_ADMIN_EMAIL,
      password: MOCK_ADMIN_PASSWORD,
    });
    expect(adminSession.email).toBe(MOCK_ADMIN_EMAIL);
    expect(adminSession.role).toBe("admin");

    const editorSession = await loginAdmin({
      email: "katia.demo@local.test",
      password: "editor123",
    });
    expect(editorSession.role).toBe("editor");
    expect(editorSession.permissions).not.toContain("usuarios");

    await expect(
      loginAdmin({ email: MOCK_WINTER_NAME, password: "wrong-password" }),
    ).rejects.toBeInstanceOf(AdminApiError);

    await expect(
      loginAdmin({ email: "julio.demo@local.test", password: "almacen123" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("getUsers incluye THE WINTER y createUser deja una cuenta que puede entrar", async () => {
    const { getUsers, createUser, loginAdmin } = await import("@/services/adminApi");
    const users = await getUsers();
    expect(users.some((user) => user.name === "THE WINTER")).toBe(true);

    const created = await createUser({
      name: "QA Login",
      email: "qa.login@local.test",
      roleId: "role_editor",
      password: "qa-pass-11",
    });
    expect(created.status).toBe("active");
    const session = await loginAdmin({
      email: "QA Login",
      password: "qa-pass-11",
    });
    expect(session.id).toBe(created.id);
    expect(session.role).toBe("editor");
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
      expect(typeof category.description).toBe("string");
    }
  });

  it("createCategory agrega una línea al mock", async () => {
    const { slugifyLabel } = await import("@/lib/cms");
    const { createCategory, getCategories } = await import("@/services/adminApi");
    expect(slugifyLabel("Eléctricos")).toBe("electricos");
    const created = await createCategory({
      name: "Iluminación LED Test",
      description: "Focos y tiras",
      image: "/images/categorias/electricos.jpg",
    });
    expect(created.id).toBe("iluminacion-led-test");
    expect(created.description).toBe("Focos y tiras");
    const all = await getCategories();
    expect(all.some((item) => item.id === created.id)).toBe(true);
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
      specs: [],
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

  it("getBrands, getClients y updateProduct cubren el contrato nuevo", async () => {
    const { getBrands, getClients, getProduct, updateProduct } = await import(
      "@/services/adminApi"
    );
    const brands = await getBrands();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands.every((item) => item.name && item.productCount >= 1)).toBe(true);
    const clients = await getClients();
    expect(clients.length).toBeGreaterThan(0);
    const first = await getProduct("1");
    const updated = await updateProduct("1", { name: `${first.name} (edit)` });
    expect(updated.name.endsWith("(edit)")).toBe(true);
    await updateProduct("1", { name: first.name });
  });

  it("createContact persiste en la bandeja mock", async () => {
    const { createContact, getContacts } = await import("@/services/adminApi");
    const created = await createContact({
      name: "Demo Mayorista",
      company: "Ferretería Test",
      phone: "+51 900 000 111",
      email: "demo.inbox@local.test",
      topic: "Cotización mayorista",
      message: "Necesito stock de taladros.",
      source: "contacto",
    });
    expect(created.id).toMatch(/^msg_/);
    expect(created.status).toBe("new");
    const list = await getContacts();
    expect(list.some((item) => item.id === created.id)).toBe(true);
  });
});

describe("CMS local (footer, banners de página, equipo)", () => {
  it("parseCms rellena footer, banners y equipo si el JSON viejo no los trae", async () => {
    const { parseCms, phoneToWhatsapp, mergePageBanners, footerWhatsapp } = await import("@/lib/cms");
    const { defaultTeam } = await import("@/data/team");
    const cms = parseCms(JSON.stringify({ slides: [], categories: [] }));
    expect(cms.footer.phone).toContain("959 723 602");
    expect(cms.footer.paymentMethods.length).toBeGreaterThanOrEqual(4);
    expect(cms.team.map((member) => member.role)).toEqual(
      defaultTeam.map((member) => member.role),
    );
    expect(phoneToWhatsapp(cms.footer.phone)).toBe("51959723602");
    expect(footerWhatsapp({ ...cms.footer, whatsapp: "", phone: "+51 999 000 111" })).toBe(
      "+51 999 000 111",
    );
    expect(footerWhatsapp({ ...cms.footer, whatsapp: "+51 111 222 333" })).toBe(
      "+51 111 222 333",
    );
    const pages = mergePageBanners(cms.pageBanners);
    expect(pages.map((page) => page.id)).toEqual([
      "nosotros",
      "contacto",
      "ofertas",
      "catalogo",
    ]);
  });

  it("parseCms conserva un footer y un colaborador guardados", async () => {
    const { parseCms } = await import("@/lib/cms");
    const cms = parseCms(
      JSON.stringify({
        slides: [],
        categories: [],
        footer: {
          phone: "+51 999 111 222",
          address: "Callao",
          paymentMethods: [
            { id: "yape", label: "Yape", hint: "QR", image: "/yape.png" },
          ],
        },
        team: [
          {
            id: "tm_x",
            name: "Ana",
            role: "Asesor",
            photo: "/ana.jpg",
            bio: "Cotiza líneas.",
          },
        ],
        pageBanners: [
          { id: "nosotros", src: "/custom.jpg", alt: "Nosotros custom" },
        ],
      }),
    );
    expect(cms.footer.phone).toBe("+51 999 111 222");
    expect(cms.footer.address).toBe("Callao");
    expect(cms.footer.paymentMethods).toEqual([
      { id: "yape", label: "Yape", hint: "QR", image: "/yape.png" },
    ]);
    expect(cms.team).toHaveLength(1);
    expect(cms.team[0].name).toBe("Ana");
    expect(cms.pageBanners[0]).toMatchObject({
      id: "nosotros",
      src: "/custom.jpg",
    });
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

      const reclamaciones = await fetch("http://127.0.0.1:3000/reclamaciones", {
        signal: AbortSignal.timeout(4000),
      });
      expect(reclamaciones.ok).toBe(true);
      const claimsHtml = await reclamaciones.text();
      expect(claimsHtml).toMatch(/RECLAMACIONES|Reclamaci/);

      const admin = await fetch("http://127.0.0.1:3000/admin", {
        signal: AbortSignal.timeout(4000),
        redirect: "manual",
      });
      expect([307, 302, 303, 308]).toContain(admin.status);
      expect(admin.headers.get("location") ?? "").toContain("/login");

      const login = await fetch("http://127.0.0.1:3000/admin/login", {
        signal: AbortSignal.timeout(4000),
        redirect: "manual",
      });
      expect([307, 302, 303, 308]).toContain(login.status);
      expect(login.headers.get("location") ?? "").toContain("/login");
    } catch (error) {
      if (error instanceof Error && error.message.includes("expected")) {
        throw error;
      }
      // Servidor no disponible en CI aislado: el test de datos cubre el slider.
    }
  });
});
