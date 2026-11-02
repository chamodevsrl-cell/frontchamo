import { companyStats } from "@/data/company";

export default function CompanyStats() {
  return (
    <section
      aria-labelledby="solidez-heading"
      className="bg-brand-dark text-white"
    >
      <div className="mx-auto max-w-[1100px] px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-20 sm:pb-14 lg:px-8">
        <p className="font-display text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase">
          Respaldo comercial
        </p>
        <h2
          id="solidez-heading"
          className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl"
        >
          Solidez en Cifras
        </h2>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          {companyStats.map((item) => (
            <li key={item.id} className="min-w-0">
              <p
                className={`font-display leading-none font-extrabold tracking-tight ${
                  item.accentAll ? "text-brand-gold" : "text-white"
                } ${
                  item.value.length > 3
                    ? "text-4xl sm:text-5xl"
                    : "text-5xl sm:text-6xl"
                }`}
              >
                {item.prefix ? (
                  <span className="text-brand-gold">{item.prefix}</span>
                ) : null}
                {item.value}
                {item.suffix ? (
                  <span className="ml-0.5 align-middle text-lg font-bold tracking-normal text-white/55 sm:text-xl">
                    {item.suffix}
                  </span>
                ) : null}
              </p>
              <p className="mt-3 font-display text-sm font-bold text-white sm:text-base">
                {item.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {item.hint}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 xl:px-10" aria-hidden>
        <span className="mx-auto block h-px w-full max-w-[1600px] bg-brand-gold" />
      </div>
    </section>
  );
}
