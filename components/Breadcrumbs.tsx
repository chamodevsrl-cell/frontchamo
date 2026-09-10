import Link from "next/link";

export type Crumb = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  items: readonly Crumb[];
  className?: string;
  tone?: "light" | "dark";
};

export default function Breadcrumbs({
  items,
  className,
  tone = "dark",
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const muted = tone === "light" ? "text-white/80" : "text-brand-dark/55 dark:text-white/55";
  const sep = tone === "light" ? "text-white/45" : "text-brand-dark/30 dark:text-white/30";
  const current =
    tone === "light" ? "text-white/45" : "text-brand-dark/40 dark:text-white/40";

  return (
    <nav
      aria-label="Miga de pan"
      className={`flex text-xs font-medium ${muted} ${className ?? ""}`}
    >
      <ol className="flex flex-wrap items-center gap-x-1">
        {items.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="inline-flex items-center gap-x-1">
            {index > 0 ? <span className={sep}>/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className={current}>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
