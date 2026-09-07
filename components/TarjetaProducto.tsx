"use client";

import Image from "next/image";
import type { Producto } from "@/data/productos";

type TarjetaProductoProps = {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
};

function formatPrecio(precio: number) {
  return `$${precio.toFixed(2)}`;
}

export default function TarjetaProducto({
  producto,
  onAgregar,
}: TarjetaProductoProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square bg-zinc-100">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-zinc-900">{producto.nombre}</h3>
        <p className="text-lg font-bold text-amber-700">
          {formatPrecio(producto.precio)}
        </p>
        <button
          type="button"
          onClick={() => onAgregar(producto)}
          className="mt-auto w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-400"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
