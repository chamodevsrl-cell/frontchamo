"use client";

import Link from "next/link";
import { Building2, Heart, MessageCircle, UserRound } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import { useCart } from "@/components/CartProvider";

const cards = [
  {
    href: "/cuenta/perfil",
    label: "Mi perfil",
    hint: "Nombre, foto y teléfono",
    icon: UserRound,
  },
  {
    href: "/cuenta/empresa",
    label: "Mi empresa",
    hint: "RUC y razón social",
    icon: Building2,
  },
  {
    href: "/favoritos",
    label: "Favoritos",
    hint: "Productos guardados",
    icon: Heart,
  },
  {
    href: "/cotizar",
    label: "Cotizaciones",
    hint: "Pedido por WhatsApp",
    icon: MessageCircle,
  },
] as const;

export default function AccountSummary() {
  const { user } = useAuth();
  const { count: favoritesCount } = useFavorites();
  const { count: cartCount } = useCart();

  if (!user) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        const extra =
          card.href === "/favoritos"
            ? `${favoritesCount} guardados`
            : card.href === "/cotizar"
              ? `${cartCount} en carrito`
              : null;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-start gap-3 rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm transition hover:border-brand-primary/40 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span>
              <span className="block font-display text-lg font-bold text-brand-dark">
                {card.label}
              </span>
              <span className="text-sm text-brand-dark/60">
                {extra ? `${card.hint} · ${extra}` : card.hint}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
