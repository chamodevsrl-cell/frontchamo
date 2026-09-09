import type { ReactNode } from "react";

type StampHeadingProps = {
  lead?: string;
  accent: string;
  as?: "h1" | "h2";
  variant?: "default" | "offer";
  id?: string;
  className?: string;
};

const variants = {
  default: {
    box: "border-brand-dark bg-white shadow-[8px_8px_0_0_#0B3554]",
    lead: "text-brand-dark",
    accent: "text-brand-primary",
    rotate: "-rotate-2",
  },
  offer: {
    box: "border-brand-gold bg-brand-primary shadow-[8px_8px_0_0_#0B3554]",
    lead: "text-white",
    accent: "text-brand-gold",
    rotate: "rotate-2",
  },
} as const;

export default function StampHeading({
  lead,
  accent,
  as: Tag = "h1",
  variant = "default",
  id,
  className,
}: StampHeadingProps) {
  const style = variants[variant];
  const label = [lead, accent].filter(Boolean).join(" ");

  return (
    <div
      className={`relative inline-block ${style.rotate} ${className ?? ""}`}
    >
      <Tag
        id={id}
        aria-label={label}
        className={`relative z-10 border-[4px] px-5 py-2.5 text-center font-display text-3xl font-extrabold tracking-tight uppercase sm:whitespace-nowrap sm:border-[5px] sm:px-8 sm:py-3.5 sm:text-5xl lg:text-6xl ${style.box}`}
      >
        {lead ? (
          <>
            <span className={style.lead}>{lead}</span>{" "}
            <span className={style.accent}>{accent}</span>
          </>
        ) : (
          <span className={style.accent}>{accent}</span>
        )}
      </Tag>
      {variant === "offer" ? (
        <span className="absolute -top-3 -right-2 z-20 rotate-12 border-[3px] border-brand-dark bg-brand-gold px-2 py-0.5 font-display text-[11px] font-extrabold tracking-wide text-brand-dark uppercase sm:-top-4 sm:-right-3 sm:text-xs">
          -%
        </span>
      ) : null}
    </div>
  );
}

export function StampBand({ children }: { children: ReactNode }) {
  return (
    <header className="stamp-dots mb-8 flex flex-col items-center rounded-2xl border border-brand-dark/10 px-4 py-10 text-center sm:py-12 dark:border-white/10">
      {children}
    </header>
  );
}
