import Link from "next/link";

const pillars = [
  {
    label: "Theme Parsing",
    body: "Translate a rough concept into keywords, tone cues, and a believable visual direction."
  },
  {
    label: "Image Adaptation",
    body: "Use one reference image to suggest overlays, text color, safe zones, and palette hints."
  },
  {
    label: "Token Output",
    body: "Export CSS variables and Tailwind-ready color snippets for immediate handoff."
  }
];

const previewTokens = ["#C86A2F", "#1F6D63", "#FFF9F2", "#1D1A16"];

export default function HomePage() {
  return (
    <main className="space-y-8 md:space-y-10">
      <section className="glass-panel overflow-hidden rounded-[42px] px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
        <div className="hero-orb h-44 w-44 bg-[rgba(200,106,47,0.18)] left-[-1rem] top-[-1rem]" />
        <div className="hero-orb h-56 w-56 bg-[rgba(31,109,99,0.16)] right-[6%] top-[8%]" />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <span className="eyebrow-chip">Design Workflow MVP</span>
            <h1 className="display-title mt-5 max-w-4xl text-5xl leading-[0.94] text-stone-900 md:text-7xl">
              Turn raw themes into a visual system your demo can actually use.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--foreground-soft)] md:text-xl">
              This version is built for the messy middle of product design: you have a theme, a few keywords, maybe one
              image, and you need a design language that feels intentional fast.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="cta-primary" href="/workspace">
                Start a new direction
              </Link>
              <Link className="cta-secondary" href="/result">
                Open result board
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="metric-pill">
                <span className="metric-label">Input</span>
                <span className="metric-value">Theme + image</span>
                <p className="metric-copy">One form, one upload, one analysis pass.</p>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Output</span>
                <span className="metric-value">Structured tokens</span>
                <p className="metric-copy">Color roles, image guidance, and export snippets.</p>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Use case</span>
                <span className="metric-value">High-fidelity demos</span>
                <p className="metric-copy">Built for students and product-minded designers.</p>
              </div>
            </div>
          </div>

          <div className="board-grid">
            <article className="board-card">
              <p className="field-label">Preview Board</p>
              <div className="mt-4 rounded-[1.8rem] border border-[var(--line)] bg-white/70 p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="board-chip">warm civic color</span>
                  <span className="board-chip">editorial cards</span>
                  <span className="board-chip">soft overlays</span>
                </div>

                <div className="mt-5 grid gap-3 rounded-[1.4rem] bg-[rgba(31,109,99,0.08)] p-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Visual Strategy</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">
                      Use one food-adjacent warm primary, balance it with a calm green, and keep the surface quiet.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {previewTokens.map((token) => (
                      <span className="preview-swatch" key={token} style={{ backgroundColor: token }} title={token} />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="grid gap-3 md:grid-cols-2">
              {pillars.map((pillar) => (
                <div className="panel-soft rounded-[28px] p-5" key={pillar.label}>
                  <p className="field-label">{pillar.label}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">{pillar.body}</p>
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="glass-panel rounded-[34px] p-6 md:p-8">
          <span className="eyebrow-chip">How It Works</span>
          <h2 className="display-title mt-5 text-3xl text-stone-900 md:text-5xl">A small workflow that still feels like a real tool.</h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-[var(--foreground-soft)]">
            <p>Start with one theme, one project context, and optional image. The tool returns a direction board instead of a blank canvas.</p>
            <p>Each result is structured: summary, moodboard, color system, image adaptation, accessibility signals, and exportable tokens.</p>
            <p>That makes it useful both as a design aid and as a bridge into code or Figma token workflows later.</p>
          </div>
        </article>

        <article className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <div className="glass-panel rounded-[28px] p-6" key={pillar.label}>
              <p className="field-label">Pillar 0{index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-stone-900">{pillar.label}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">{pillar.body}</p>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
