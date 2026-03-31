import Link from "next/link";

const pillars = [
  "Turn themes into structured visual direction.",
  "Accept one reference image and return adaptation advice.",
  "Export CSS variables and a Tailwind snippet for quick handoff."
];

export default function HomePage() {
  return (
    <main className="space-y-8">
      <section className="glass-panel rounded-[36px] px-6 py-12 md:px-10 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">Landing</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-900 md:text-6xl">
          Turn a theme and one image into a usable design language.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
          This one-day MVP skeleton is focused on the shortest path: landing page, workspace, result page, and
          placeholder APIs that return a structured design direction.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            href="/workspace"
          >
            Start from workspace
          </Link>
          <Link className="rounded-full border border-stone-300 bg-white/80 px-5 py-3 text-sm font-semibold" href="/result">
            Preview result layout
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <article className="glass-panel rounded-[28px] p-6" key={pillar}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Pillar 0{index + 1}</p>
            <p className="mt-4 text-base leading-7 text-stone-800">{pillar}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

