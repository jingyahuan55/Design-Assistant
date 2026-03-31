type SectionCardProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SectionCard({ title, eyebrow, children, className }: SectionCardProps) {
  return (
    <section className={joinClasses("glass-panel rounded-[32px] p-6 md:p-7", className)}>
      {eyebrow ? <p className="field-label">{eyebrow}</p> : null}
      <h2 className="display-title mt-4 text-2xl text-stone-900 md:text-[2rem]">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--foreground-soft)]">{children}</div>
    </section>
  );
}
