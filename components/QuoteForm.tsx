"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { featuredProducts, getProductById } from "@/data/products";
import { openWhatsApp } from "@/data/contact";
import { formatPrice } from "@/lib/format";

const DEFAULT_SKU_PARAM = "sku";

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const { lines } = useCart();
  const skuFromUrl = searchParams.get(DEFAULT_SKU_PARAM) ?? "";
  const productFromUrl = skuFromUrl
    ? featuredProducts.find(
        (item) => item.sku.toLowerCase() === skuFromUrl.toLowerCase(),
      )
    : undefined;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [ruc, setRuc] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [sku, setSku] = useState(productFromUrl?.sku ?? "");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  const selectedProduct = useMemo(
    () => featuredProducts.find((item) => item.sku === sku),
    [sku],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const extraProduct = sku ? getProductById(selectedProduct?.id ?? "") : undefined;
    const linesText = [
      ...lines.map(
        (line) =>
          `- ${line.product.name} (${line.product.sku}) x${line.qty} · mayorista ${formatPrice(line.product.wholesalePrice)}`,
      ),
      extraProduct && !lines.some((line) => line.productId === extraProduct.id)
        ? `- ${extraProduct.name} (${extraProduct.sku}) x${qty} · mayorista ${formatPrice(extraProduct.wholesalePrice)}`
        : extraProduct
          ? `- Extra: ${extraProduct.name} (${extraProduct.sku}) x${qty}`
          : sku
            ? `- SKU ${sku} x${qty}`
            : null,
    ]
      .filter(Boolean)
      .join("\n");

    const message = [
      `Hola, soy ${name}${company ? ` de ${company}` : ""}.`,
      ruc ? `RUC: ${ruc}` : null,
      `Teléfono: ${phone}`,
      email ? `Correo: ${email}` : null,
      city ? `Ciudad: ${city}` : null,
      "",
      "Quiero una cotización mayorista:",
      linesText || "- (sin ítems de carrito; consultar catálogo general)",
      notes ? `\nNotas: ${notes}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    openWhatsApp(message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-5 sm:p-6 dark:bg-[#102a40]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Nombre
          </span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Empresa
          </span>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            RUC
          </span>
          <input
            value={ruc}
            onChange={(event) => setRuc(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Teléfono
          </span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Correo
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Ciudad
          </span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Producto a cotizar
          </span>
          <select
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          >
            <option value="">Catálogo general / carrito</option>
            {featuredProducts.map((product) => (
              <option key={product.id} value={product.sku}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Cantidad
          </span>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
            className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
          />
        </label>
      </div>

      {lines.length > 0 ? (
        <div className="rounded-xl bg-brand-gray/70 px-3 py-3 text-sm text-brand-dark dark:bg-brand-dark/50 dark:text-white">
          <p className="font-semibold">También se incluirán {lines.length} ítem(s) del carrito.</p>
          <p className="mt-1">
            <Link href="/carrito" className="text-brand-primary hover:underline">
              Revisar carrito
            </Link>
          </p>
        </div>
      ) : null}

      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
          Notas
        </span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white"
        />
      </label>

      <button
        type="submit"
        className="inline-flex rounded-lg bg-brand-whatsapp px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
      >
        Enviar cotización por WhatsApp
      </button>
    </form>
  );
}
