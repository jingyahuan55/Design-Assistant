type SectionCardProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function SectionCard({ title, eyebrow, children }: SectionCardProps) {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{eyebrow}</p>
      ) : null}
      <h2 className="mb-4 text-xl font-semibold text-stone-900">{title}</h2>
      <div className="space-y-4 text-sm leading-6 text-stone-700">{children}</div>
    </section>
  );
}

