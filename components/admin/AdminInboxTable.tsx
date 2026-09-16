"use client";

import { useState } from "react";
import { updateInboxStatus } from "@/services/adminApi";
import type { InboxMessage } from "@/types/admin";

export default function AdminInboxTable({
  initialItems,
}: {
  initialItems: InboxMessage[];
}) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function markAttended(id: string) {
    setError("");
    setPendingId(id);
    try {
      const updated = await updateInboxStatus(id, "attended");
      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-dark/65">
        {items.length} mensaje{items.length === 1 ? "" : "s"} · se guardan en este
        navegador hasta que el backend tenga <code>/api/v1</code>
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
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Asunto</th>
              <th className="px-4 py-3">Mensaje</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-dark/55">
                  Aún no hay mensajes. Llegan desde el formulario público.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
                >
                  <td className="px-4 py-3 text-xs text-brand-dark/60">
                    {new Date(item.createdAt).toLocaleString("es-PE")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-brand-dark/50">
                      {item.phone}
                      {item.company ? ` · ${item.company}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">{item.topic}</td>
                  <td className="max-w-sm px-4 py-3 text-brand-dark/80">{item.message}</td>
                  <td className="px-4 py-3">
                    {item.status === "attended" ? (
                      <span className="text-xs font-bold tracking-wide text-emerald-700 uppercase">
                        Atendido
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={pendingId === item.id}
                        onClick={() => void markAttended(item.id)}
                        className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
                      >
                        Marcar atendido
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
