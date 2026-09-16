"use client";

import { useEffect, useState } from "react";
import AdminInboxTable from "@/components/admin/AdminInboxTable";
import { getContacts } from "@/services/adminApi";
import type { InboxMessage } from "@/types/admin";

export default function AdminContactosPage() {
  const [items, setItems] = useState<InboxMessage[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void getContacts()
      .then(setItems)
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar.");
        setItems([]);
      });
  }, []);

  if (items === null) {
    return <p className="text-sm text-brand-dark/60">Cargando contactos…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }
  return <AdminInboxTable initialItems={items} />;
}
