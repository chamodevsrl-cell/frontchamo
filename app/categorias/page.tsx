import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryIcon from "@/components/CategoryIcon";
import { mainCategories } from "@/data/home";
import { categoryWhatsappUrl } from "@/data/contact";

export const metadata: Metadata = {
  title: "Categorías | Chamo Import",
  description: "Explora las categorías mayoristas de Chamo Import",
};

export default function CategoriasPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
        <Breadcrumbs
          items={[
            { href: "/", label: "Inicio" },
            { label: "Categorías" },
          ]}
        />
        <p className="mt-4 text-sm font-semibold tracking-wide text-brand-primary uppercase">
          Catálogo
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          Categorías
        </h1>
        <p className="mt-3 max-w-2xl text-brand-dark/70 dark:text-white/70">
          Elige una línea para ver productos de ejemplo, fichas técnicas y cotizar
          por WhatsApp.
        </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mainCategories.map((category, index) => (
            <li key={category.slug}>
              <Reveal delayMs={Math.min(index, 6) * 70}>
              <article className="group flex h-full overflow-hidden rounded-2xl border border-brand-primary/30 bg-white shadow-[0_0_18px_rgba(18,126,201,0.2)] transition hover:-translate-y-0.5 dark:bg-[#102a40]">
                <Link href={category.href} className="relative w-32 shrink-0 sm:w-40">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="160px"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                    <CategoryIcon slug={category.slug} className="h-3.5 w-3.5" />
                    {category.eyebrow}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-brand-dark dark:text-white">
                    <Link href={category.href} className="hover:text-brand-primary">
                      {category.label}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-brand-dark/65 dark:text-white/65">
                    {category.bullets[0]}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                    <Link
                      href={category.href}
                      className="text-sm font-semibold text-brand-primary hover:underline"
                    >
                      Explorar
                    </Link>
                    <a
                      href={categoryWhatsappUrl(category.label)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark/70 hover:text-brand-whatsapp dark:text-white/70"
                    >
                      <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Cotizar línea
                    </a>
                  </div>
                </div>
              </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
