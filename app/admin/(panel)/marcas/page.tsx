import CmsImage from "@/components/CmsImage";
import { getBrands } from "@/services/adminApi";

export default async function AdminMarcasPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-dark/65">
        {brands.length} marca{brands.length === 1 ? "" : "s"} · mock{" "}
        <code>getBrands()</code>
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <article
            key={brand.id}
            className="flex items-center gap-4 rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm"
          >
            <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-brand-gray">
              {brand.image ? (
                <CmsImage
                  src={brand.image}
                  alt={brand.name}
                  width={72}
                  height={28}
                  objectFit="contain"
                  className="h-7 w-auto object-contain"
                />
              ) : (
                <span className="font-display text-sm font-bold text-brand-dark/40">
                  {brand.name.slice(0, 3)}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-brand-dark">
                {brand.name}
              </h2>
              <p className="text-sm text-brand-dark/55">
                {brand.productCount} SKU{brand.productCount === 1 ? "" : "s"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
