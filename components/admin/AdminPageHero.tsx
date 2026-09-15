import Link from "next/link";
import type { AdminHero } from "@/lib/admin-hero";

export default function AdminPageHero({ title, action }: AdminHero) {
  return (
    <section
      className="admin-page-hero relative isolate overflow-hidden rounded-2xl px-5 py-6 sm:px-8 sm:py-7"
      aria-labelledby="admin-page-hero-title"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-brand-gold" />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.28em] text-brand-gold uppercase">
            Chamo
          </p>
          <h1
            id="admin-page-hero-title"
            className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
          >
            {title}
          </h1>
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex shrink-0 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-extrabold text-brand-dark shadow-[0_8px_22px_rgba(228,183,20,0.4)] transition hover:bg-[#f0c52a]"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
