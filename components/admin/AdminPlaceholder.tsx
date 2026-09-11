export default function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold text-brand-dark">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-dark/70">{description}</p>
      <p className="mt-6 rounded-xl bg-brand-gray px-4 py-3 text-sm text-brand-dark/80">
        Módulo en diseño base. Los datos reales llegarán cuando haya backend.
      </p>
    </div>
  );
}
