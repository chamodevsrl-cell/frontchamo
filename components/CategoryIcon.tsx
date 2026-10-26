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
import CmsImage from "@/components/CmsImage";

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
  /** Imagen opcional (URL, ruta o data URL). Si no hay, se usa el icono Lucide del slug. */
  icon?: string;
  className?: string;
};

export default function CategoryIcon({
  slug,
  icon,
  className,
}: CategoryIconProps) {
  const src = icon?.trim();
  if (src) {
    return (
      <span className={`relative inline-block overflow-hidden ${className ?? ""}`}>
        <CmsImage
          src={src}
          alt=""
          fill
          objectFit="contain"
          className="object-contain"
        />
      </span>
    );
  }

  const Icon = bySlug[slug] ?? Wrench;
  return <Icon className={className} strokeWidth={2.25} aria-hidden />;
}
