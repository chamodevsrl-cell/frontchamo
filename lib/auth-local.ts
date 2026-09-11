export const ACCOUNTS_KEY = "chamo-accounts-v1";
export const SESSION_KEY = "chamo-session-v1";

export type AuthRole = "customer" | "admin";

export type StoredAccount = {
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  role: AuthRole;
};

export type AuthUser = {
  name: string;
  email: string;
  role: AuthRole;
};

export function isAuthRole(value: unknown): value is AuthRole {
  return value === "customer" || value === "admin";
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return user?.role === "admin";
}

export function toAuthUser(account: StoredAccount): AuthUser {
  return { name: account.name, email: account.email, role: account.role };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function firstName(name: string) {
  return name.trim().split(/\s+/).filter(Boolean)[0] || "Cuenta";
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(buffer));
}

function isStoredAccountShape(account: unknown): account is Omit<StoredAccount, "role"> & {
  role?: unknown;
} {
  if (!account || typeof account !== "object") return false;
  const row = account as Record<string, unknown>;
  return (
    typeof row.name === "string" &&
    typeof row.email === "string" &&
    typeof row.salt === "string" &&
    typeof row.passwordHash === "string"
  );
}

export function parseAccounts(raw: string | null): StoredAccount[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const rows = parsed.filter(isStoredAccountShape);
    return rows.map((account, index) => ({
      name: account.name,
      email: normalizeEmail(account.email),
      salt: account.salt,
      passwordHash: account.passwordHash,
      role: isAuthRole(account.role)
        ? account.role
        : index === 0
          ? "admin"
          : "customer",
    }));
  } catch {
    return [];
  }
}

export function parseSession(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      typeof parsed?.name === "string" &&
      typeof parsed?.email === "string" &&
      parsed.email.includes("@")
    ) {
      return {
        name: parsed.name,
        email: normalizeEmail(parsed.email),
        role: isAuthRole(parsed.role) ? parsed.role : "customer",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function hydrateSessionUser(
  session: AuthUser | null,
  accounts: StoredAccount[],
): AuthUser | null {
  if (!session) return null;
  const match = accounts.find((account) => account.email === session.email);
  return match ? toAuthUser(match) : session;
}

export async function createAccount(
  accounts: StoredAccount[],
  input: { name: string; email: string; password: string },
): Promise<{ ok: true; account: StoredAccount } | { ok: false; error: string }> {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Escribe tu nombre." };
  if (!email.includes("@")) return { ok: false, error: "Correo no válido." };
  if (input.password.length < 6) {
    return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (accounts.some((account) => account.email === email)) {
    return { ok: false, error: "Ya hay una cuenta con ese correo en este navegador." };
  }
  const salt = randomSalt();
  const passwordHash = await hashPassword(input.password, salt);
  return {
    ok: true,
    account: {
      name,
      email,
      salt,
      passwordHash,
      role: accounts.length === 0 ? "admin" : "customer",
    },
  };
}

export async function verifyAccount(
  accounts: StoredAccount[],
  email: string,
  password: string,
): Promise<StoredAccount | null> {
  const normalized = normalizeEmail(email);
  const account = accounts.find((item) => item.email === normalized);
  if (!account) return null;
  const passwordHash = await hashPassword(password, account.salt);
  return passwordHash === account.passwordHash ? account : null;
}
