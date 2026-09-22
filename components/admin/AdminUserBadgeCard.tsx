"use client";

import { useState } from "react";
import { RotateCcw, RotateCw, Pencil } from "lucide-react";
import AccountAvatar from "@/components/AccountAvatar";
import { LOGO_SRC } from "@/data/media";
import type { PanelRole, PanelUser } from "@/types/admin";
import { STATUS_BADGE, STATUS_LABEL, formatDate, roleBannerColor } from "./adminUserBadge";

export default function AdminUserBadgeCard({
  user,
  roles,
  photo,
  phone,
  onEdit,
}: {
  user: PanelUser;
  roles: PanelRole[];
  photo: string;
  phone: string;
  onEdit: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const primaryRole = roles[0] ?? null;
  const extraRoleCount = Math.max(0, roles.length - 1);
  const bannerColor = roleBannerColor(primaryRole?.id ?? user.roleIds[0] ?? user.id);
  const totalPermissions = Array.from(
    new Set(roles.flatMap((role) => role.permissions)),
  ).length;

  return (
    <li className={`badge-flip mx-auto h-[440px] w-full max-w-[240px] ${flipped ? "is-flipped" : ""}`}>
      <div className="badge-flip-inner">
        {/* Frente */}
        <div className="badge-face flex flex-col overflow-hidden rounded-2xl border-2 border-brand-primary bg-white shadow-[0_8px_24px_rgba(11,53,84,0.1)]">
          <div
            className="relative flex h-20 items-center justify-center"
            style={{ backgroundColor: bannerColor }}
          >
            <div className="rounded-lg bg-white/95 px-3 py-1.5 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="Chamo Import" className="h-9 w-auto object-contain" />
            </div>
            <span
              className={`absolute top-2 right-2 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${STATUS_BADGE[user.status]}`}
            >
              {STATUS_LABEL[user.status]}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-1 px-4 pb-4 text-center">
            <div className="-mt-8 rounded-full border-4 border-white shadow-md">
              <AccountAvatar photo={photo} name={user.name} size={88} />
            </div>
            <p className="mt-2 truncate font-display text-lg font-bold text-brand-dark">
              {user.name}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-[11px] font-bold tracking-wide text-brand-primary uppercase">
              {primaryRole?.name ?? "Sin rol"}
              {extraRoleCount > 0 ? (
                <span className="rounded-full bg-brand-primary px-1.5 py-0.5 text-white">
                  +{extraRoleCount}
                </span>
              ) : null}
            </span>
            <p className="mt-1 truncate text-xs text-brand-dark/50">{user.email}</p>

            <p className="mt-3 w-full border-t border-dashed border-brand-dark/15 pt-3 text-[11px] text-brand-dark/55">
              Último acceso: {formatDate(user.lastLoginAt)}
            </p>

            <div className="mt-auto flex w-full gap-2 pt-3">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-primary/30 bg-white px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => setFlipped(true)}
                aria-label="Ver reverso de la tarjeta"
                title="Ver reverso"
                className="inline-flex items-center justify-center rounded-lg border border-brand-dark/15 px-3 py-2 text-brand-dark/60 hover:border-brand-primary hover:text-brand-primary"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div className="badge-face badge-face-back flex flex-col overflow-hidden rounded-2xl border-2 border-brand-primary bg-brand-dark text-white shadow-[0_8px_24px_rgba(11,53,84,0.1)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="rounded-lg bg-white/95 px-2.5 py-1 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="Chamo Import" className="h-6 w-auto object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label="Volver al frente de la tarjeta"
              title="Volver"
              className="inline-flex items-center justify-center rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 text-left text-xs">
            <div>
              <p className="font-bold tracking-wide text-brand-gold uppercase">
                {roles.length === 1 ? "Rol" : "Roles"}
              </p>
              <p className="mt-0.5 font-semibold">
                {roles.length > 0 ? roles.map((role) => role.name).join(", ") : "Sin rol"}
              </p>
              {roles.map((role) => (
                <p key={role.id} className="mt-0.5 text-white/65">
                  <span className="font-semibold text-white/80">{role.name}:</span>{" "}
                  {role.description}
                </p>
              ))}
              {roles.length > 0 ? (
                <p className="mt-0.5 text-white/50">
                  {totalPermissions} sección{totalPermissions === 1 ? "" : "es"} habilitada
                  {totalPermissions === 1 ? "" : "s"} en total
                </p>
              ) : null}
            </div>

            <div>
              <p className="font-bold tracking-wide text-brand-gold uppercase">Contacto</p>
              <p className="mt-0.5 break-words text-white/80">{user.email}</p>
              {phone ? <p className="mt-0.5 text-white/80">{phone}</p> : null}
            </div>

            <div>
              <p className="font-bold tracking-wide text-brand-gold uppercase">Alta</p>
              <p className="mt-0.5 text-white/80">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="m-4 mt-0 inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Volver
          </button>
        </div>
      </div>
    </li>
  );
}
