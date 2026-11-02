import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CatalogPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

function pageHref(
  page: number,
  basePath: string,
  query?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  return [...set]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

export default function CatalogPagination({
  page,
  totalPages,
  total,
  pageSize,
  basePath,
  query,
}: CatalogPaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = pageNumbers(page, totalPages);

  return (
    <nav
      className="flex flex-col items-center gap-3"
      aria-label="Paginación de productos"
    >
      <p className="text-center text-sm text-brand-dark/65 dark:text-white/65">
        Mostrando{" "}
        <span className="font-semibold text-brand-dark dark:text-white">
          {from}–{to}
        </span>{" "}
        de {total}
      </p>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Link
            href={pageHref(Math.max(1, page - 1), basePath, query)}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
              page === 1
                ? "pointer-events-none border-brand-dark/10 text-brand-dark/30"
                : "border-brand-dark/15 text-brand-dark hover:border-brand-primary hover:text-brand-primary"
            }`}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </Link>

          {pages.map((item, index) => {
            const previous = pages[index - 1];
            const selected = item === page;
            return (
              <span key={item} className="inline-flex items-center gap-1.5">
                {previous && item - previous > 1 ? (
                  <span className="px-1 text-brand-dark/40" aria-hidden>
                    …
                  </span>
                ) : null}
                <Link
                  href={pageHref(item, basePath, query)}
                  aria-current={selected ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-2.5 text-sm font-bold transition ${
                    selected
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-dark/15 text-brand-dark hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  {item}
                </Link>
              </span>
            );
          })}

          <Link
            href={pageHref(Math.min(totalPages, page + 1), basePath, query)}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
              page === totalPages
                ? "pointer-events-none border-brand-dark/10 text-brand-dark/30"
                : "border-brand-dark/15 text-brand-dark hover:border-brand-primary hover:text-brand-primary"
            }`}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
