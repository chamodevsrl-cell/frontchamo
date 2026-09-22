"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Trash2, X } from "lucide-react";
import {
  deleteUserAction,
  updateUserAction,
  updateUserStatusAction,
} from "@/app/admin/actions";
import AccountAvatar from "@/components/AccountAvatar";
import type { PanelRole, PanelUser, PanelUserStatus } from "@/types/admin";
import { STATUS_BADGE, STATUS_LABEL, formatDate } from "./adminUserBadge";

export default function AdminUserEditModal({
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
