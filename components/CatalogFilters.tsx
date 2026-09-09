"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { mainCategories } from "@/data/home";
import { getCatalogBrands } from "@/data/products";

type CatalogFiltersProps = {
  q: string;
  category: string;
  brand: string;
};

export default function CatalogFilters({
  q,
  category,
  brand,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brands = getCatalogBrands();

  function updateFilter(key: "q" | "category" | "brand", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname);
  }

  return (
    <form
      className="grid gap-3 rounded-2xl border border-brand-dark/10 bg-white p-4 sm:grid-cols-3 dark:bg-[#102a40]"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
          Buscar
        </span>
        <input
          type="search"
          defaultValue={q}
          key={q}
          onBlur={(event) => updateFilter("q", event.target.value.trim())}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              updateFilter("q", event.currentTarget.value.trim());
            }
          }}
          placeholder="Nombre, SKU o marca"
          className="w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
          Categoría
        </span>
        <select
          value={category}
          onChange={(event) => updateFilter("category", event.target.value)}
          className="w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
        >
          <option value="">Todas</option>
          {mainCategories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
          Marca
        </span>
        <select
          value={brand}
          onChange={(event) => updateFilter("brand", event.target.value)}
          className="w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
        >
          <option value="">Todas</option>
          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
