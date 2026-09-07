"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import TarjetaProducto from "@/components/TarjetaProducto";
import { productos } from "@/data/productos";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const productosFiltrados = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return productos;
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <Navbar
        cartCount={cartCount}
        search={search}
        onSearchChange={setSearch}
      />

      <section className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold tracking-wide text-zinc-900/80 uppercase">
            Oferta de temporada
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            Importados con envío rápido y precios de locura
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-900/80 sm:text-lg">
            Hasta 30% de descuento en tecnología, accesorios y gadgets. Solo por
            tiempo limitado en Chamo Import.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Productos destacados</h2>
          <p className="text-sm text-zinc-500">
            {productosFiltrados.length} de {productos.length}
          </p>
        </div>

        {productosFiltrados.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
            No encontramos productos para “{search}”.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                onAgregar={() => setCartCount((count) => count + 1)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
