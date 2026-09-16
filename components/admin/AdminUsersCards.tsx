"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Ban, CheckCircle2, Pencil, RotateCcw, RotateCw, Trash2, X } from "lucide-react";
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
  updateUserStatusAction,
} from "@/app/admin/actions";
import AccountAvatar from "@/components/AccountAvatar";
import { LOGO_SRC } from "@/data/media";
import { PROFILES_KEY, parseProfiles, type ProfileExtras } from "@/lib/auth-local";
import type { PanelRole, PanelUser, PanelUserStatus } from "@/types/admin";

const STATUS_LABEL: Record<PanelUserStatus, string> = {
  active: "Activo",
  suspended: "Suspendido",
};

const STATUS_BADGE: Record<PanelUserStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  suspended: "bg-amber-100 text-amber-800",
};

/**
 * Un color de banner por rol (no por usuario), para distinguir a simple
 * vista qué carga cada uno — p. ej. Gerente General en rojo, Almacén en otro
 * color, etc. `roleId` es estable aunque cambie el nombre del rol.
 */
const ROLE_BANNER_COLORS = [
  "#DC2626", // rojo
  "#127EC9", // azul (brand-primary)
  "#16A34A", // verde
  "#9333EA", // morado
  "#EA580C", // naranja
  "#0E7490", // turquesa
  "#0B3554", // azul marino (brand-dark)
  "#BE185D", // fucsia
] as const;

function roleBannerColor(roleId: string) {
  let hash = 0;
  for (let index = 0; index < roleId.length; index += 1) {
    hash = (hash * 31 + roleId.charCodeAt(index)) >>> 0;
  }
  return ROLE_BANNER_COLORS[hash % ROLE_BANNER_COLORS.length];
}

