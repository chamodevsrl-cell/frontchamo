import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import Reveal from "@/components/Reveal";

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonios-heading">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-8 w-1 rounded-full bg-brand-primary" aria-hidden />
        <h2
          id="testimonios-heading"
          className="font-display text-2xl font-bold text-brand-dark sm:text-3xl dark:text-white"
        >
          Lo que dicen los mayoristas
        </h2>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-brand-dark/60 dark:text-white/60">
        Referencias de ejemplo para la prueba social B2B. Se reemplazan cuando el
        cliente envíe testimonios reales.
      </p>
      <ul className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <li key={item.id}>
            <Reveal delayMs={Math.min(index, 2) * 80}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-brand-primary/25 bg-white p-5 shadow-[0_0_18px_rgba(18,126,201,0.12)] dark:bg-[#102a40]">
                <Quote
                  className="h-6 w-6 text-brand-primary"
                  strokeWidth={2}
                  aria-hidden
                />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-dark/80 dark:text-white/80">
                  {item.quote}
                </p>
                <footer className="mt-4">
                  <p className="font-display text-sm font-bold text-brand-dark dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-brand-dark/55 dark:text-white/55">
                    {item.role}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
