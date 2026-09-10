"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  GitCompareArrows,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import { LOGO_SRC } from "@/data/media";
import { mainCategories } from "@/data/home";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useCompare } from "@/components/CompareProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import { useSiteContent } from "@/components/ContentProvider";
import CategoryIcon from "@/components/CategoryIcon";
import { firstName } from "@/lib/auth-local";

const mainLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

const topLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openAuth, user, logout } = useAuth();
  const { count } = useCart();
  const { count: favoritesCount } = useFavorites();
  const { count: compareCount } = useCompare();
  const { categories } = useSiteContent();
  const navCategories = categories.length > 0 ? categories : mainCategories;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const mainNavRef = useRef<HTMLElement>(null);
  const [navIndicator, setNavIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    function updateNavIndicator() {
      const nav = mainNavRef.current;
      if (!nav) return;
      const activeLink = nav.querySelector<HTMLElement>('[data-nav-active="true"]');
      if (!activeLink) {
        setNavIndicator((prev) => ({ ...prev, width: 0, ready: false }));
        return;
      }
      setNavIndicator({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        ready: true,
      });
    }

    updateNavIndicator();
    window.addEventListener("resize", updateNavIndicator);
    return () => window.removeEventListener("resize", updateNavIndicator);
  }, [pathname]);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-playing")) {
      return;
    }
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      if (document.documentElement.classList.contains("intro-playing")) return;
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    mobileSearchRef.current?.focus();
  }, [mobileSearchOpen]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/catalogo?q=${encodeURIComponent(query)}` : "/catalogo");
    setMobileSearchOpen(false);
    setMobileOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Barra superior */}
      <div className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-xs sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/85">
            <span>Envíos a todo el Perú</span>
            <span className="hidden text-white/30 sm:inline">|</span>
            <span className="hidden sm:inline">
              Atención mayorista y distribuidores
            </span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 sm:flex" aria-label="Utilidad">
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition hover:text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition hover:text-white"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Logo + buscador + cuenta */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3.5 sm:gap-5 sm:px-6 lg:gap-8 lg:px-8 xl:px-10">
          <Link
            href="/"
            data-site-intro
            className="relative flex h-12 w-32 shrink-0 items-center sm:h-14 sm:w-40 lg:w-48"
            aria-label="Chamo Import — inicio"
          >
            {!logoFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={LOGO_SRC}
                alt="Chamo Import"
                className="h-full w-full object-contain object-left"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="font-display text-2xl font-extrabold italic tracking-tight sm:text-3xl">
                <span className="text-brand-primary">CHAMO</span>
                <span className="text-brand-dark"> IMPORT</span>
              </span>
            )}
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:block"
            role="search"
          >
            <label htmlFor="navbar-search" className="sr-only">
              Buscar productos
            </label>
            <div className="flex overflow-hidden rounded-md border border-brand-dark/12 bg-brand-gray/60 shadow-sm focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
              <input
                id="navbar-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar productos, marcas o categorías..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-brand-dark outline-none placeholder:text-brand-dark/40"
              />
              <button
                type="submit"
                className="inline-flex h-auto w-12 shrink-0 items-center justify-center bg-brand-primary text-white transition hover:bg-brand-dark"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary md:hidden"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-expanded={mobileSearchOpen}
              aria-controls="mobile-search-panel"
              aria-label={mobileSearchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
            >
              {mobileSearchOpen ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Search className="h-5 w-5" strokeWidth={2} />
              )}
            </button>

            {user ? (
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  className="inline-flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary"
                  aria-expanded={accountOpen}
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                  <span className="max-w-[4.5rem] truncate text-[11px] font-semibold">
                    {firstName(user.name)}
                  </span>
                </button>
                {accountOpen ? (
                  <div className="absolute top-full right-0 z-50 mt-1 min-w-[12rem] overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-xl">
                    <p className="border-b border-brand-dark/8 px-3 py-2 text-xs text-brand-dark/60">
                      {user.email}
                    </p>
                    <Link
                      href="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-gray"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-primary" />
                      Editar contenido
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-brand-dark hover:bg-brand-gray"
                    >
                      <LogOut className="h-4 w-4 text-brand-primary" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="hidden flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:inline-flex"
              >
                <User className="h-5 w-5" strokeWidth={2} />
                <span className="text-[11px] font-semibold">Cuenta</span>
              </button>
            )}

            <Link
              href="/comparar"
              className="relative hidden flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:inline-flex"
              aria-label={`Comparar, ${compareCount} productos`}
            >
              <GitCompareArrows className="h-5 w-5" strokeWidth={2} />
              <span className="text-[11px] font-semibold">Comparar</span>
              <span
                suppressHydrationWarning
                className="absolute -top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white"
              >
                {compareCount}
              </span>
            </Link>

            <Link
              href="/favoritos"
              className="relative hidden flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:inline-flex"
              aria-label={`Favoritos, ${favoritesCount} productos`}
            >
              <Heart className="h-5 w-5" strokeWidth={2} />
              <span className="text-[11px] font-semibold">Favoritos</span>
              <span
                suppressHydrationWarning
                className="absolute -top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white"
              >
                {favoritesCount}
              </span>
            </Link>

            <Link
              href="/carrito"
              data-cart-intro
              className="relative hidden flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:inline-flex"
              aria-label={`Carrito, ${count} productos`}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2} />
              <span className="text-[11px] font-semibold">Carrito</span>
              <span
                suppressHydrationWarning
                className="absolute -top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white"
              >
                {count}
              </span>
            </Link>

            {/* Compact icons on very small screens */}
            <Link
              href="/comparar"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:hidden"
              aria-label={`Comparar, ${compareCount} productos`}
            >
              <GitCompareArrows className="h-5 w-5" strokeWidth={2} />
              <span
                suppressHydrationWarning
                className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white"
              >
                {compareCount}
              </span>
            </Link>
            <Link
              href="/favoritos"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:hidden"
              aria-label={`Favoritos, ${favoritesCount} productos`}
            >
              <Heart className="h-5 w-5" strokeWidth={2} />
              <span
                suppressHydrationWarning
                className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white"
              >
                {favoritesCount}
              </span>
            </Link>
            <Link
              href="/carrito"
              data-cart-intro
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary sm:hidden"
              aria-label={`Carrito, ${count} productos`}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2} />
              <span
                suppressHydrationWarning
                className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white"
              >
                {count}
              </span>
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-gray lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <form
            id="mobile-search-panel"
            onSubmit={handleSearch}
            className="border-t border-brand-dark/5 px-4 py-3 md:hidden"
            role="search"
          >
            <label htmlFor="navbar-search-mobile" className="sr-only">
              Buscar productos
            </label>
            <div className="flex overflow-hidden rounded-md border-2 border-brand-primary">
              <input
                ref={mobileSearchRef}
                id="navbar-search-mobile"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar productos, marcas o categorías..."
                className="min-w-0 flex-1 bg-white px-3 py-2.5 text-sm text-brand-dark outline-none"
              />
              <button
                type="submit"
                className="inline-flex w-11 items-center justify-center bg-brand-primary text-white"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nav azul */}
      <div className="bg-brand-primary text-white">
        <div className="mx-auto flex max-w-[1600px] items-stretch gap-1 px-2 sm:px-4 lg:px-8 xl:px-10">
          <div className="relative hidden lg:block" ref={categoriesRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen((open) => !open)}
              className="inline-flex h-full items-center gap-2 bg-brand-dark px-4 py-3.5 font-display text-sm font-bold tracking-wide uppercase transition hover:bg-[#082a43]"
              aria-expanded={categoriesOpen}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={2.5} />
              Categorías
              <ChevronDown
                className={`h-4 w-4 transition ${categoriesOpen ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 z-50 mt-0 min-w-[240px] overflow-hidden rounded-b-lg border border-brand-dark/10 bg-white shadow-xl">
                <ul className="py-2">
                  {navCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={category.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-brand-gray hover:text-brand-primary"
                      >
                        <CategoryIcon
                          slug={category.slug}
                          className="h-4 w-4 text-brand-primary"
                        />
                        {category.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/categorias"
                      onClick={() => setCategoriesOpen(false)}
                      className="block border-t border-brand-dark/10 px-4 py-2.5 text-sm font-bold text-brand-primary"
                    >
                      Ver todas
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <nav
            ref={mainNavRef}
            className="relative hidden flex-1 items-center gap-0.5 lg:flex"
            aria-label="Principal"
          >
            {mainLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-nav-active={active ? "true" : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`relative z-10 inline-flex items-center px-3.5 py-3.5 font-display text-sm font-bold tracking-wide uppercase transition xl:px-5 ${
                    active
                      ? "text-brand-gold"
                      : "text-white hover:text-brand-gold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-brand-gold transition-all duration-300 ease-out"
              style={{
                left: navIndicator.left,
                width: navIndicator.width,
                opacity: navIndicator.ready ? 1 : 0,
              }}
            />
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" id="mobile-menu">
          <button
            type="button"
            className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute top-0 right-0 flex h-full w-[min(100%,22rem)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-brand-primary px-4 py-4 text-white">
              <p className="font-display text-lg font-bold">Menú</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/15"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col overflow-y-auto p-4" aria-label="Móvil">
              <p className="mb-2 text-xs font-bold tracking-wide text-brand-dark/50 uppercase">
                Categorías
              </p>
              {navCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-gray"
                >
                  <CategoryIcon
                    slug={category.slug}
                    className="h-4 w-4 text-brand-primary"
                  />
                  {category.label}
                </Link>
              ))}

              <p className="mt-4 mb-2 text-xs font-bold tracking-wide text-brand-dark/50 uppercase">
                Navegación
              </p>
              {mainLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2.5 font-display text-base font-semibold transition ${
                      active
                        ? "bg-brand-primary/10 text-brand-primary ring-2 ring-brand-gold/80"
                        : "text-brand-dark hover:bg-brand-gray"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/comparar"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 font-display text-base font-semibold text-brand-dark hover:bg-brand-gray"
              >
                Comparar
              </Link>
            </nav>

            <div className="border-t border-brand-dark/10 p-4 space-y-2">
              {user ? (
                <>
                  <p className="text-center text-xs text-brand-dark/60">
                    {user.email}
                  </p>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-primary/30 px-4 py-3 text-sm font-semibold text-brand-primary"
                  >
                    <LayoutDashboard className="h-5 w-5" strokeWidth={2} />
                    Editar contenido
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    <LogOut className="h-5 w-5" strokeWidth={2} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth("login");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white"
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                  Mi cuenta
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
