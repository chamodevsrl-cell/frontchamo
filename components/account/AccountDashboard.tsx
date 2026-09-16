"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Heart,
  House,
  Package,
  ShoppingCart,
  Star,
  UserCircle,
} from "lucide-react";
import AccountAvatar from "@/components/account/AccountAvatar";
import AccountCompanyPanel from "@/components/account/AccountCompanyPanel";
import AccountProfilePanel from "@/components/account/AccountProfilePanel";
import ProductCatalog from "@/components/ProductCatalog";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import { greetingSurname } from "@/lib/account-profile";
import { formatPrice } from "@/lib/format";
import type { AuthUser } from "@/lib/auth-local";

export const ACCOUNT_TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "pedidos", label: "Mis pedidos" },
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "favoritos", label: "Favoritos" },
  { id: "resenas", label: "Mis reseñas" },
  { id: "perfil", label: "Mi perfil" },
  { id: "empresa", label: "Mi empresa" },
] as const;

export type AccountTabId = (typeof ACCOUNT_TABS)[number]["id"];

function isAccountTab(value: string | null): value is AccountTabId {
  return ACCOUNT_TABS.some((tab) => tab.id === value);
}

function tabHref(id: AccountTabId) {
  return `/perfil?tab=${id}`;
}

function EmptyAccountTab({
  icon: Icon,
  title,
  text,
  href,
  cta,
}: {
  icon: typeof Package;
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white px-5 py-12 text-center">
      <Icon className="mx-auto h-12 w-12 text-brand-primary/45" strokeWidth={1.75} />
      <p className="mt-3 font-display text-lg font-bold text-brand-dark">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-brand-dark/60">{text}</p>
      {href && cta ? (
        <Link
          href={href}
          className="mt-4 inline-flex rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

function SummaryTab({
  user,
  cartCount,
  favoritesCount,
}: {
  user: AuthUser;
  cartCount: number;
  favoritesCount: number;
}) {
  const cards = [
    {
      href: tabHref("cotizaciones"),
      label: "Cotizaciones",
      value: `${cartCount}`,
      hint: "Ítems en el carrito",
      icon: ShoppingCart,
    },
    {
      href: tabHref("favoritos"),
      label: "Favoritos",
      value: `${favoritesCount}`,
      hint: "Productos guardados",
      icon: Heart,
    },
    {
      href: tabHref("empresa"),
      label: "Empresa",
      value: user.companyName || "Sin configurar",
      hint: user.ruc ? `RUC ${user.ruc}` : "RUC y razón social",
      icon: Building2,
    },
    {
      href: tabHref("perfil"),
      label: "Perfil",
      value: user.phone || "Falta teléfono",
      hint: user.totpEnabled ? "Autenticador vinculado" : "Completa tus datos",
      icon: UserCircle,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-brand-dark/10 bg-white px-5 py-4 transition hover:border-brand-primary/40"
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand-dark/45 uppercase">
              <Icon className="h-3.5 w-3.5 text-brand-primary" />
              {card.label}
            </span>
            <p className="mt-2 truncate font-display text-xl font-bold text-brand-dark">
              {card.value}
            </p>
            <p className="text-xs text-brand-dark/50">{card.hint}</p>
          </Link>
        );
      })}
    </div>
  );
}

function QuotesTab() {
  const { lines, count } = useCart();

  if (count === 0) {
    return (
      <EmptyAccountTab
        icon={ShoppingCart}
        title="Sin cotizaciones armadas"
        text="Agrega productos al carrito para armar el pedido mayorista y enviarlo por WhatsApp."
        href="/catalogo"
        cta="Ir al catálogo"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-brand-dark/8 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white">
        {lines.map((line) => (
          <li key={line.productId} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
            <span className="min-w-0 truncate font-medium text-brand-dark">
              {line.product.name}
              <span className="ml-2 text-brand-dark/45">x{line.quantity}</span>
            </span>
            <span className="shrink-0 font-display font-bold text-brand-dark">
              {formatPrice(line.wholesaleUnitPrice * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/carrito"
          className="rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Abrir carrito
        </Link>
        <Link
          href="/cotizar"
          className="rounded-full border border-brand-dark/15 px-4 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-gray"
        >
          Enviar cotización
        </Link>
      </div>
    </div>
  );
}

function FavoritesTab() {
  const { products, count } = useFavorites();
  if (count === 0) {
    return (
      <EmptyAccountTab
        icon={Heart}
        title="Sin favoritos"
        text="Guarda productos desde el catálogo para cotizarlos después."
        href="/catalogo"
        cta="Ir al catálogo"
      />
    );
  }
  return <ProductCatalog products={products} />;
}

export default function AccountDashboard() {
  const searchParams = useSearchParams();
  const { user, ready, hasPanelSession, openAuth } = useAuth();
  const { count: cartCount } = useCart();
  const { count: favoritesCount } = useFavorites();
  const rawTab = searchParams.get("tab");
  const tab: AccountTabId = isAccountTab(rawTab) ? rawTab : "perfil";

  if (!ready) return null;

  if (!user) {
    return (
      <div className="rounded-2xl border border-brand-dark/10 bg-white px-5 py-10 text-center">
        <p className="text-brand-dark/70">Inicia sesión para ver tu cuenta.</p>
        <button
          type="button"
          onClick={() => openAuth("login")}
          className="mt-4 inline-flex rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  const staff = user.role === "admin" || hasPanelSession;
  const areaLabel = staff ? "Área usuario" : "Área cliente";

  return (
    <div className="space-y-5">
      <section className="account-hero overflow-hidden rounded-2xl px-5 py-6 text-white sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <AccountAvatar
              user={user}
              size={72}
              className="ring-2 ring-white/25"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
                {areaLabel}
              </p>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Mi cuenta
              </h1>
              <p className="mt-0.5 text-sm text-white/75">
                Hola, {greetingSurname(user.name)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasPanelSession ? (
              <Link
                href="/admin"
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase ring-1 ring-white/25 hover:bg-white/15"
              >
                <span className="inline-flex items-center gap-1.5">
                  <House className="h-3.5 w-3.5" />
                  Administrar
                </span>
              </Link>
            ) : null}
            <Link
              href={tabHref("empresa")}
              className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase ${
                tab === "empresa"
                  ? "bg-brand-gold text-brand-dark"
                  : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15"
              }`}
            >
              Mi empresa
            </Link>
            <Link
              href={tabHref("perfil")}
              className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase ${
                tab === "perfil"
                  ? "bg-brand-primary text-white"
                  : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15"
              }`}
            >
              Mi perfil
            </Link>
          </div>
        </div>
      </section>

      <nav
        aria-label="Secciones de la cuenta"
        className="overflow-x-auto rounded-full bg-brand-gray p-1"
      >
        <ul className="flex min-w-max gap-0.5">
          {ACCOUNT_TABS.map((item) => {
            const active = item.id === tab;
            return (
              <li key={item.id}>
                <Link
                  href={tabHref(item.id)}
                  className={`block rounded-full px-3.5 py-2 text-[11px] font-bold tracking-[0.08em] uppercase transition sm:px-4 ${
                    active
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-brand-dark/50 hover:text-brand-dark"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-2xl border border-brand-dark/10 bg-[#fbfcfd] p-4 sm:p-6">
        {tab === "resumen" ? (
          <SummaryTab
            user={user}
            cartCount={cartCount}
            favoritesCount={favoritesCount}
          />
        ) : null}
        {tab === "pedidos" ? (
          <EmptyAccountTab
            icon={Package}
            title="Aún no hay pedidos"
            text="Cuando el backend registre despachos, aquí verás el historial. Hoy el flujo es cotizar por WhatsApp."
            href="/cotizar"
            cta="Armar cotización"
          />
        ) : null}
        {tab === "cotizaciones" ? <QuotesTab /> : null}
        {tab === "favoritos" ? <FavoritesTab /> : null}
        {tab === "resenas" ? (
          <EmptyAccountTab
            icon={Star}
            title="Sin reseñas todavía"
            text="Las valoraciones de productos aparecerán aquí cuando el catálogo las soporte."
          />
        ) : null}
        {tab === "perfil" ? <AccountProfilePanel user={user} /> : null}
        {tab === "empresa" ? <AccountCompanyPanel user={user} /> : null}
      </div>
    </div>
  );
}
