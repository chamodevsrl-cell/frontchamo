import type { CreateInboxInput, InboxMessage } from "@/types/admin";

/**
 * Bandeja de mensajes públicos (contacto y reclamaciones).
 * En el navegador vive en localStorage para que el panel vea lo que envió la tienda.
 * En tests/SSR queda en memoria del módulo.
 */

export type InboxSource = InboxMessage["source"];
export type InboxStatus = InboxMessage["status"];

export const INBOX_STORAGE_KEY = "chamo-inbox-v1";

let memoryInbox: InboxMessage[] = [];

function newId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `msg_${crypto.randomUUID()}`;
  }
  return `msg_${Math.random().toString(36).slice(2, 10)}`;
}

function isInboxMessage(value: unknown): value is InboxMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.message === "string" &&
    (item.source === "contacto" || item.source === "reclamacion") &&
    (item.status === "new" || item.status === "attended")
  );
}

export function parseInbox(raw: string | null | undefined): InboxMessage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isInboxMessage);
  } catch {
    return [];
  }
}

function loadInbox(): InboxMessage[] {
  if (typeof window !== "undefined") {
    try {
      memoryInbox = parseInbox(window.localStorage.getItem(INBOX_STORAGE_KEY));
    } catch {
      // ignore quota / JSON
    }
  }
  return memoryInbox;
}

function saveInbox(next: InboxMessage[]) {
  memoryInbox = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
}

export function listInbox(source?: InboxSource): InboxMessage[] {
  const all = loadInbox();
  const filtered = source ? all.filter((item) => item.source === source) : all;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function appendInbox(input: CreateInboxInput): InboxMessage {
  const created: InboxMessage = {
    ...input,
    name: input.name.trim(),
    company: input.company.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    topic: input.topic.trim(),
    message: input.message.trim(),
    id: newId(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  saveInbox([created, ...loadInbox()]);
  return created;
}

export function setInboxStatus(id: string, status: InboxStatus): InboxMessage | null {
  const all = loadInbox();
  const match = all.find((item) => item.id === id);
  if (!match) return null;
  match.status = status;
  saveInbox([...all]);
  return { ...match };
}
