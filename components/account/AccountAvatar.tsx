"use client";

import { User } from "lucide-react";
import { avatarPresetById } from "@/lib/account-profile";
import type { AuthUser } from "@/lib/auth-local";

type AccountAvatarProps = {
  user: Pick<AuthUser, "name" | "avatarUrl" | "avatarPreset">;
  size?: number;
  className?: string;
};

export default function AccountAvatar({
  user,
  size = 56,
  className = "",
}: AccountAvatarProps) {
  const preset = avatarPresetById(user.avatarPreset);
  const dim = `${size}px`;

  if (user.avatarUrl) {
    return (
      // data: URL local; next/image no aplica aquí
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={`Foto de ${user.name}`}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: dim, height: dim }}
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: dim, height: dim, backgroundColor: preset.bg, color: preset.fg }}
      aria-hidden
    >
      <User style={{ width: size * 0.48, height: size * 0.48 }} strokeWidth={2} />
    </span>
  );
}
