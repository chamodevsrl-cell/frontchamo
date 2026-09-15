"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserAction, updateUserStatusAction } from "@/app/admin/actions";
import type { PanelRole, PanelUser, PanelUserStatus } from "@/types/admin";

const STATUS_LABEL: Record<PanelUserStatus, string> = {
  active: "Activo",
  suspended: "Suspendido",
};

function formatDate(value: string | null) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminUsersTable({
  users,
  roles,
}: {
  users: PanelUser[];
  roles: PanelRole[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const roleName = (roleId: string) =>
    roles.find((role) => role.id === roleId)?.name ?? roleId;

  async function changeStatus(userId: string, status: PanelUserStatus) {
    setError("");
    setPendingId(userId);
    try {
      const result = await updateUserStatusAction(userId, status);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "No se pudo actualizar el usuario.",
      );
    } finally {
      setPendingId(null);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreating(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await createUserAction({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        roleId: String(form.get("roleId") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el usuario.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-dark/65">
        Staff con acceso a este panel. El login de &quot;Mi cuenta&quot; en la
        tienda valida contra esta lista. Distinto de &quot;Clientes&quot;, que son
        cuentas de la tienda.
      </p>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Último acceso</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-dark/55">
                  No hay usuarios del panel todavía.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-brand-dark/50">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">{roleName(user.roleId)}</td>
                  <td className="px-4 py-3 text-xs">{formatDate(user.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      disabled={pendingId === user.id}
                      value={user.status}
                      onChange={(event) =>
                        void changeStatus(user.id, event.target.value as PanelUserStatus)
                      }
                      className="rounded-lg border border-brand-dark/15 px-2 py-1 text-sm"
                    >
                      {(Object.keys(STATUS_LABEL) as PanelUserStatus[]).map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <form
        id="nuevo-usuario"
        onSubmit={handleCreate}
        className="max-w-xl scroll-mt-6 space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark">Nuevo usuario</h2>
          <p className="mt-1 text-sm text-brand-dark/65">
            Llama a <code>createUser()</code> (mock). Queda <code>active</code> y
            puede entrar desde &quot;Mi cuenta&quot; con nombre o correo.
          </p>
        </div>

        <label className="block text-sm font-semibold">
          Nombre
          <input
            name="name"
            required
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

        <label className="block text-sm font-semibold">
          Rol
          <select
            name="roleId"
            required
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            defaultValue={roles[0]?.id}
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
        >
          {creating ? "Guardando…" : "Crear usuario"}
        </button>
      </form>
    </div>
  );
}
