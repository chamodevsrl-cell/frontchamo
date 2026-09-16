"use client";

import { useEffect, useState } from "react";
import AdminInboxTable from "@/components/admin/AdminInboxTable";
import { getClaims } from "@/services/adminApi";
import type { InboxMessage } from "@/types/admin";

export default function AdminReclamacionesPage() {
  const [items, setItems] = useState<InboxMessage[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void getClaims()
      .then(setItems)
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar.");
        setItems([]);
      });
  }, []);

  if (items === null) {
    return <p className="text-sm text-brand-dark/60">Cargando reclamaciones…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }
  return <AdminInboxTable initialItems={items} />;
}