function formatDate(value: string | null) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminUsersCards({
  users,
  roles,
  currentUserId,
}: {
  users: PanelUser[];
  roles: PanelRole[];
  currentUserId: string | null;
}) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Record<string, ProfileExtras>>({});
  const [editing, setEditing] = useState<PanelUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createPending, setCreatePending] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setProfiles(parseProfiles(window.localStorage.getItem(PROFILES_KEY)));
  }, []);

  useEffect(() => {
    function openFromHash() {
      if (window.location.hash === "#nuevo-usuario") {
        setCreating(true);
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const rolesOf = (user: PanelUser) =>
    user.roleIds
      .map((roleId) => roles.find((role) => role.id === roleId))
      .filter((role): role is PanelRole => Boolean(role));

  function closeEdit() {
    setEditing(null);
  }

  function closeCreating() {
    setCreating(false);
    setCreateError("");
    if (window.location.hash === "#nuevo-usuario") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError("");
    setCreatePending(true);
    const form = new FormData(event.currentTarget);
    const roleIds = form.getAll("roleIds").map((value) => String(value));
    try {
      const result = await createUserAction({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        roleIds,
        password: String(form.get("password") ?? ""),
      });
      if (!result.ok) {
        setCreateError(result.message);
        return;
      }
      closeCreating();
      router.refresh();
    } catch (cause) {
      setCreateError(
        cause instanceof Error ? cause.message : "No se pudo crear el usuario.",
      );
    } finally {
      setCreatePending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Staff con acceso a este panel. El login de &quot;Mi cuenta&quot; en la
          tienda valida contra esta lista. Distinto de &quot;Clientes&quot;, que son
          cuentas de la tienda.
        </p>
        <button
          type="button"
          id="nuevo-usuario"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Nuevo usuario
        </button>
      </div>

      {users.length === 0 ? (
        <p className="rounded-2xl border border-brand-dark/10 bg-white px-4 py-8 text-center text-sm text-brand-dark/55 shadow-sm">
          No hay usuarios del panel todavía.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => (
            <UserBadgeCard
              key={user.id}
              user={user}
              roles={rolesOf(user)}
              photo={profiles[user.id]?.photo ?? ""}
              phone={profiles[user.id]?.phone ?? ""}
              onEdit={() => setEditing(user)}
            />
          ))}
        </ul>
      )}

      {editing
        ? createPortal(
            <EditUserModal
              user={editing}
              roles={roles}
              photo={profiles[editing.id]?.photo ?? ""}
              isSelf={editing.id === currentUserId}
              onClose={closeEdit}
            />,
            document.body,
          )
        : null}

      {creating
        ? createPortal(
            <NewUserModal
              roles={roles}
              pending={createPending}
              error={createError}
              onSubmit={handleCreate}
              onClose={closeCreating}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

function UserBadgeCard({
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

function EditUserModal({
  user,
  roles,
  photo,
  isSelf,
  onClose,
}: {
  user: PanelUser;
  roles: PanelRole[];
  photo: string;
  isSelf: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [roleIds, setRoleIds] = useState<string[]>(user.roleIds);
  const [status, setStatus] = useState(user.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  function toggleRole(roleId: string) {
    setRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (roleIds.length === 0) {
      setError("Asigna al menos un rol.");
      return;
    }
    setSaving(true);
    try {
      const result = await updateUserAction(user.id, {
        name,
        email,
        roleIds,
        ...(password ? { password } : {}),
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setPassword("");
      setSaved(true);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el usuario.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    const nextStatus: PanelUserStatus = status === "active" ? "suspended" : "active";
    setError("");
    setPending(true);
    try {
      const result = await updateUserStatusAction(user.id, nextStatus);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus(nextStatus);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar el usuario.");
    } finally {
      setPending(false);
    }
  }

  async function confirmDelete() {
    setError("");
    setDeletePending(true);
    try {
      const result = await deleteUserAction(user.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo borrar el usuario.");
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="animate-hero-enter relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35)]">
        <div className="flex items-center justify-between border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
          <p
            id="edit-user-modal-title"
            className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
          >
            Editar usuario
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-h-[min(80vh,700px)] overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3">
            <AccountAvatar photo={photo} name={name} size={56} />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold text-brand-dark">
                {name}
              </p>
              <span
                className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${STATUS_BADGE[status]}`}
              >
                {STATUS_LABEL[status]}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-brand-dark/50">
            Último acceso: {formatDate(user.lastLoginAt)}
          </p>

          <form onSubmit={handleSave} className="mt-4 space-y-4 border-t border-brand-dark/10 pt-4">
            <label className="block text-sm font-semibold">
              Nombre
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
              />
            </label>

            <label className="block text-sm font-semibold">
              Correo
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
              />
            </label>

            <label className="block text-sm font-semibold">
              Nueva contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                autoComplete="new-password"
                placeholder="Dejar en blanco para no cambiarla"
                className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-semibold">Roles</legend>
              {isSelf ? (
                <p className="mt-1 text-xs text-brand-dark/50">
                  No puedes cambiar tus propios roles mientras tienes la sesión abierta.
                </p>
              ) : null}
              <div className="mt-2 space-y-1.5">
                {roles.map((role) => {
                  const checked = roleIds.includes(role.id);
                  return (
                    <label
                      key={role.id}
                      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm font-normal ${
                        checked ? "border-brand-primary bg-brand-primary/5" : "border-brand-dark/15"
                      } ${isSelf ? "opacity-60" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isSelf}
                        onChange={() => toggleRole(role.id)}
                        className="mt-0.5 rounded border-brand-dark/20"
                      />
                      <span>
                        <span className="block font-semibold">{role.name}</span>
                        <span className="block text-xs text-brand-dark/55">
                          {role.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {error ? (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            {saved ? (
              <p className="text-sm font-medium text-brand-primary" role="status">
                Cambios guardados.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </form>

          {isSelf ? (
            <p className="mt-4 rounded-lg bg-brand-gray px-3 py-2 text-xs text-brand-dark/60">
              Esta es tu propia cuenta — no puedes suspenderla ni borrarla mientras
              tienes la sesión abierta.
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 border-t border-brand-dark/10 pt-4">
            <button
              type="button"
              disabled={isSelf || pending}
              onClick={toggleStatus}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                status === "active"
                  ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  : "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {status === "active" ? (
                <Ban className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {pending
                ? "Guardando…"
                : status === "active"
                  ? "Deshabilitar usuario"
                  : "Habilitar usuario"}
            </button>

            {confirmingDelete ? (
              <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  ¿Seguro que quieres borrar a {name}? No se puede deshacer.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={deletePending}
                    onClick={confirmDelete}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {deletePending ? "Borrando…" : "Sí, borrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="flex-1 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={isSelf}
                onClick={() => setConfirmingDelete(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Borrar usuario
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewUserModal({
  roles,
  pending,
  error,
  onSubmit,
  onClose,
}: {
  roles: PanelRole[];
  pending: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-user-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="animate-hero-enter relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35)]">
        <div className="flex items-center justify-between border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
          <p
            id="new-user-modal-title"
            className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
          >
            Nuevo usuario
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="max-h-[min(80vh,640px)] space-y-4 overflow-y-auto px-5 py-5"
        >
          <p className="text-sm text-brand-dark/65">
            Llama a <code>createUser()</code> (mock). Queda <code>active</code> y
            puede entrar desde &quot;Mi cuenta&quot; con nombre o correo.
          </p>

          <label className="block text-sm font-semibold">
            Nombre
            <input
              name="name"
              required
              autoFocus
              className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Correo
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Contraseña
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
          </label>

          <fieldset>
            <legend className="text-sm font-semibold">
              Roles <span className="font-normal text-brand-dark/50">(elige uno o más)</span>
            </legend>
            <div className="mt-2 space-y-1.5">
              {roles.map((role, index) => (
                <label
                  key={role.id}
                  className="flex items-start gap-2 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-normal"
                >
                  <input
                    type="checkbox"
                    name="roleIds"
                    value={role.id}
                    defaultChecked={index === 0}
                    className="mt-0.5 rounded border-brand-dark/20"
                  />
                  <span>
                    <span className="block font-semibold">{role.name}</span>
                    <span className="block text-xs text-brand-dark/55">
                      {role.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-extrabold text-brand-dark hover:bg-[#f0c52a] disabled:opacity-60"
            >
              {pending ? "Guardando…" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
