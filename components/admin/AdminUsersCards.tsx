"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { createUserAction } from "@/app/admin/actions";
import { PROFILES_KEY, parseProfiles, type ProfileExtras } from "@/lib/auth-local";
import type { PanelRole, PanelUser } from "@/types/admin";
import AdminUserBadgeCard from "./AdminUserBadgeCard";
import AdminUserEditModal from "./AdminUserEditModal";
import AdminUserCreateModal from "./AdminUserCreateModal";

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
            <AdminUserBadgeCard
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
            <AdminUserEditModal
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
            <AdminUserCreateModal
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
