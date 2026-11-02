import {
  LEGAL_UPDATED,
  PRIVACY_PARAGRAPHS,
  TERMS_PARAGRAPHS,
} from "@/data/legal";

export type LegalDoc = "terminos" | "privacidad";

export default function LegalCopy({ doc }: { doc: LegalDoc }) {
  const paragraphs =
    doc === "terminos" ? TERMS_PARAGRAPHS : PRIVACY_PARAGRAPHS;

  return (
    <div className="space-y-4 text-sm leading-relaxed text-brand-dark/80">
      <p className="text-xs text-brand-dark/50">
        Última actualización: {LEGAL_UPDATED}
      </p>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
