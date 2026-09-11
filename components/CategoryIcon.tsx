import type { LucideIcon } from "lucide-react";
import {
  Hammer,
  HardHat,
  House,
  PaintBucket,
  Shield,
  Wrench,
  Zap,
} from "lucide-react";

const bySlug: Record<string, LucideIcon> = {
  ferreteria: Wrench,
  electricos: Zap,
  seguridad: Shield,
  hogar: House,
  herramientas: Hammer,
  construccion: HardHat,
  pinturas: PaintBucket,
};

type CategoryIconProps = {
  slug: string;
  className?: string;
};

export default function CategoryIcon({ slug, className }: CategoryIconProps) {
  const Icon = bySlug[slug] ?? Wrench;
  return <Icon className={className} strokeWidth={2.25} aria-hidden />;
}
