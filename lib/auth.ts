/**
 * Sesión del Panel Admin (independiente de la tienda).
 *
 * Tienda pública: `lib/auth-local.ts` (`chamo-accounts-v1` / `chamo-session-v1`).
 * Panel admin: cookie `chamo_admin_session` + `localStorage` `chamo-admin-session-v1`.
 *
 * El layout `app/admin/(panel)/layout.tsx` lee la cookie en el servidor
 * (sin delay de 300 ms). El mock de login vive en `services/adminApi.ts`.
 */

import type { AdminRole, AuthSession } from "@/types/admin";

/** Cookie leída por el layout del panel. En producción: httpOnly + Secure. */
export const ADMIN_SESSION_COOKIE = "chamo_admin_session";

/** Copia de la sesión en el navegador (solo mock; el backend no debe depender de esto). */
export const ADMIN_SESSION_STORAGE_KEY = "chamo-admin-session-v1";

/** 8 horas. */
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

const ADMIN_ROLES: readonly AdminRole[] = ["admin", "editor"];

/** JSON de sesión. `cookies().set` de Next lo escapa; `document.cookie` usa {@link encodeAdminSessionCookie}. */
export function serializeAdminSession(session: AuthSession): string {
  return JSON.stringify(session);
}

/** Valor listo para `document.cookie` (el JSON lleva comillas). */
export function encodeAdminSessionCookie(session: AuthSession): string {
  return encodeURIComponent(serializeAdminSession(session));
}

/** Type guard del JSON de sesión (cookie o localStorage). */
export function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Record<string, unknown>;
  return (
    typeof session.id === "string" &&
    session.id.length > 0 &&
    typeof session.name === "string" &&
    typeof session.email === "string" &&
    typeof session.token === "string" &&
    session.token.length > 0 &&
    ADMIN_ROLES.includes(session.role as AdminRole)
  );
}

/** Parsea el valor crudo de cookie / storage. Devuelve `null` si está corrupto. */
export function parseAdminSession(raw: string | undefined | null): AuthSession | null {
  if (!raw) return null;
  const candidates = [raw];
  try {
    candidates.push(decodeURIComponent(raw));
  } catch {
    // el valor ya venía sin encode
  }
  for (const text of candidates) {
    try {
      const data: unknown = JSON.parse(text);
      if (isAuthSession(data)) return data;
    } catch {
      // probar el siguiente candidato
    }
  }
  return null;
}

function readCookieFromDocument(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split("; ");
  const match = parts.find((part) => part.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}

function writeBrowserCookie(session: AuthSession) {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=${encodeAdminSessionCookie(session)}; Path=/; Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function clearBrowserCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function readBrowserSession(): AuthSession | null {
  const fromCookie = parseAdminSession(readCookieFromDocument(ADMIN_SESSION_COOKIE));
  if (fromCookie) return fromCookie;
  if (typeof localStorage === "undefined") return null;
  try {
    return parseAdminSession(localStorage.getItem(ADMIN_SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * Persiste la sesión en cookie (legible por el layout) y localStorage.
 * En producción el backend debería mandar `Set-Cookie` httpOnly; este helper
 * es solo para el mock.
 */
export function persistAdminSession(session: AuthSession): void {
  writeBrowserCookie(session);
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Quota / modo privado: la cookie basta para el layout.
  }
}

/** Borra cookie y localStorage en el navegador. */
export function clearAdminSessionClient(): void {
  clearBrowserCookie();
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Lee la sesión actual.
 * - Servidor: cookie HTTP (sin latencia artificial).
 * - Cliente: cookie y, si falta, localStorage.
 */
export async function getAdminSession(): Promise<AuthSession | null> {
  if (typeof window !== "undefined") {
    return readBrowserSession();
  }

  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return parseAdminSession(store.get(ADMIN_SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

/**
 * Cierra la sesión del panel: limpia cookie + localStorage.
 * El caller debe navegar a `/admin/login` (p. ej. `router.replace`).
 * No toca la cuenta de la tienda (`chamo-session-v1`).
 */
export async function logoutAdmin(): Promise<void> {
  clearAdminSessionClient();
  try {
    const { clearAdminSessionCookie } = await import("@/app/admin/actions");
    await clearAdminSessionCookie();
  } catch {
    // Fuera de Next (tests) o si la action falla: la cookie de cliente ya se borró.
  }
}
