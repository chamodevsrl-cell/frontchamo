"use client";

import { User } from "lucide-react";

export const PROFILE_AVATAR_PRESETS = [
  { id: "slate", bg: "#94a3b8", fg: "#ffffff" },
  { id: "primary", bg: "#127EC9", fg: "#ffffff" },
  { id: "rose", bg: "#e11d48", fg: "#ffffff" },
  { id: "navy", bg: "#0B3554", fg: "#ffffff" },
  { id: "gold", bg: "#E4B714", fg: "#0B3554" },
] as const;

export function presetPhoto(id: string) {
  return `preset:${id}`;
}

export function isPresetPhoto(photo: string) {
  return photo.startsWith("preset:");
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] || "C") + (parts[1]?.[0] || "");
  return letters.toUpperCase();
}

export default function AccountAvatar({
  photo,
  name,
  size = 40,
  className = "",
}: {
  photo: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const preset = isPresetPhoto(photo)
    ? PROFILE_AVATAR_PRESETS.find((item) => item.id === photo.slice("preset:".length))
    : undefined;
  const custom = photo && !isPresetPhoto(photo) ? photo : "";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: preset?.bg ?? "#0B3554" }}
      aria-hidden
    >
      {custom ? (
        // data: URLs y fotos de perfil no pasan por el optimizer de Next.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={custom} alt="" className="h-full w-full object-cover" />
      ) : preset ? (
        <User
          className="h-[55%] w-[55%]"
          strokeWidth={2.25}
          color={preset.fg}
        />
      ) : (
        <span
          className="font-display font-bold text-white"
          style={{ fontSize: Math.max(11, size * 0.32) }}
        >
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}
