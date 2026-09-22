export type AdminHeroAction = {
  href: string;
  label: string;
};

export type AdminHero = {
  title: string;
  action?: AdminHeroAction;
};

const HEROES: { href: string; exact?: boolean; title: string; action?: AdminHeroAction }[] =
  [
    {
      href: "/admin/productos/nuevo",
      exact: true,
      title: "Nuevo producto",
    },
    {
      href: "/admin/productos/unidades",
      exact: true,
      title: "Unidades de medida",
    },
    {
      href: "/admin/productos",
      title: "Productos",
      action: { href: "/admin/productos/nuevo", label: "Crear producto" },
    },
    { href: "/admin/categorias", title: "Categorías", action: { href: "#nueva-categoria", label: "Nueva categoría" } },
    { href: "/admin/marcas", title: "Marcas" },
    { href: "/admin/pedidos", title: "Pedidos" },
    { href: "/admin/clientes", title: "Clientes" },
    { href: "/admin/inventario", title: "Inventario" },
    { href: "/admin/ofertas", title: "Ofertas" },
    { href: "/admin/banners", title: "Banners" },
    { href: "/admin/equipo", title: "Equipo de trabajo" },
    { href: "/admin/reportes", title: "Reportes" },
    {
      href: "/admin/usuarios",
      title: "Usuarios del panel",
      action: { href: "#nuevo-usuario", label: "Nuevo usuario" },
    },
    {
      href: "/admin/roles",
      title: "Roles y permisos",
      action: { href: "#nuevo-rol", label: "Nuevo rol" },
    },
    {
      href: "/admin/ajustes/canales",
      title: "Canales de atención",
    },
    {
      href: "/admin/ajustes/footer",
      title: "Footer",
    },
    { href: "/admin/ajustes", title: "Ajustes" },
    { href: "/admin/configuracion", title: "Ajustes" },
    { href: "/admin", exact: true, title: "Dashboard" },
  ];

export function heroForAdminPath(pathname: string): AdminHero {
  const ranked = [...HEROES].sort((a, b) => b.href.length - a.href.length);
  const match = ranked.find((item) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (!match) return { title: "Panel" };
  return { title: match.title, action: match.action };
}
