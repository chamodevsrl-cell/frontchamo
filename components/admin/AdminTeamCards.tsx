"use client";

import { useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { defaultTeam, TEAM_ROLES, type TeamMember } from "@/data/team";

export default function AdminTeamCards() {
  const { cms, ready } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando equipo…</p>;
  }

  return <AdminTeamCardsForm initial={cms.team} />;
}

function AdminTeamCardsForm({ initial }: { initial: TeamMember[] }) {
  const { saveCms } = useSiteContent();
  const [members, setMembers] = useState<TeamMember[]>(() =>
    initial.map((member) => ({ ...member })),
  );
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function persist() {
    const saveError = saveCms({ team: members });
    if (saveError) {
      setError(saveError);
      setNotice("");
      return;
    }
    setError("");
    setNotice("Equipo guardado. Se ve en Nosotros, sección Trabajo.");
  }

  function restore() {
    const next = defaultTeam.map((member) => ({ ...member }));
    setMembers(next);
    saveCms({ team: next });
    setError("");
    setNotice("Volviste al equipo de ejemplo.");
  }

  function update(id: string, patch: Partial<TeamMember>) {
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, ...patch } : member)),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Cartas de colaboradores: gerente, asesor, vendedor, tienda, TI.
          Lo que guardes aquí aparece en `/nosotros`.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setMembers((current) => [
                ...current,
                {
                  id: `tm_${Date.now()}`,
                  name: "Nuevo colaborador",
                  role: "Vendedor",
                  photo: "/images/categorias/herramientas.jpg",
                  bio: "",
                },
              ])
            }
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            Nuevo colaborador
          </button>
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-white px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
          <button
            type="button"
            onClick={restore}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar
          </button>
        </div>
      </div>
      {notice ? (
        <p role="status" className="text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <li
            key={member.id}
            className="rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-[0_8px_24px_rgba(11,53,84,0.08)]"
          >
            <CmsImageField
              value={member.photo}
              onChange={(photo) => update(member.id, { photo })}
              label="Foto"
              previewClassName="h-44 w-full"
            />
            <label className="mt-3 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
              Nombre
              <input
                className={`${fieldClass} mt-1`}
                value={member.name}
                onChange={(event) => update(member.id, { name: event.target.value })}
              />
            </label>
            <label className="mt-2 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
              Cargo
              <select
                className={`${fieldClass} mt-1`}
                value={
                  TEAM_ROLES.includes(member.role as (typeof TEAM_ROLES)[number])
                    ? member.role
                    : "Otro"
                }
                onChange={(event) => update(member.id, { role: event.target.value })}
              >
                {TEAM_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            {member.role === "Otro" ||
            !TEAM_ROLES.includes(member.role as (typeof TEAM_ROLES)[number]) ? (
              <label className="mt-2 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                Cargo personalizado
                <input
                  className={`${fieldClass} mt-1`}
                  value={member.role === "Otro" ? "" : member.role}
                  onChange={(event) => update(member.id, { role: event.target.value })}
                  placeholder="Ej. Coordinador de almacén"
                />
              </label>
            ) : null}
            <label className="mt-2 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
              Bio
              <textarea
                className={`${fieldClass} mt-1 min-h-20`}
                value={member.bio}
                onChange={(event) => update(member.id, { bio: event.target.value })}
              />
            </label>
            <div className="mt-3 flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm text-brand-dark">
                <input
                  type="checkbox"
                  checked={Boolean(member.hidden)}
                  onChange={(event) =>
                    update(member.id, { hidden: event.target.checked })
                  }
                />
                Ocultar en la web
              </label>
              <button
                type="button"
                onClick={() =>
                  setMembers((current) =>
                    current.filter((item) => item.id !== member.id),
                  )
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
