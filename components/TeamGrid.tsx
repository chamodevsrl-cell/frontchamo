"use client";

import Reveal from "@/components/Reveal";
import CmsImage from "@/components/CmsImage";
import { useSiteContent } from "@/components/ContentProvider";

export default function TeamGrid() {
  const { team, ready } = useSiteContent();

  if (!ready || team.length === 0) return null;

  return (
    <Reveal delayMs={120}>
      <section aria-labelledby="equipo-heading">
        <p className="text-sm font-bold tracking-wide text-brand-primary uppercase">
          Trabajo
        </p>
        <h2
          id="equipo-heading"
          className="mt-2 font-display text-2xl font-extrabold text-brand-dark sm:text-3xl dark:text-white"
        >
          Nuestro equipo
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-brand-dark/70 dark:text-white/70">
          Quienes atienden pedidos, asesoran líneas y mueven el almacén.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <li
              key={member.id}
              className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-[0_8px_24px_rgba(11,53,84,0.08)] dark:bg-[#102a40]"
            >
              <div className="relative h-52 bg-brand-gray">
                <CmsImage
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                  {member.role}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-brand-dark dark:text-white">
                  {member.name}
                </h3>
                {member.bio ? (
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/70 dark:text-white/70">
                    {member.bio}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
