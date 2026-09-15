"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createRoleAction } from "@/app/admin/actions";
import type { AdminPermission, PanelRole } from "@/types/admin";

const PERMISSIONS: { id: AdminPermission; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "productos", label: "Productos" },
  { id: "categorias", label: "Categorías" },
  { id: "marcas", label: "Marcas" },
  { id: "pedidos", label: "Pedidos" },
  { id: "clientes", label: "Clientes" },
  { id: "inventario", label: "Inventario" },
  { id: "ofertas", label: "Ofertas" },
  { id: "banners", label: "Banners" },
  { id: "reportes", label: "Reportes" },
  { id: "usuarios", label: "Usuarios" },
  { id: "roles", label: "Roles" },
  { id: "configuracion", label: "Ajustes" },
];

const PERMISSION_LABEL = new Map(PERMISSIONS.map((item) => [item.id, item.label]));

export default function AdminRolesView({ roles }: { roles: PanelRole[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreating(true);
    const form = new FormData(event.currentTarget);
    const permissions = form.getAll("permissions").map((value) => String(value)) as AdminPermission[];
    try {
      const result = await createRoleAction({
        name: String(form.get("name") ?? ""),
        description: String(form.get("description") ?? ""),
        permissions,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el rol.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-dark/65">
        Permisos por sección del panel. Mock <code>getRoles()</code> /{" "}
        <code>createRole()</code>. Administrador y Editor son roles base (no se pueden
        borrar).
      </p>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-primary" strokeWidth={2} />
                <h2 className="font-display text-base font-bold text-brand-dark">
                  {role.name}
                </h2>
              </div>
              {role.isSystem ? (
                <span className="rounded-full bg-brand-gray px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-dark/60 uppercase">
                  Sistema
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-brand-dark/60">{role.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full bg-[#eef6fc] px-2 py-0.5 text-[11px] font-semibold text-brand-primary"
                >
                  {PERMISSION_LABEL.get(permission) ?? permission}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        id="nuevo-rol"
        onSubmit={handleCreate}
        className="max-w-2xl scroll-mt-6 space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark">Nuevo rol</h2>
          <p className="mt-1 text-sm text-brand-dark/65">
            Llama a <code>createRole()</code> (mock). Queda disponible para asignar en
            Usuarios.
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
          Descripción
          <input
            name="description"
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-semibold">Secciones habilitadas</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PERMISSIONS.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center gap-2 text-sm font-normal"
              >
                <input
                  type="checkbox"
                  name="permissions"
                  value={permission.id}
                  className="rounded border-brand-dark/20"
                />
                {permission.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
        >
          {creating ? "Guardando…" : "Crear rol"}
        </button>
      </form>
    </div>
  );
}
