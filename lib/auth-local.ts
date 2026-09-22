export const ACCOUNTS_KEY = "chamo-accounts-v1";
export const SESSION_KEY = "chamo-session-v1";
export const PROFILES_KEY = "chamo-profiles-v1";

export type AuthRole = "customer" | "admin";

export type ProfileExtras = {
  phone: string;
  photo: string;
  company: string;
  ruc: string;
  bio: string;
  banner: string;
};

export type ProfilePatch = {
  name: string;
} & ProfileExtras;

export const BIO_MAX_LENGTH = 160;

export type StoredAccount = {
  /** Identificador estable de la cuenta (no depende del email, que se puede cambiar). */
  id: string;
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  role: AuthRole;
} & ProfileExtras;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
} & ProfileExtras;

export function emptyProfile(): ProfileExtras {
  return { phone: "", photo: "", company: "", ruc: "", bio: "", banner: "" };
}

export function readProfileFields(value: Record<string, unknown>): ProfileExtras {
  return {
    phone: typeof value.phone === "string" ? value.phone : "",
    photo: typeof value.photo === "string" ? value.photo : "",
    company: typeof value.company === "string" ? value.company : "",
    ruc: typeof value.ruc === "string" ? value.ruc : "",
    bio: typeof value.bio === "string" ? value.bio : "",
    banner: typeof value.banner === "string" ? value.banner : "",
  };
}

export function profileOf(user: Pick<AuthUser, keyof ProfileExtras> | ProfileExtras): ProfileExtras {
  return {
    phone: user.phone ?? "",
    photo: user.photo ?? "",
    company: user.company ?? "",
    ruc: user.ruc ?? "",
    bio: user.bio ?? "",
    banner: user.banner ?? "",
  };
}

export function applyProfileExtras(
  user: AuthUser,
  extras: ProfileExtras | undefined,
): AuthUser {
  const base = { ...emptyProfile(), ...user, ...profileOf(user) };
  if (!extras) return base;
  return { ...base, ...extras };
}

export function isAuthRole(value: unknown): value is AuthRole {
  return value === "customer" || value === "admin";
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return user?.role === "admin";
}

export function toAuthUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    ...profileOf(account),
  };
}

/** UUID v4 si el navegador lo soporta; si no, un hex aleatorio del mismo largo. */
export function randomId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function firstName(name: string) {
  return name.trim().split(/\s+/).filter(Boolean)[0] || "Cuenta";
}

export function accountRoleLabel(
  user: AuthUser,
  hasPanelSession: boolean,
  panelRole?: string,
): string {
  if (hasPanelSession) {
    const staff =
      panelRole === "admin" ? "Cuenta administrador" : "Personal del panel";
    return `${staff} · Teléfono obligatorio para contacto comercial`;
  }
  return user.role === "admin"
    ? "Cuenta administrador · Teléfono obligatorio para contacto comercial"
    : "Cliente mayorista";
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

function isStoredAccountShape(
  account: unknown,
): account is Omit<StoredAccount, "id" | "role"> & {
  id?: unknown;
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
      id: typeof account.id === "string" && account.id ? account.id : randomId(),
      name: account.name,
      email: normalizeEmail(account.email),
      salt: account.salt,
      passwordHash: account.passwordHash,
      role: isAuthRole(account.role)
        ? account.role
        : index === 0
          ? "admin"
          : "customer",
      ...readProfileFields(account as unknown as Record<string, unknown>),
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
        id: typeof parsed.id === "string" && parsed.id ? parsed.id : randomId(),
        name: parsed.name,
        email: normalizeEmail(parsed.email),
        role: isAuthRole(parsed.role) ? parsed.role : "customer",
        ...readProfileFields(parsed as Record<string, unknown>),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function parseProfiles(raw: string | null): Record<string, ProfileExtras> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const out: Record<string, ProfileExtras> = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!id || !value || typeof value !== "object") continue;
      out[id] = readProfileFields(value as Record<string, unknown>);
    }
    return out;
  } catch {
    return {};
  }
}

export function hydrateSessionUser(
  session: AuthUser | null,
  accounts: StoredAccount[],
): AuthUser | null {
  if (!session) return null;
  const match = accounts.find((account) => account.email === session.email);
  return match
    ? toAuthUser(match)
    : applyProfileExtras(session, undefined);
}

export function validateProfilePatch(
  patch: ProfilePatch,
  options: { requirePhone: boolean },
): string | null {
  const name = patch.name.trim();
  if (name.length < 2) return "Escribe tu nombre (mínimo 2 caracteres).";
  const phone = patch.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (options.requirePhone && !phone) {
    return "El teléfono es obligatorio para contacto comercial.";
  }
  if (phone && digits.length < 6) return "Escribe un teléfono válido.";
  const ruc = patch.ruc.trim();
  if (ruc && !/^\d{8,11}$/.test(ruc.replace(/\s+/g, ""))) {
    return "El RUC debe tener entre 8 y 11 dígitos.";
  }
  if (patch.bio.trim().length > BIO_MAX_LENGTH) {
    return `La descripción no puede superar los ${BIO_MAX_LENGTH} caracteres.`;
  }
  return null;
}

export function updateAccountProfile(
  accounts: StoredAccount[],
  userId: string,
  patch: ProfilePatch,
):
  | { ok: true; accounts: StoredAccount[]; account: StoredAccount }
  | { ok: false; message: string } {
  const index = accounts.findIndex((account) => account.id === userId);
  if (index < 0) return { ok: false, message: "No encontramos esa cuenta." };
  const extras = profileOf(patch);
  const account: StoredAccount = {
    ...accounts[index],
    name: patch.name.trim(),
    ...extras,
  };
  const next = [...accounts];
  next[index] = account;
  return { ok: true, accounts: next, account };
}

// TODO Backend: esta función hashea la contraseña EN EL CLIENTE — solo válido para el
// mock/demo. Un backend real debe recibir la contraseña en texto plano por HTTPS y
// hashearla del lado del servidor (bcrypt/argon2), no reusar hashPassword() de acá.
// Ver API_CONTRACT_TIENDA.md §3 (POST /api/v1/store/register).
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
      id: randomId(),
      name,
      email,
      salt,
      passwordHash,
      role: accounts.length === 0 ? "admin" : "customer",
      ...emptyProfile(),
    },
  };
}

// TODO Backend: reemplazar con fetch('/api/v1/store/login') — ver API_CONTRACT_TIENDA.md §3.
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
