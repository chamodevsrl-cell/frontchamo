"use client";

type NavbarProps = {
  cartCount: number;
  search: string;
  onSearchChange: (value: string) => void;
};

export default function Navbar({
  cartCount,
  search,
  onSearchChange,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
        <a href="/" className="shrink-0 text-xl font-bold tracking-tight text-amber-700">
          Chamo Import
        </a>

        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Buscar productos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-full border border-zinc-300 bg-zinc-50 py-2.5 pr-4 pl-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </label>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6 5 3H2" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
          </svg>
          Carrito
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-zinc-900">
            {cartCount}
          </span>
        </button>
      </nav>
    </header>
  );
}
