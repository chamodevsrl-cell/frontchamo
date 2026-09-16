export const PROFILES_KEY = "chamo-profiles-v1";

export const AVATAR_PRESETS = [
  { id: "slate", bg: "#94a3b8", fg: "#ffffff" },
  { id: "navy", bg: "#0B3554", fg: "#ffffff" },
  { id: "gold", bg: "#E4B714", fg: "#0B3554" },
  { id: "primary", bg: "#127EC9", fg: "#ffffff" },
  { id: "dark", bg: "#071e30", fg: "#ffffff" },
] as const;

export type AvatarPresetId = (typeof AVATAR_PRESETS)[number]["id"];

export type AccountProfile = {
  phone: string;
  avatarUrl: string;
  avatarPreset: AvatarPresetId;
  companyName: string;
  ruc: string;
  city: string;
  address: string;
  totpEnabled: boolean;
};

export type StoredProfile = AccountProfile & {
  name?: string;
};

const MAX_AVATAR_BYTES = 2.5 * 1024 * 1024;
const AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function emptyAccountProfile(): AccountProfile {
  return {
    phone: "",
    avatarUrl: "",
    avatarPreset: "navy",
    companyName: "",
    ruc: "",
    city: "",
    address: "",
    totpEnabled: false,
  };
}

export function isAvatarPresetId(value: unknown): value is AvatarPresetId {
  return AVATAR_PRESETS.some((preset) => preset.id === value);
}

export function avatarPresetById(id: string) {
  return AVATAR_PRESETS.find((preset) => preset.id === id) ?? AVATAR_PRESETS[1];
}

function pickProfile(row: Record<string, unknown>): AccountProfile {
  return {
    phone: typeof row.phone === "string" ? row.phone : "",
    avatarUrl: typeof row.avatarUrl === "string" ? row.avatarUrl : "",
    avatarPreset: isAvatarPresetId(row.avatarPreset) ? row.avatarPreset : "navy",
    companyName: typeof row.companyName === "string" ? row.companyName : "",
    ruc: typeof row.ruc === "string" ? row.ruc : "",
    city: typeof row.city === "string" ? row.city : "",
    address: typeof row.address === "string" ? row.address : "",
    totpEnabled: row.totpEnabled === true,
  };
}

export function parseStoredProfile(value: unknown): StoredProfile | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  return {
    ...pickProfile(row),
    name: typeof row.name === "string" ? row.name : undefined,
  };
}

export function parseProfiles(raw: string | null): Record<string, StoredProfile> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, StoredProfile> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const email = key.trim().toLowerCase();
      const profile = parseStoredProfile(value);
      if (email.includes("@") && profile) out[email] = profile;
    }
    return out;
  } catch {
    return {};
  }
}

export function mergeAccountProfile(
  base: { name: string } & Partial<AccountProfile>,
  overlay?: StoredProfile | null,
): AccountProfile & { name: string } {
  const empty = emptyAccountProfile();
  return {
    name: overlay?.name?.trim() || base.name,
    phone: overlay?.phone ?? base.phone ?? empty.phone,
    avatarUrl: overlay?.avatarUrl ?? base.avatarUrl ?? empty.avatarUrl,
    avatarPreset: overlay?.avatarPreset ?? base.avatarPreset ?? empty.avatarPreset,
    companyName: overlay?.companyName ?? base.companyName ?? empty.companyName,
    ruc: overlay?.ruc ?? base.ruc ?? empty.ruc,
    city: overlay?.city ?? base.city ?? empty.city,
    address: overlay?.address ?? base.address ?? empty.address,
    totpEnabled: overlay?.totpEnabled ?? base.totpEnabled ?? empty.totpEnabled,
  };
}

export function greetingSurname(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 1];
  return parts[0] || "Cuenta";
}

export function readProfileImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!AVATAR_TYPES.has(file.type)) {
      reject(new Error("Usa JPG, PNG o WebP."));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      reject(new Error("La foto supera 2.5 MB. Usa una más liviana."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}
