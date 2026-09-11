"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronDown,
  Flame,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { firstName } from "@/lib/auth-local";
import { logoutAdmin } from "@/lib/auth";
import type { AuthSession } from "@/types/admin";

type NavChild = { href: string; label: string };
type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/productos",
    label: "Productos",
    icon: Package,
    children: [
      { href: "/admin/productos", label: "Ver productos" },
      { href: "/admin/productos/nuevo", label: "Crear producto" },
    ],
  },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/marcas", label: "Marcas", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/inventario", label: "Inventario", icon: Warehouse },
  { href: "/admin/ofertas", label: "Ofertas", icon: Flame },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
  session,
}: {
  children: ReactNode;
  session: AuthSession;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const onProductos = pathname.startsWith("/admin/productos");
  const showProductosSub = onProductos || productsOpen;

  useEffect(() => {
    document.documentElement.classList.add("admin-shell");
    return () => document.documentElement.classList.remove("admin-shell");
  }, []);

  const initials = useMemo(() => {
    const name = session.name?.trim() || "Admin";
    const parts = name.split(/\s+/).filter(Boolean);
    const letters = (parts[0]?.[0] || "A") + (parts[1]?.[0] || "");
    return letters.toUpperCase();
  }, [session.name]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(
      q ? `/admin/productos?q=${encodeURIComponent(q)}` : "/admin/productos",
    );
  }

  return (
    <div className="fixed inset-0 z-[75] flex bg-[#F4F4F4] text-brand-dark">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#0B3554] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          <Link href="/admin" className="flex min-w-0 items-center gap-2">
            <Image
              src="/logo.png"
              alt="Chamo Import S.R.L."
              width={176}
              height={40}
              className="h-10 object-contain"
            />
          </Link>
          <button
            type="button"
            className="ml-auto rounded-lg p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Admin">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            if (item.children) {
              return (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setProductsOpen((open) => !open)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                      active
                        ? "bg-white/10 text-brand-gold"
                        : "text-white/80 hover:bg-white/10 hover:text-brand-gold"
                    }`}
                    aria-expanded={showProductosSub}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${showProductosSub ? "rotate-180" : ""}`}
                      strokeWidth={2}
                    />
                  </button>
                  {showProductosSub ? (
                    <div className="mt-0.5 ml-4 space-y-0.5 border-l border-white/15 pl-3">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`block rounded-lg px-3 py-2 text-sm ${
                              childActive
                                ? "font-semibold text-brand-gold"
                                : "text-white/70 hover:text-brand-gold"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  active
                    ? "bg-white/10 text-brand-gold"
                    : "text-white/80 hover:bg-white/10 hover:text-brand-gold"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-10 flex h-16 shrink-0 items-center gap-3 border-b border-brand-dark/10 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-brand-dark hover:bg-brand-gray lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>

          <form onSubmit={handleSearch} className="relative min-w-0 flex-1" role="search">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand-dark/40" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar productos, pedidos o clientes…"
              className="w-full rounded-lg border border-brand-dark/10 bg-brand-gray py-2 pr-3 pl-9 text-sm text-brand-dark outline-none focus:border-brand-primary"
            />
          </form>

          <button
            type="button"
            className="relative rounded-lg p-2 text-brand-dark hover:bg-brand-gray"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-brand-gray"
              aria-expanded={accountOpen}
              aria-label="Cuenta de administrador"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B3554] font-display text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden max-w-[8rem] truncate text-left text-sm font-semibold sm:block">
                {firstName(session.name)}
              </span>
            </button>
            {accountOpen ? (
              <div className="absolute top-full right-0 z-20 mt-1 min-w-[12rem] overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-xl">
                <p className="border-b border-brand-dark/8 px-3 py-2 text-xs text-brand-dark/60">
                  {session.email}
                </p>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-gray"
                >
                  <Store className="h-4 w-4 text-brand-primary" />
                  Ver el sitio
                </Link>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => {
                    setLoggingOut(true);
                    setAccountOpen(false);
                    void logoutAdmin().then(() => {
                      router.replace("/admin/login");
                      router.refresh();
                    });
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-brand-dark hover:bg-brand-gray disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4 text-brand-primary" />
                  {loggingOut ? "Saliendo…" : "Cerrar sesión"}
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
